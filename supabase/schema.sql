-- MotoYa pre-registros: ejecutar en Supabase SQL Editor.
-- La clave anon/public del navegador solo puede insertar; RLS bloquea lectura,
-- modificación y borrado desde el cliente.

create table if not exists public.pre_registros (
  id bigint generated always as identity primary key,
  tipo text not null check (tipo in ('Socio conductor', 'Usuario', 'Comercio o negocio')),
  nombre text not null check (char_length(trim(nombre)) between 2 and 100),
  telefono text not null check (char_length(trim(telefono)) between 5 and 30),
  zona text check (zona is null or char_length(zona) <= 120),
  correo text check (correo is null or char_length(correo) <= 254),
  detalle text check (detalle is null or char_length(detalle) <= 1000),
  consentimiento boolean not null check (consentimiento = true),
  creado_en timestamptz not null default now()
);

alter table public.pre_registros enable row level security;

revoke all on table public.pre_registros from anon, authenticated;
grant insert (tipo, nombre, telefono, zona, correo, detalle, consentimiento)
  on table public.pre_registros to anon;

drop policy if exists "Permitir pre-registro público" on public.pre_registros;
create policy "Permitir pre-registro público"
  on public.pre_registros
  for insert
  to anon
  with check (
    consentimiento = true
    and tipo in ('Socio conductor', 'Usuario', 'Comercio o negocio')
    and char_length(trim(nombre)) between 2 and 100
    and char_length(trim(telefono)) between 5 and 30
    and (zona is null or char_length(zona) <= 120)
    and (correo is null or char_length(correo) <= 254)
    and (detalle is null or char_length(detalle) <= 1000)
  );

-- No crear políticas SELECT para anon: los visitantes no pueden leer datos personales.
