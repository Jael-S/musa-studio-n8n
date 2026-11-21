-- ==============================================================
-- MUSA STUDIO - DATOS DE PRUEBA PARA DEMO EN VIVO
-- Inserta un perfil de creadora y su obra anterior (Semana 1)
-- para que Gemini compare en vivo contra su avance de Semana 2
-- ==============================================================

-- 1. Insertar perfil de creadora joven
insert into public.perfiles (id, clerk_id, nombre, email, disciplina_principal, meta_creativa, racha_dias)
values (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'user_clerk_demo_camila',
    'Camila Vargas',
    'camila.vargas.arte@example.com',
    'Ilustración digital & Bocetos a lápiz',
    'Dominar sombreado y perspectiva en rostros y manos',
    5
) on conflict (id) do nothing;

-- 2. Insertar su obra de la semana pasada (Semana 1 - El punto de partida evolutivo)
insert into public.obras (
    id,
    user_id,
    titulo,
    categoria,
    descripcion_notas,
    imagen_url,
    puntaje_progreso,
    evaluacion_general,
    logros_destacados,
    mejoras_tecnicas,
    siguiente_reto,
    created_at
) values (
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Boceto inicial de rostro (Semana 1)',
    'Retrato a grafito',
    'Primer intento de retrato en 3/4. Siento que los ojos quedaron desiguales y el sombreado en la mejilla se ve muy plano.',
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
    62,
    'Buen dinamismo inicial y expresividad en la mirada. Las proporciones generales están bien planteadas para ser un boceto rápido.',
    '["Buena intención en la línea del mentón", "Captura inicial de la dirección de la mirada"]'::jsonb,
    '["Construir primero el eje de simetría antes de ubicar el segundo ojo", "Graduar el grafito (usar 2B o 4B) para dar profundidad a los pómulos sin ensuciar el papel"]'::jsonb,
    'Reto Semana 1: Dibuja 3 pares de ojos en perspectiva de 3/4 usando una línea guía de horizonte.',
    now() - interval '7 days'
) on conflict (id) do nothing;

-- 3. Insertar el reto que tenía activo
insert into public.retos (
    id,
    user_id,
    obra_origen_id,
    titulo,
    descripcion,
    objetivo_tecnico,
    fecha_limite,
    estado,
    created_at
) values (
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'Reto de Perspectiva Facial: Ojos en 3/4',
    'Dibuja un nuevo rostro aplicando una línea guía horizontal para alinear pupilas y lagrimales en perspectiva.',
    'Corregir simetría y gradiente de sombra en pómulo',
    now() + interval '2 days',
    'pendiente',
    now() - interval '7 days'
) on conflict (id) do nothing;
