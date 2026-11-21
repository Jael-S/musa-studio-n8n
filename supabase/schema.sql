-- ==============================================================
-- MUSA STUDIO - ESQUEMA DE BASE DE DATOS (SUPABASE / POSTGRESQL)
-- Hackathon Nodo Cero Bolivia 2026
-- ==============================================================

-- 1. Habilitar extensión UUID
create extension if not exists "uuid-ossp";

-- 2. Tabla de Perfiles de Usuarias (Artistas)
create table if not exists public.perfiles (
    id uuid primary key default uuid_generate_v4(),
    clerk_id text unique,
    nombre text not null,
    email text,
    disciplina_principal text default 'Dibujo tradicional',
    meta_creativa text default 'Mejorar proporciones y volumen en retratos',
    racha_dias integer default 1,
    avatar_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Tabla de Obras y Bocetos
create table if not exists public.obras (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.perfiles(id) on delete cascade,
    titulo text not null,
    categoria text default 'Boceto',
    descripcion_notas text,
    imagen_url text,
    puntaje_progreso integer default 70,
    evaluacion_general text,
    logros_destacados jsonb default '[]'::jsonb,
    mejoras_tecnicas jsonb default '[]'::jsonb,
    siguiente_reto text,
    origen text default 'n8n_form',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Tabla de Retos Creativos y Seguimiento
create table if not exists public.retos (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.perfiles(id) on delete cascade,
    obra_origen_id uuid references public.obras(id) on delete set null,
    titulo text not null,
    descripcion text not null,
    objetivo_tecnico text,
    fecha_limite timestamp with time zone,
    estado text default 'pendiente' check (estado in ('pendiente', 'completado', 'expirado')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Índices para acelerar consultas de n8n
create index if not exists idx_obras_user on public.obras(user_id, created_at desc);
create index if not exists idx_retos_pendientes on public.retos(user_id, estado);

-- 6. Habilitar Row Level Security (RLS)
alter table public.perfiles enable row level security;
alter table public.obras enable row level security;
alter table public.retos enable row level security;

-- Políticas de lectura/escritura abiertas para la API de n8n con service_role o clave anónima de prueba
create policy "Lectura pública de perfiles" on public.perfiles for select using (true);
create policy "Insertar perfiles vía n8n" on public.perfiles for insert with check (true);
create policy "Lectura pública de obras" on public.obras for select using (true);
create policy "Insertar obras vía n8n" on public.obras for insert with check (true);
create policy "Lectura pública de retos" on public.retos for select using (true);
create policy "Insertar retos vía n8n" on public.retos for insert with check (true);
create policy "Actualizar retos vía n8n" on public.retos for update using (true);
