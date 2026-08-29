// ─── Client Feature Types ──────────────────────────────────────────

export interface WeightEntry {
  fecha: string   // ISO date "2026-08-15"
  kg: number
}

export type SessionStatus = 'pending' | 'in-progress' | 'completed'

export interface SessionExercise {
  id: string
  ejercicioId: string
  nombre: string
  grupoMuscular: string
  categoria: 'Fuerza' | 'Hipertrofia' | 'Resistencia' | 'Movilidad'
  series: number
  reps: string          // "8-10" | "12" | "Al fallo"
  descanso: number      // segundos
  pesoObjetivo?: number // kg
  instrucciones: string[]
  videoUrl?: string
  historialPesos: WeightEntry[]
  setsCompletados: number   // estado local mutable
  pesoRegistrado?: number   // kg ingresado hoy
}

export interface WorkoutSession {
  id: string
  clienteId: string
  nombre: string        // "Día 1: Empuje – Hipertrofia"
  fecha: string
  status: SessionStatus
  ejercicios: SessionExercise[]
}

export interface ClientProfile {
  id: string
  nombre: string
  apellido: string
  avatarUrl?: string
  entrenadorNombre: string
  semanaActual: number
  totalSemanas: number
  sesionesCompletadasSemana: number
  totalSesionesSemana: number
}

// ─── Mock Data ─────────────────────────────────────────────────────

export const MOCK_CLIENT: ClientProfile = {
  id: 'cliente-001',
  nombre: 'Franco',
  apellido: 'Suárez',
  entrenadorNombre: 'Pablo Díaz',
  semanaActual: 3,
  totalSemanas: 12,
  sesionesCompletadasSemana: 1,
  totalSesionesSemana: 4,
}

export const MOCK_SESSIONS: WorkoutSession[] = [
  {
    id: 'sesion-001',
    clienteId: 'cliente-001',
    nombre: 'Día 1: Empuje',
    fecha: '2026-08-29',
    status: 'pending',
    ejercicios: [
      {
        id: 'se-001',
        ejercicioId: 'ex-001',
        nombre: 'Press de Banca Plano',
        grupoMuscular: 'Pecho',
        categoria: 'Fuerza',
        series: 4,
        reps: '8-10',
        descanso: 120,
        pesoObjetivo: 85,
        instrucciones: [
          'Mantén los pies firmemente plantados en el suelo para mayor estabilidad.',
          'Retrae las escápulas antes de sacar la barra. Pecho arriba.',
          'Baja la barra de forma controlada hasta tocar el esternón (2 segundos bajada, 1 segundo subida).',
        ],
        videoUrl: '',
        historialPesos: [
          { fecha: '2026-07-25', kg: 60 },
          { fecha: '2026-08-01', kg: 62.5 },
          { fecha: '2026-08-08', kg: 65 },
          { fecha: '2026-08-15', kg: 65 },
          { fecha: '2026-08-22', kg: 70 },
        ],
        setsCompletados: 0,
      },
      {
        id: 'se-002',
        ejercicioId: 'ex-006',
        nombre: 'Press Militar c/ Mancuernas',
        grupoMuscular: 'Hombros',
        categoria: 'Hipertrofia',
        series: 3,
        reps: '10-12',
        descanso: 90,
        pesoObjetivo: 22,
        instrucciones: [
          'Siéntate con la espalda completamente apoyada en el banco.',
          'Sube las mancuernas en un arco controlado hasta extender los brazos.',
          'Baja hasta que los codos estén a 90° o ligeramente más abajo.',
        ],
        videoUrl: '',
        historialPesos: [
          { fecha: '2026-07-25', kg: 16 },
          { fecha: '2026-08-01', kg: 18 },
          { fecha: '2026-08-08', kg: 18 },
          { fecha: '2026-08-15', kg: 20 },
          { fecha: '2026-08-22', kg: 20 },
        ],
        setsCompletados: 0,
      },
      {
        id: 'se-003',
        ejercicioId: 'ex-007',
        nombre: 'Aperturas en Polea',
        grupoMuscular: 'Pecho',
        categoria: 'Hipertrofia',
        series: 3,
        reps: '12-15',
        descanso: 60,
        pesoObjetivo: 15,
        instrucciones: [
          'Configura las poleas en posición alta.',
          'Con los codos ligeramente flexionados, junta las manos frente al pecho.',
          'Mantén la contracción 1 segundo antes de regresar.',
        ],
        videoUrl: '',
        historialPesos: [
          { fecha: '2026-07-25', kg: 10 },
          { fecha: '2026-08-01', kg: 10 },
          { fecha: '2026-08-08', kg: 12.5 },
          { fecha: '2026-08-15', kg: 12.5 },
          { fecha: '2026-08-22', kg: 15 },
        ],
        setsCompletados: 0,
      },
      {
        id: 'se-004',
        ejercicioId: 'ex-010',
        nombre: 'Extensión de Tríceps en Polea',
        grupoMuscular: 'Tríceps',
        categoria: 'Hipertrofia',
        series: 3,
        reps: '12',
        descanso: 60,
        pesoObjetivo: 20,
        instrucciones: [
          'Mantén los codos fijos cerca del cuerpo.',
          'Extiende completamente los brazos sin mover los hombros.',
          'Regresa de forma controlada sin dejar caer el peso.',
        ],
        videoUrl: '',
        historialPesos: [
          { fecha: '2026-07-25', kg: 12 },
          { fecha: '2026-08-01', kg: 15 },
          { fecha: '2026-08-08', kg: 17.5 },
          { fecha: '2026-08-15', kg: 17.5 },
          { fecha: '2026-08-22', kg: 20 },
        ],
        setsCompletados: 0,
      },
      {
        id: 'se-005',
        ejercicioId: 'ex-005',
        nombre: 'Elevaciones Laterales',
        grupoMuscular: 'Hombros',
        categoria: 'Hipertrofia',
        series: 4,
        reps: '15',
        descanso: 45,
        pesoObjetivo: 10,
        instrucciones: [
          'Sostén mancuernas a los costados con los codos ligeramente flexionados.',
          'Eleva los brazos hasta la altura de los hombros.',
          'Baja de forma controlada en 2-3 segundos.',
        ],
        videoUrl: '',
        historialPesos: [
          { fecha: '2026-07-25', kg: 6 },
          { fecha: '2026-08-01', kg: 7 },
          { fecha: '2026-08-08', kg: 8 },
          { fecha: '2026-08-15', kg: 8 },
          { fecha: '2026-08-22', kg: 10 },
        ],
        setsCompletados: 0,
      },
    ],
  },
  {
    id: 'sesion-002',
    clienteId: 'cliente-001',
    nombre: 'Día 2: Jalón y Bíceps',
    fecha: '2026-08-31',
    status: 'pending',
    ejercicios: [
      {
        id: 'se-006',
        ejercicioId: 'ex-002',
        nombre: 'Jalón al Pecho Prono',
        grupoMuscular: 'Espalda',
        categoria: 'Fuerza',
        series: 4,
        reps: '8-10',
        descanso: 120,
        pesoObjetivo: 70,
        instrucciones: [
          'Siéntate con los muslos bien sujetos bajo el soporte.',
          'Agarra la barra con agarre prono, separación mayor al ancho de hombros.',
          'Jala la barra hacia la clavícula, contrayendo los dorsales.',
        ],
        videoUrl: '',
        historialPesos: [
          { fecha: '2026-07-26', kg: 55 },
          { fecha: '2026-08-02', kg: 57.5 },
          { fecha: '2026-08-09', kg: 60 },
          { fecha: '2026-08-16', kg: 62.5 },
          { fecha: '2026-08-23', kg: 65 },
        ],
        setsCompletados: 0,
      },
      {
        id: 'se-007',
        ejercicioId: 'ex-009',
        nombre: 'Curl de Bíceps con Barra',
        grupoMuscular: 'Bíceps',
        categoria: 'Hipertrofia',
        series: 3,
        reps: '10-12',
        descanso: 75,
        pesoObjetivo: 30,
        instrucciones: [
          'Mantén los codos pegados al torso durante todo el movimiento.',
          'Sube la barra en 1 segundo, baja en 3 segundos (fase excéntrica).',
          'Evita balancear el torso.',
        ],
        videoUrl: '',
        historialPesos: [
          { fecha: '2026-07-26', kg: 20 },
          { fecha: '2026-08-02', kg: 22.5 },
          { fecha: '2026-08-09', kg: 25 },
          { fecha: '2026-08-16', kg: 25 },
          { fecha: '2026-08-23', kg: 27.5 },
        ],
        setsCompletados: 0,
      },
    ],
  },
  {
    id: 'sesion-003',
    clienteId: 'cliente-001',
    nombre: 'Día 3: Piernas',
    fecha: '2026-09-02',
    status: 'pending',
    ejercicios: [
      {
        id: 'se-008',
        ejercicioId: 'ex-003',
        nombre: 'Sentadilla Libre',
        grupoMuscular: 'Piernas',
        categoria: 'Fuerza',
        series: 5,
        reps: '5',
        descanso: 180,
        pesoObjetivo: 100,
        instrucciones: [
          'Posiciona la barra sobre los trapecios, no sobre el cuello.',
          'Desciende hasta que los muslos estén paralelos al suelo.',
          'Empuja el suelo con los talones al subir.',
        ],
        videoUrl: '',
        historialPesos: [
          { fecha: '2026-07-27', kg: 75 },
          { fecha: '2026-08-03', kg: 80 },
          { fecha: '2026-08-10', kg: 82.5 },
          { fecha: '2026-08-17', kg: 85 },
          { fecha: '2026-08-24', kg: 90 },
        ],
        setsCompletados: 0,
      },
    ],
  },
]
