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
