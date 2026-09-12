// ─── Exercise Types ────────────────────────────────────────────────
export type MuscleGroup =
  | 'Pecho'
  | 'Espalda'
  | 'Piernas'
  | 'Hombros'
  | 'Bíceps'
  | 'Tríceps'
  | 'Core'
  | 'Glúteos'

export type Difficulty = 'Principiante' | 'Intermedio' | 'Avanzado'

export interface Exercise {
  id: string
  nombre: string
  grupoMuscular: MuscleGroup
  gruposSecundarios?: MuscleGroup[]
  dificultad: Difficulty
  instrucciones: string[]
  videoUrl?: string
  imagenUrl?: string
  duracionEstimada?: number // segundos
  series?: number
}

// ─── Mock Data ─────────────────────────────────────────────────────
export const MOCK_EXERCISES: Exercise[] = [
  {
    id: 'ex-001',
    nombre: 'Press de Banca Plano',
    grupoMuscular: 'Pecho',
    gruposSecundarios: ['Tríceps', 'Hombros'],
    dificultad: 'Intermedio',
    instrucciones: [
      'Mantén los codos a 45° del torso para proteger los hombros.',
      'Baja la barra de forma controlada hasta rozar el pecho.',
      'Empuja explosivamente hacia arriba manteniendo los omóplatos retraídos.',
    ],
    videoUrl: '',
    duracionEstimada: 45,
    series: 4,
  },
  {
    id: 'ex-002',
    nombre: 'Jalón al Pecho Prono',
    grupoMuscular: 'Espalda',
    gruposSecundarios: ['Bíceps'],
    dificultad: 'Principiante',
    instrucciones: [
      'Siéntate con los muslos bien sujetos bajo el soporte.',
      'Agarra la barra con agarre prono, separación mayor al ancho de hombros.',
      'Jala la barra hacia la clavícula, contrayendo los dorsales.',
    ],
    videoUrl: '',
    duracionEstimada: 40,
    series: 3,
  },
  {
    id: 'ex-003',
    nombre: 'Sentadilla Libre',
    grupoMuscular: 'Piernas',
    gruposSecundarios: ['Glúteos', 'Core'],
    dificultad: 'Intermedio',
    instrucciones: [
      'Posiciona la barra sobre los trapecios, no sobre el cuello.',
      'Desciende hasta que los muslos estén paralelos al suelo.',
      'Empuja el suelo con los talones al subir.',
    ],
    videoUrl: '',
    duracionEstimada: 50,
    series: 4,
  },
  {
    id: 'ex-004',
    nombre: 'Press Militar con Barra',
    grupoMuscular: 'Hombros',
    gruposSecundarios: ['Tríceps'],
    dificultad: 'Intermedio',
    instrucciones: [
      'De pie, agarra la barra a la altura de los hombros.',
      'Empuja la barra verticalmente por encima de la cabeza.',
      'Bloquea los codos al final del recorrido.',
    ],
    videoUrl: '',
    duracionEstimada: 40,
    series: 4,
  },
  {
    id: 'ex-005',
    nombre: 'Elevaciones Laterales',
    grupoMuscular: 'Hombros',
    gruposSecundarios: [],
    dificultad: 'Principiante',
    instrucciones: [
      'Sostén mancuernas a los costados con los codos ligeramente flexionados.',
      'Eleva los brazos hasta la altura de los hombros.',
      'Baja de forma controlada en 2-3 segundos.',
    ],
    videoUrl: '',
    duracionEstimada: 30,
    series: 3,
  },
  {
    id: 'ex-006',
    nombre: 'Press Inclinado c/ Mancuernas',
    grupoMuscular: 'Pecho',
    gruposSecundarios: ['Tríceps', 'Hombros'],
    dificultad: 'Intermedio',
    instrucciones: [
      'Ajusta el banco a 30-45 grados de inclinación.',
      'Baja las mancuernas con control hasta la altura del pecho.',
      'Empuja hacia arriba y hacia adentro, contrayendo el pectoral superior.',
    ],
    videoUrl: '',
    duracionEstimada: 45,
    series: 3,
  },
  {
    id: 'ex-007',
    nombre: 'Aperturas en Polea',
    grupoMuscular: 'Pecho',
    gruposSecundarios: [],
    dificultad: 'Principiante',
    instrucciones: [
      'Configura las poleas en posición alta.',
      'Con los codos ligeramente flexionados, junta las manos frente al pecho.',
      'Mantén la contracción 1 segundo antes de regresar.',
    ],
    videoUrl: '',
    duracionEstimada: 35,
    series: 3,
  },
  {
    id: 'ex-008',
    nombre: 'Sentadilla Frontal',
    grupoMuscular: 'Piernas',
    gruposSecundarios: ['Core', 'Hombros'],
    dificultad: 'Avanzado',
    instrucciones: [
      'Mantén los codos altos y el pecho erguido durante todo el movimiento.',
      'Desciende hasta que los muslos estén paralelos al suelo.',
      'La barra debe permanecer sobre la línea de los pies en todo momento.',
    ],
    videoUrl: '',
    duracionEstimada: 45,
    series: 4,
  },
  {
    id: 'ex-009',
    nombre: 'Curl de Bíceps con Barra',
    grupoMuscular: 'Bíceps',
    gruposSecundarios: [],
    dificultad: 'Principiante',
    instrucciones: [
      'Mantén los codos pegados al torso durante todo el movimiento.',
      'Sube la barra en 1 segundo, baja en 3 segundos (fase excéntrica).',
      'Evita balancear el torso.',
    ],
    videoUrl: '',
    duracionEstimada: 35,
    series: 3,
  },
  {
    id: 'ex-010',
    nombre: 'Extensión de Tríceps en Polea',
    grupoMuscular: 'Tríceps',
    gruposSecundarios: [],
    dificultad: 'Principiante',
    instrucciones: [
      'Mantén los codos fijos cerca del cuerpo.',
      'Extiende completamente los brazos sin mover los hombros.',
      'Regresa de forma controlada sin dejar caer el peso.',
    ],
    videoUrl: '',
    duracionEstimada: 30,
    series: 3,
  },
]

export const MUSCLE_GROUPS: MuscleGroup[] = [
  'Pecho',
  'Espalda',
  'Piernas',
  'Hombros',
  'Bíceps',
  'Tríceps',
  'Core',
  'Glúteos',
]
