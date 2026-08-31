-- ═══════════════════════════════════════════════════════════════════════
-- TrainerOS — Seed Data
-- Populates the database with sample data matching the original mock arrays.
-- Run with: supabase db reset (applies migrations + seed)
-- ═══════════════════════════════════════════════════════════════════════

-- ─── 1. Create a test trainer profile ─────────────────────────────────
-- NOTE: In production, profiles are created via auth triggers.
-- For seeding, we insert directly. The UUID must match an auth.users entry
-- or we skip the FK constraint during seeding.

-- We'll use a fixed UUID for the demo trainer
DO $$
DECLARE
  trainer_uuid UUID := '00000000-0000-0000-0000-000000000001';
BEGIN

-- Insert trainer profile (skip if auth.users constraint is enforced)
-- In local dev with supabase, you can create the user via Studio first
-- INSERT INTO public.profiles (id, role, nombre, apellido)
-- VALUES (trainer_uuid, 'trainer', 'Pablo', 'Díaz');

-- ─── 2. Exercises (10 from original mock) ─────────────────────────────
INSERT INTO public.exercises (id, trainer_id, nombre, grupo_muscular, grupos_secundarios, dificultad, instrucciones, video_url, duracion_estimada, series_default)
VALUES
  ('10000000-0000-0000-0000-000000000001', NULL, 'Press de Banca Plano', 'Pecho', ARRAY['Tríceps', 'Hombros']::muscle_group[], 'Intermedio',
    ARRAY['Mantén los codos a 45° del torso para proteger los hombros.', 'Baja la barra de forma controlada hasta rozar el pecho.', 'Empuja explosivamente hacia arriba manteniendo los omóplatos retraídos.'],
    '', 45, 4),
  ('10000000-0000-0000-0000-000000000002', NULL, 'Jalón al Pecho Prono', 'Espalda', ARRAY['Bíceps']::muscle_group[], 'Principiante',
    ARRAY['Siéntate con los muslos bien sujetos bajo el soporte.', 'Agarra la barra con agarre prono, separación mayor al ancho de hombros.', 'Jala la barra hacia la clavícula, contrayendo los dorsales.'],
    '', 40, 3),
  ('10000000-0000-0000-0000-000000000003', NULL, 'Sentadilla Libre', 'Piernas', ARRAY['Glúteos', 'Core']::muscle_group[], 'Intermedio',
    ARRAY['Posiciona la barra sobre los trapecios, no sobre el cuello.', 'Desciende hasta que los muslos estén paralelos al suelo.', 'Empuja el suelo con los talones al subir.'],
    '', 50, 4),
  ('10000000-0000-0000-0000-000000000004', NULL, 'Press Militar con Barra', 'Hombros', ARRAY['Tríceps']::muscle_group[], 'Intermedio',
    ARRAY['De pie, agarra la barra a la altura de los hombros.', 'Empuja la barra verticalmente por encima de la cabeza.', 'Bloquea los codos al final del recorrido.'],
    '', 40, 4),
  ('10000000-0000-0000-0000-000000000005', NULL, 'Elevaciones Laterales', 'Hombros', ARRAY[]::muscle_group[], 'Principiante',
    ARRAY['Sostén mancuernas a los costados con los codos ligeramente flexionados.', 'Eleva los brazos hasta la altura de los hombros.', 'Baja de forma controlada en 2-3 segundos.'],
    '', 30, 3),
  ('10000000-0000-0000-0000-000000000006', NULL, 'Press Inclinado c/ Mancuernas', 'Pecho', ARRAY['Tríceps', 'Hombros']::muscle_group[], 'Intermedio',
    ARRAY['Ajusta el banco a 30-45 grados de inclinación.', 'Baja las mancuernas con control hasta la altura del pecho.', 'Empuja hacia arriba y hacia adentro, contrayendo el pectoral superior.'],
    '', 45, 3),
  ('10000000-0000-0000-0000-000000000007', NULL, 'Aperturas en Polea', 'Pecho', ARRAY[]::muscle_group[], 'Principiante',
    ARRAY['Configura las poleas en posición alta.', 'Con los codos ligeramente flexionados, junta las manos frente al pecho.', 'Mantén la contracción 1 segundo antes de regresar.'],
    '', 35, 3),
  ('10000000-0000-0000-0000-000000000008', NULL, 'Sentadilla Frontal', 'Piernas', ARRAY['Core', 'Hombros']::muscle_group[], 'Avanzado',
    ARRAY['Mantén los codos altos y el pecho erguido durante todo el movimiento.', 'Desciende hasta que los muslos estén paralelos al suelo.', 'La barra debe permanecer sobre la línea de los pies en todo momento.'],
    '', 45, 4),
  ('10000000-0000-0000-0000-000000000009', NULL, 'Curl de Bíceps con Barra', 'Bíceps', ARRAY[]::muscle_group[], 'Principiante',
    ARRAY['Mantén los codos pegados al torso durante todo el movimiento.', 'Sube la barra en 1 segundo, baja en 3 segundos (fase excéntrica).', 'Evita balancear el torso.'],
    '', 35, 3),
  ('10000000-0000-0000-0000-000000000010', NULL, 'Extensión de Tríceps en Polea', 'Tríceps', ARRAY[]::muscle_group[], 'Principiante',
    ARRAY['Mantén los codos fijos cerca del cuerpo.', 'Extiende completamente los brazos sin mover los hombros.', 'Regresa de forma controlada sin dejar caer el peso.'],
    '', 30, 3);

END $$;

-- Note: Client and session seed data requires a valid trainer profile.
-- Once you create your trainer account via Supabase Auth, you can seed
-- clients and sessions by updating the trainer_uuid above with your real user ID.
