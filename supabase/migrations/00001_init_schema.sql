-- ═══════════════════════════════════════════════════════════════════════
-- TrainerOS — Initial Schema Migration
-- ═══════════════════════════════════════════════════════════════════════

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── 1. Enums ────────────────────────────────────────────────────────
CREATE TYPE user_role AS ENUM ('trainer', 'client');
CREATE TYPE muscle_group AS ENUM (
  'Pecho', 'Espalda', 'Piernas', 'Hombros', 'Bíceps', 'Tríceps', 'Core', 'Glúteos'
);
CREATE TYPE exercise_difficulty AS ENUM ('Principiante', 'Intermedio', 'Avanzado');
CREATE TYPE block_type AS ENUM ('single', 'superset');
CREATE TYPE session_status AS ENUM ('pending', 'in-progress', 'completed');
CREATE TYPE client_status AS ENUM ('aldia', 'vence', 'pendiente');
CREATE TYPE plan_tier AS ENUM ('basico', 'estandar', 'premium', 'personalizado');

-- ─── 2. Profiles (Extends auth.users) ─────────────────────────────────
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'client',
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  avatar_url TEXT,
  telefono TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 3. Clients (Trainer-Client relationship) ─────────────────────────
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  telefono TEXT,
  fecha_nacimiento DATE,
  plan_tier plan_tier NOT NULL DEFAULT 'basico',
  status client_status NOT NULL DEFAULT 'aldia',
  fecha_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
  estado_pago TEXT NOT NULL DEFAULT 'pagado',

  -- Physical profile
  peso_inicial NUMERIC(5, 2),
  altura NUMERIC(5, 2),
  grasa_corporal NUMERIC(4, 1),
  experiencia exercise_difficulty NOT NULL DEFAULT 'Principiante',
  objetivo TEXT,
  historial_medico TEXT,
  consideraciones TEXT,

  semana_actual INT NOT NULL DEFAULT 1,
  total_semanas INT NOT NULL DEFAULT 12,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_clients_trainer ON public.clients(trainer_id);
CREATE INDEX idx_clients_user ON public.clients(user_id);

-- ─── 4. Exercises (Global bank + Custom per trainer) ──────────────────
CREATE TABLE public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  grupo_muscular muscle_group NOT NULL,
  grupos_secundarios muscle_group[] DEFAULT '{}',
  dificultad exercise_difficulty NOT NULL DEFAULT 'Principiante',
  instrucciones TEXT[] NOT NULL DEFAULT '{}',
  video_url TEXT,
  imagen_url TEXT,
  series_default INT DEFAULT 3,
  duracion_estimada INT DEFAULT 45,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_exercises_trainer ON public.exercises(trainer_id);
CREATE INDEX idx_exercises_muscle ON public.exercises(grupo_muscular);

-- ─── 5. Routines ──────────────────────────────────────────────────────
CREATE TABLE public.routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  dia TEXT,
  descripcion TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_routines_trainer ON public.routines(trainer_id);

-- ─── 6. Routine Blocks ───────────────────────────────────────────────
CREATE TABLE public.routine_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_id UUID NOT NULL REFERENCES public.routines(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  type block_type NOT NULL DEFAULT 'single',
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_routine_blocks_routine ON public.routine_blocks(routine_id);

-- ─── 7. Routine Block Exercises ───────────────────────────────────────
CREATE TABLE public.routine_block_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  block_id UUID NOT NULL REFERENCES public.routine_blocks(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE RESTRICT,
  sets INT NOT NULL DEFAULT 3,
  reps TEXT NOT NULL DEFAULT '10-12',
  tempo TEXT DEFAULT '2-0-1-0',
  rest_seconds INT DEFAULT 90,
  notes TEXT,
  order_index INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_block_exercises_block ON public.routine_block_exercises(block_id);
CREATE INDEX idx_block_exercises_exercise ON public.routine_block_exercises(exercise_id);

-- ─── 8. Workout Sessions (Assigned to clients) ───────────────────────
CREATE TABLE public.workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  routine_id UUID REFERENCES public.routines(id) ON DELETE SET NULL,
  trainer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  status session_status NOT NULL DEFAULT 'pending',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_client ON public.workout_sessions(client_id);
CREATE INDEX idx_sessions_trainer ON public.workout_sessions(trainer_id);
CREATE INDEX idx_sessions_fecha ON public.workout_sessions(fecha);

-- ─── 9. Session Exercises ─────────────────────────────────────────────
CREATE TABLE public.session_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE RESTRICT,
  order_index INT NOT NULL DEFAULT 0,
  categoria TEXT DEFAULT 'Hipertrofia',
  series INT NOT NULL DEFAULT 3,
  reps TEXT NOT NULL DEFAULT '10-12',
  descanso INT NOT NULL DEFAULT 90,
  peso_objetivo NUMERIC(5, 2),
  sets_completados INT NOT NULL DEFAULT 0,
  peso_registrado NUMERIC(5, 2),
  notes TEXT
);

CREATE INDEX idx_session_exercises_session ON public.session_exercises(session_id);

-- ─── 10. Weight Entries (Historical progression logs) ─────────────────
CREATE TABLE public.weight_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.workout_sessions(id) ON DELETE SET NULL,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  kg NUMERIC(5, 2) NOT NULL,
  reps INT,
  rpe NUMERIC(3, 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_weight_entries_client_exercise ON public.weight_entries(client_id, exercise_id);
CREATE INDEX idx_weight_entries_fecha ON public.weight_entries(fecha DESC);

-- ─── Updated_at trigger function ──────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_routines_updated_at
  BEFORE UPDATE ON public.routines
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
