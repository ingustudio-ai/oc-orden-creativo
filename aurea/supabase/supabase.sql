/* ==========================================================================
   ÁUREA · Oráculo Sistémico de 22 Arcanos
   Orden Creativo · Fernando Matías Acri
   Esquema de Supabase: perfiles, códigos de activación, lecturas, waitlist.
   Ejecutar en: Supabase Dashboard → SQL Editor → New query → Run
   ========================================================================== */

-- Extensiones (ya suelen estar habilitadas en Supabase)
create extension if not exists "pgcrypto";

/* ========================= TABLAS ========================= */

-- Perfiles: uno por usuario de auth.users
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  email       text,
  phone       text,
  has_access  boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Códigos de activación del Kit Completo
create table if not exists public.activation_codes (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,
  used_by     uuid references auth.users (id) on delete set null,
  used_at     timestamptz,
  created_at  timestamptz not null default now()
);

-- Historial de lecturas (tiradas de 3 cartas)
create table if not exists public.readings (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  question    text not null default '—',
  cards       jsonb not null default '[]'::jsonb,
  created_at  timestamptz not null default now()
);

-- Lista de espera de la landing
create table if not exists public.waitlist (
  id          uuid primary key default gen_random_uuid(),
  full_name   text not null,
  email       text not null unique,
  phone       text,
  source      text not null default 'landing-aurea',
  created_at  timestamptz not null default now()
);

create index if not exists readings_user_created_idx
  on public.readings (user_id, created_at desc);

create index if not exists activation_codes_used_by_idx
  on public.activation_codes (used_by);

/* ========================= TRIGGER · NUEVO USUARIO ========================= */

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, has_access)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.email,
    false
  )
  on conflict (id) do update
    set full_name = coalesce(excluded.full_name, public.profiles.full_name),
        email     = coalesce(excluded.email, public.profiles.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

/* ========================= FUNCIÓN · CANJEAR CÓDIGO =========================
   Mensajes distintos para código inválido vs. ya utilizado.
   Uso en el cliente: supabase.rpc("redeem_activation_code", { p_code: "..." })
   Devuelve: { success: boolean, message: string, has_access?: boolean }
   ======================================================================== */

create or replace function public.redeem_activation_code(p_code text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_code_id uuid;
  v_used_by uuid;
  v_norm text;
begin
  if v_user_id is null then
    return jsonb_build_object(
      'success', false,
      'message', 'Iniciá sesión para poder activar tu código.'
    );
  end if;

  v_norm := upper(trim(coalesce(p_code, '')));

  if v_norm = '' then
    return jsonb_build_object(
      'success', false,
      'message', 'El código de activación no es válido.'
    );
  end if;

  select id, used_by
    into v_code_id, v_used_by
  from public.activation_codes
  where code = v_norm;

  if v_code_id is null then
    return jsonb_build_object(
      'success', false,
      'message', 'El código de activación no es válido.'
    );
  end if;

  if v_used_by is not null then
    return jsonb_build_object(
      'success', false,
      'message', 'Este código ya fue utilizado.'
    );
  end if;

  -- Canje atómico: solo avanza si nadie lo usó antes
  update public.activation_codes
     set used_by = v_user_id,
         used_at = now()
   where id = v_code_id
     and used_by is null
  returning id into v_code_id;

  if v_code_id is null then
    return jsonb_build_object(
      'success', false,
      'message', 'Este código ya fue utilizado.'
    );
  end if;

  insert into public.profiles (id, email, has_access)
  values (v_user_id, (select email from auth.users where id = v_user_id), true)
  on conflict (id) do update set has_access = true;

  return jsonb_build_object(
    'success', true,
    'message', 'Acceso activado. Bienvenido/a a Áurea.',
    'has_access', true
  );
end;
$$;

/* ========================= ROW LEVEL SECURITY ========================= */

alter table public.profiles        enable row level security;
alter table public.activation_codes enable row level security;
alter table public.readings        enable row level security;
alter table public.waitlist        enable row level security;

-- Profiles: cada usuario ve/edita el suyo
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Activation codes: el cliente no tiene acceso directo (solo la RPC)
drop policy if exists "activation_codes_select_own" on public.activation_codes;
create policy "activation_codes_select_own"
  on public.activation_codes for select
  to authenticated
  using (used_by = auth.uid());

-- Readings: CRUD propio
drop policy if exists "readings_select_own" on public.readings;
create policy "readings_select_own"
  on public.readings for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "readings_insert_own" on public.readings;
create policy "readings_insert_own"
  on public.readings for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "readings_update_own" on public.readings;
create policy "readings_update_own"
  on public.readings for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "readings_delete_own" on public.readings;
create policy "readings_delete_own"
  on public.readings for delete
  to authenticated
  using (user_id = auth.uid());

-- Waitlist: cualquiera puede sumarse; NADIE puede leer la lista desde el cliente.
-- La política anterior ("waitlist_select_own_email" ... using (true)) filtraba
-- todos los nombres, emails y teléfonos a cualquier usuario autenticado.
drop policy if exists "waitlist_select_own_email" on public.waitlist;
drop policy if exists "waitlist_select_any" on public.waitlist;

drop policy if exists "waitlist_insert_any" on public.waitlist;
create policy "waitlist_insert_any"
  on public.waitlist for insert
  to anon, authenticated
  with check (true);

-- Sin lectura ni escritura directa: los datos históricos solo se consultan
-- desde el dashboard o con la service_role key.
revoke all on public.waitlist from anon, authenticated;
grant insert on public.waitlist to anon, authenticated;

/* ========================= GRANTS / REVOKE ========================= */

grant usage on schema public to anon, authenticated;

grant select, update on public.profiles to authenticated;
-- Waitlist: solo alta. La lectura queda cerrada a propósito (ver política).
grant insert on public.waitlist to anon, authenticated;
grant select, insert, update, delete on public.readings to authenticated;

-- Códigos: sin acceso directo desde el cliente
revoke all on public.activation_codes from anon, authenticated;
grant execute on function public.redeem_activation_code(text) to authenticated;
grant execute on function public.handle_new_user() to service_role;

/* ========================= DATOS DE EJEMPLO (OPCIONAL) =========================
   Descomentar para generar códigos de prueba. En producción, generarlos
   desde el dashboard o con un script interno; nunca exponer la lista al cliente.

insert into public.activation_codes (code) values
  ('AUREA-001-2026'),
  ('AUREA-002-2026'),
  ('AUREA-DEMO-TEST')
on conflict (code) do nothing;
   ======================================================================== */


-- ==========================================================================
-- COMUNIDAD ÁUREA (ver también aurea/supabase/community.sql)
-- ==========================================================================

/* ==========================================================================
   ÁUREA · Comunidad Áurea — migración de base de datos
   Ejecutar en Supabase SQL Editor (o concatenar a supabase.sql).
   Requiere: profiles, auth.users existentes.
   ========================================================================== */

/* ---------- Perfiles: marca de administrador ---------- */
alter table public.profiles
  add column if not exists is_admin boolean not null default false;

/* ---------- Membresías de la comunidad ---------- */
create table if not exists public.community_memberships (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null unique references auth.users(id) on delete cascade,
  status        text not null default 'pending'
                  check (status in ('pending', 'approved', 'rejected')),
  is_founder    boolean not null default false,
  requested_at  timestamptz not null default now(),
  approved_at   timestamptz,
  updated_at    timestamptz not null default now()
);

create index if not exists community_memberships_status_idx
  on public.community_memberships (status);

alter table public.community_memberships enable row level security;

/* ---------- Configuración de la comunidad (enlace privado, etc.) ---------- */
create table if not exists public.community_config (
  key         text primary key,
  value       text,
  updated_at  timestamptz not null default now(),
  updated_by  uuid references auth.users(id)
);

alter table public.community_config enable row level security;

/* Seed: la URL de invitación se carga desde el dashboard (service role)
   o mediante la RPC admin_set_community_invite_url. */
insert into public.community_config (key, value)
values ('community_invite_url', null)
on conflict (key) do nothing;

/* ---------- Helpers ---------- */
create or replace function public.is_community_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select p.is_admin from public.profiles p where p.id = auth.uid()),
    false
  );
$$;

/* ---------- RPC: estado de membresía del usuario actual ---------- */
create or replace function public.get_community_status()
returns table (
  status        text,
  is_founder    boolean,
  requested_at  timestamptz,
  approved_at   timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'No autenticado';
  end if;
  return query
    select cm.status, cm.is_founder, cm.requested_at, cm.approved_at
    from public.community_memberships cm
    where cm.user_id = auth.uid();
end;
$$;

/* ---------- RPC: solicitar ingreso (idempotente) ---------- */
create or replace function public.request_community_membership()
returns table (status text, created boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status text;
  v_created boolean := false;
begin
  if auth.uid() is null then
    raise exception 'No autenticado';
  end if;

  -- Solo usuarios con acceso activo a la app pueden solicitar.
  if not exists (select 1 from public.profiles p where p.id = auth.uid() and p.has_access = true) then
    raise exception 'Sin acceso activo a ÁUREA';
  end if;

  select cm.status into v_status
  from public.community_memberships cm
  where cm.user_id = auth.uid();

  if v_status is null then
    insert into public.community_memberships (user_id, status)
    values (auth.uid(), 'pending');
    v_status := 'pending';
    v_created := true;
  end if;

  return query select v_status, v_created;
end;
$$;

/* ---------- RPC: obtener enlace de invitación (solo aprobados) ---------- */
create or replace function public.get_community_invite_url()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_url text;
begin
  if auth.uid() is null then
    return null;
  end if;
  if not exists (
    select 1 from public.community_memberships cm
    where cm.user_id = auth.uid() and cm.status = 'approved'
  ) then
    return null;
  end if;
  select value into v_url from public.community_config where key = 'community_invite_url';
  return v_url;
end;
$$;

/* ---------- RPC ADMIN: listar solicitudes ---------- */
create or replace function public.admin_list_community_memberships()
returns table (
  user_id       uuid,
  email         text,
  full_name     text,
  status        text,
  is_founder    boolean,
  requested_at  timestamptz,
  approved_at   timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_community_admin() then
    raise exception 'No autorizado';
  end if;
  return query
    select cm.user_id, p.email, p.full_name, cm.status, cm.is_founder,
           cm.requested_at, cm.approved_at
    from public.community_memberships cm
    left join public.profiles p on p.id = cm.user_id
    order by cm.requested_at desc;
end;
$$;

/* ---------- RPC ADMIN: cambiar estado / fundador ---------- */
create or replace function public.admin_set_community_membership(
  p_user_id    uuid,
  p_status     text,
  p_is_founder boolean
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_community_admin() then
    raise exception 'No autorizado';
  end if;
  if p_status not in ('pending', 'approved', 'rejected') then
    raise exception 'Estado inválido';
  end if;
  update public.community_memberships
  set status = p_status,
      is_founder = coalesce(p_is_founder, is_founder),
      approved_at = case when p_status = 'approved' then now() else approved_at end,
      updated_at = now()
  where user_id = p_user_id;
  if not found then
    insert into public.community_memberships (user_id, status, is_founder, approved_at)
    values (p_user_id, p_status, coalesce(p_is_founder, false),
            case when p_status = 'approved' then now() else null end);
  end if;
  return true;
end;
$$;

/* ---------- RPC ADMIN: configurar enlace de invitación ---------- */
create or replace function public.admin_set_community_invite_url(p_url text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_community_admin() then
    raise exception 'No autorizado';
  end if;
  insert into public.community_config (key, value, updated_at, updated_by)
  values ('community_invite_url', nullif(trim(p_url), ''), now(), auth.uid())
  on conflict (key) do update
    set value = excluded.value, updated_at = now(), updated_by = auth.uid();
  return true;
end;
$$;

/* ---------- RPC ADMIN: configurar beneficios de formación (placeholder) ---------- */
create or replace function public.admin_set_formacion_config(p_key text, p_value text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_community_admin() then
    raise exception 'No autorizado';
  end if;
  if p_key not in ('formacion_launch_date', 'formacion_general_price', 'formacion_founder_price', 'formacion_notes') then
    raise exception 'Clave no permitida';
  end if;
  insert into public.community_config (key, value, updated_at, updated_by)
  values (p_key, nullif(trim(p_value), ''), now(), auth.uid())
  on conflict (key) do update
    set value = excluded.value, updated_at = now(), updated_by = auth.uid();
  return true;
end;
$$;

/* ---------- RPC: leer config de formación (pública para usuarios activos) ---------- */
create or replace function public.get_formacion_config()
returns table (key text, value text)
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return;
  end if;
  if not exists (select 1 from public.profiles p where p.id = auth.uid() and p.has_access = true) then
    return;
  end if;
  return query
    select cc.key, cc.value
    from public.community_config cc
    where cc.key in ('formacion_launch_date', 'formacion_general_price', 'formacion_founder_price', 'formacion_notes');
end;
$$;

/* ---------- RLS ---------- */
-- community_memberships: el usuario lee solo la propia; escritura solo vía RPC.
drop policy if exists "cm_select_own" on public.community_memberships;
create policy "cm_select_own"
  on public.community_memberships for select
  to authenticated
  using (user_id = auth.uid());

-- Admins leen todas (vía RPC de todas formas, pero por si acaso).
drop policy if exists "cm_admin_all" on public.community_memberships;
create policy "cm_admin_all"
  on public.community_memberships for all
  to authenticated
  using (public.is_community_admin())
  with check (public.is_community_admin());

-- community_config: sin acceso directo; solo RPCs.
revoke all on public.community_config from anon, authenticated;

/* ---------- Grants ---------- */
grant execute on function public.is_community_admin() to authenticated;
grant execute on function public.get_community_status() to authenticated;
grant execute on function public.request_community_membership() to authenticated;
grant execute on function public.get_community_invite_url() to authenticated;
grant execute on function public.admin_list_community_memberships() to authenticated;
grant execute on function public.admin_set_community_membership(uuid, text, boolean) to authenticated;
grant execute on function public.admin_set_community_invite_url(text) to authenticated;
grant execute on function public.admin_set_formacion_config(text, text) to authenticated;
grant execute on function public.get_formacion_config() to authenticated;

/* ---------- Para activar un admin, ejecutar manualmente: ----------
   update public.profiles set is_admin = true where email = 'tu@email.com';
   --------------------------------------------------------------- */

