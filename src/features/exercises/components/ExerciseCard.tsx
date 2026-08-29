import type { Exercise } from '../api/exercises.api'
import './ExerciseCard.css'

interface ExerciseCardProps {
  exercise: Exercise
  onEdit?: (ex: Exercise) => void
}

const DIFFICULTY_COLORS: Record<string, string> = {
  Principiante: 'chip--green',
  Intermedio:   'chip--blue',
  Avanzado:     'chip--navy',
}

const MUSCLE_ICONS: Record<string, string> = {
  Pecho:    '💪',
  Espalda:  '🔙',
  Piernas:  '🦵',
  Hombros:  '🏋️',
  Bíceps:   '💪',
  Tríceps:  '💪',
  Core:     '⚡',
  Glúteos:  '🍑',
}

export default function ExerciseCard({ exercise, onEdit }: ExerciseCardProps) {
  return (
    <div className="exercise-card">
      <div className="exercise-card__thumb">
        <span className="exercise-card__thumb-icon">
          {MUSCLE_ICONS[exercise.grupoMuscular] ?? '🏋️'}
        </span>
      </div>
      <div className="exercise-card__body">
        <div className="exercise-card__header">
          <h3 className="exercise-card__name">{exercise.nombre}</h3>
          <span className={`chip ${DIFFICULTY_COLORS[exercise.dificultad]}`}>
            {exercise.dificultad}
          </span>
        </div>
        <div className="exercise-card__meta">
          <span className="chip chip--muscle">{exercise.grupoMuscular}</span>
          {exercise.gruposSecundarios?.slice(0, 2).map(g => (
            <span key={g} className="chip chip--muscle chip--secondary">{g}</span>
          ))}
        </div>
        <p className="exercise-card__instructions">
          {exercise.instrucciones[0]}
        </p>
      </div>
      {onEdit && (
        <button
          className="exercise-card__edit-btn"
          onClick={() => onEdit(exercise)}
          aria-label={`Editar ${exercise.nombre}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
      )}
    </div>
  )
}
