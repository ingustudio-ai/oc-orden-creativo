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

-- Waitlist: cualquiera puede sumarse; nadie lee la lista desde el cliente
drop policy if exists "waitlist_insert_any" on public.waitlist;
create policy "waitlist_insert_any"
  on public.waitlist for insert
  to anon, authenticated
  with check (true);

drop policy if exists "waitlist_select_own_email" on public.waitlist;
create policy "waitlist_select_own_email"
  on public.waitlist for select
  to authenticated
  using (true);

/* ========================= GRANTS / REVOKE ========================= */

grant usage on schema public to anon, authenticated;

grant select, update on public.profiles to authenticated;
grant insert on public.waitlist to anon, authenticated;
grant select on public.waitlist to authenticated;
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
