-- ==============================================================
-- MUSA STUDIO - SEED DATA PARA DEMO EN VIVO
-- Crea a Camila Vargas con 2 obras previas para demostrar
-- la memoria evolutiva (Semana 1 y Semana 2) ante el jurado
-- ==============================================================

-- 1. Insertar perfil de Camila
insert into public.perfiles (clerk_user_id, nombre, disciplina, meta_actual)
values (
    'user_clerk_demo_camila',
    'Camila Vargas',
    'Dibujo tradicional a grafito',
    'Corregir simetría en rostros de 3/4 y lograr volumen realista'
) on conflict (clerk_user_id) do update set
    nombre = excluded.nombre,
    disciplina = excluded.disciplina,
    meta_actual = excluded.meta_actual;

-- 2. Insertar Obra 1 (Hace 14 días - El inicio del viaje)
insert into public.obras_progreso (
    id,
    clerk_user_id,
    imagen_path,
    notas_usuaria,
    feedback_ia,
    created_at
) values (
    '11111111-1111-1111-1111-111111111111',
    'user_clerk_demo_camila',
    'user_clerk_demo_camila/semana_1_boceto_inicial.jpg',
    'Primer intento de rostro en 3/4. Siento que el ojo derecho me quedó caído y el sombreado en la mejilla se ve sucio.',
    '{
        "aciertos": ["Buena intención en la curva de la mandíbula", "Trazo suelto en el cabello"],
        "consejo_tecnico": "Traza un eje horizontal de guía antes de dibujar el segundo ojo y gradúa la presión del lápiz.",
        "comparacion": null,
        "siguiente_reto": "Dibuja 3 pares de ojos alineados con una línea de horizonte.",
        "mensaje": "¡Bienvenida a Musa, Camila! Todo gran artista empezó con un primer boceto."
    }'::jsonb,
    now() - interval '14 days'
) on conflict (id) do nothing;

-- 3. Insertar Obra 2 (Hace 7 días - Progreso intermedio)
insert into public.obras_progreso (
    id,
    clerk_user_id,
    imagen_path,
    notas_usuaria,
    feedback_ia,
    created_at
) values (
    '22222222-2222-2222-2222-222222222222',
    'user_clerk_demo_camila',
    'user_clerk_demo_camila/semana_2_estudio_ojos.jpg',
    'Apliqué el reto de la línea de horizonte. Los ojos quedaron mucho más parejos, pero el pómulo sigue viéndose plano.',
    '{
        "aciertos": ["Excelente nivelación de las pupilas y lagrimales", "Proporciones faciales más armónicas"],
        "consejo_tecnico": "Usa un lápiz 4B para la sombra más profunda debajo del pómulo y deja que la luz respire en el centro.",
        "comparacion": "Respecto a tu primer boceto, la simetría ocular mejoró radicalmente. El rostro ya tiene dirección de mirada creíble.",
        "siguiente_reto": "Aplica sombra en capas (2B base, 4B sombra profunda) en el pómulo izquierdo.",
        "mensaje": "¡Se nota el trabajo de esta semana! Estás construyendo memoria muscular."
    }'::jsonb,
    now() - interval '7 days'
) on conflict (id) do nothing;

-- 4. Insertar recordatorio de práctica activo
insert into public.recordatorios (
    id,
    clerk_user_id,
    proxima_fecha,
    frecuencia,
    activo
) values (
    '33333333-3333-3333-3333-333333333333',
    'user_clerk_demo_camila',
    now() - interval '1 hour', -- Vencido para probar el Workflow 3 en vivo
    'cada 3 dias',
    true
) on conflict (id) do nothing;
