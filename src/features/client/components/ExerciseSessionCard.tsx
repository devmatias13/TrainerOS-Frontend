import { useNavigate } from 'react-router-dom'
import type { SessionExercise } from '../api/client.api'
import WeightLogger from './WeightLogger'
import './ExerciseSessionCard.css'

interface ExerciseSessionCardProps {
  exercise: SessionExercise
  index: number
  onSetComplete: (exerciseId: string, kg: number) => void
  clienteId: string
  sesionId: string
}

export default function ExerciseSessionCard({
  exercise,
  index,
  onSetComplete,
  clienteId,
  sesionId,
}: ExerciseSessionCardProps) {
  const navigate = useNavigate()
  const isCompleted = exercise.setsCompletados >= exercise.series

  const handleOpenDetail = () => {
    navigate(
      `/alumno/${clienteId}/sesion/${sesionId}/ejercicio/${exercise.id}`
    )
  }

  return (
    <div
      className={`ex-session-card${isCompleted ? ' ex-session-card--done' : ''}`}
      id={`exercise-card-${exercise.id}`}
    >
      {/* Header: number + name + category chip */}
      <div className="ex-session-card__header">
        <div className="ex-session-card__numbering">
          <span className="ex-session-card__number">{index + 1}.</span>
          <h2 className="ex-session-card__name">{exercise.nombre}</h2>
        </div>
        <span className={`ex-session-card__chip ex-session-card__chip--${exercise.categoria.toLowerCase()}`}>
          {exercise.categoria}
        </span>
      </div>

      {/* Video / Thumbnail area — click to open detail */}
      <div
        className="ex-session-card__media"
        onClick={handleOpenDetail}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && handleOpenDetail()}
        aria-label={`Ver técnica y notas de ${exercise.nombre}`}
      >
        <div className="ex-session-card__media-inner">
          <div className="ex-session-card__play-circle" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
          <span className="ex-session-card__media-hint">Ver técnica y notas</span>
        </div>
      </div>

      {/* Metrics: SERIES | REPS — 2-column grid matching mockup */}
      <div className="ex-session-card__metrics">
        <div className="ex-session-card__metric">
          <span className="ex-session-card__metric-label">SERIES</span>
          <span className="ex-session-card__metric-value">{exercise.series}</span>
        </div>
        <div className="ex-session-card__metric">
          <span className="ex-session-card__metric-label">REPS</span>
          <span className="ex-session-card__metric-value">{exercise.reps}</span>
        </div>
      </div>

      {/* Weight logger */}
      <div className="ex-session-card__logger">
        <div className="ex-session-card__logger-meta">
          <p className="ex-session-card__logger-label">Registro de Carga (kg)</p>
          {exercise.pesoObjetivo && (
            <span className="ex-session-card__logger-objective">Objetivo: {exercise.pesoObjetivo}kg</span>
          )}
        </div>
        <WeightLogger
          targetKg={exercise.pesoObjetivo}
          setsTotal={exercise.series}
          setsCompleted={exercise.setsCompletados}
          onSetComplete={kg => onSetComplete(exercise.id, kg)}
        />
      </div>
    </div>
  )
}
