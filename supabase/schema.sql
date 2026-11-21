-- ==============================================================
-- MUSA STUDIO - ESQUEMA EXACTO DE BASE DE DATOS (SUPABASE)
-- Contrato de Integración para Hackathon Nodo Cero 2026
-- ==============================================================

-- 1. Habilitar extensión UUID
create extension if not exists "uuid-ossp";

-- 2. Tabla: perfiles
-- Contrato: (clerk_user_id, nombre, disciplina, meta_actual, created_at)
create table if not exists public.perfiles (
    clerk_user_id text primary key,
    nombre text not null,
    disciplina text default 'Ilustración tradicional y digital',
    meta_actual text default 'Dominar anatomía, proporciones y volumen',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Tabla: obras_progreso
-- Contrato: (id, clerk_user_id, imagen_path, notas_usuaria, feedback_ia, created_at)
create table if not exists public.obras_progreso (
    id uuid primary key default uuid_generate_v4(),
    clerk_user_id text references public.perfiles(clerk_user_id) on delete cascade not null,
    imagen_path text not null,
    notas_usuaria text,
    feedback_ia jsonb default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Tabla: recordatorios
-- Contrato: (id, clerk_user_id, proxima_fecha, frecuencia, activo)
create table if not exists public.recordatorios (
    id uuid primary key default uuid_generate_v4(),
    clerk_user_id text references public.perfiles(clerk_user_id) on delete cascade not null,
    proxima_fecha timestamp with time zone not null,
    frecuencia text default 'cada 3 dias', -- 'diario', 'cada 3 dias', 'semanal'
    activo boolean default true not null
);

-- 5. Índices de optimización para consultas de n8n
create index if not exists idx_obras_progreso_user on public.obras_progreso(clerk_user_id, created_at desc);
create index if not exists idx_recordatorios_vencidos on public.recordatorios(activo, proxima_fecha);

-- 6. Configuración de Storage Bucket Privado 'obras'
insert into storage.buckets (id, name, public)
values ('obras', 'obras', false)
on conflict (id) do nothing;

-- 7. Políticas de Row Level Security (RLS)
alter table public.perfiles enable row level security;
alter table public.obras_progreso enable row level security;
alter table public.recordatorios enable row level security;

-- Políticas de acceso para n8n (Service Role) y Frontend (Anon / Authenticated)
create policy "Lectura abierta para perfiles" on public.perfiles for select using (true);
create policy "Inserción/Actualización perfiles" on public.perfiles for all using (true);

create policy "Lectura de obras_progreso" on public.obras_progreso for select using (true);
create policy "Inserción de obras_progreso" on public.obras_progreso for insert with check (true);

create policy "Lectura y actualización de recordatorios" on public.recordatorios for all using (true);

-- Permisos de Storage para subidas y lectura de URLs firmadas
create policy "Subida a bucket obras" on storage.objects for insert with check (bucket_id = 'obras');
create policy "Lectura de bucket obras" on storage.objects for select using (bucket_id = 'obras');
