import type { Exercise } from '../../exercises/api/exercises.api'

// ─── Types ─────────────────────────────────────────────────────────
export type BlockType = 'single' | 'superset'

export interface BlockExercise {
  id: string          // unique within block
  exercise: Exercise
  sets: number
  reps: string        // e.g. "8-10" or "12"
  tempo?: string      // e.g. "2-0-1-0"
  notes?: string
}

export interface Block {
  id: string
  label: string       // e.g. "A", "B"
  type: BlockType
  exercises: BlockExercise[]
}

export interface Routine {
  id: string
  nombre: string
  dia?: string        // e.g. "Día 1: Empuje – Hipertrofia"
  blocks: Block[]
}

// ─── Mock Routines ─────────────────────────────────────────────────
export const MOCK_ROUTINES: Routine[] = [
  {
    id: 'r-001',
    nombre: 'Fuerza Hipertrofia A',
    dia: 'Día 1: Empuje – Hipertrofia',
    blocks: [],
  },
  {
    id: 'r-002',
    nombre: 'Full Body Principiante',
    dia: 'Día 1: Full Body',
    blocks: [],
  },
]

// ─── Helpers ───────────────────────────────────────────────────────
export function makeBlockLabel(index: number): string {
  return String.fromCharCode(65 + index) // A, B, C...
}

export function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}
