import { useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCheck } from 'lucide-react'
import { MOCK_SESSIONS, MOCK_CLIENT, type SessionExercise } from '../api/client.api'
import { useUpdateSessionProgress, useLogWeight } from '../hooks/useClientDashboard'
import ExerciseSessionCard from '../components/ExerciseSessionCard'
import './WorkoutSessionPage.css'

export default function WorkoutSessionPage() {
  const { clienteId = 'cliente-001', sesionId = 'sesion-001' } = useParams()
  const navigate = useNavigate()

  const updateProgress = useUpdateSessionProgress()
  const logWeight = useLogWeight()

  const sessionData = MOCK_SESSIONS.find(s => s.id === sesionId) ?? MOCK_SESSIONS[0]
  const client = MOCK_CLIENT

  const [exercises, setExercises] = useState<SessionExercise[]>(
    sessionData.ejercicios.map(e => ({ ...e }))
  )

  const completedCount = exercises.filter(e => e.setsCompletados >= e.series).length
  const totalCount = exercises.length
  const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0
  const allDone = completedCount === totalCount

  const handleSetComplete = useCallback((exerciseId: string, kg: number) => {
    setExercises(prev =>
      prev.map(ex => {
        if (ex.id !== exerciseId) return ex
        const newSets = Math.min(ex.setsCompletados + 1, ex.series)
        // Fire mutation in background if valid UUID
        if (exerciseId.includes('-') && exerciseId.length > 20) {
          updateProgress.mutate({
            id: exerciseId,
            sessionId: sesionId,
            sets_completados: newSets,
            peso_registrado: kg,
          })
          logWeight.mutate({
            client_id: clienteId,
            exercise_id: ex.ejercicioId,
            session_id: sesionId,
            kg,
            fecha: new Date().toISOString().split('T')[0],
          })
        }
        return { ...ex, setsCompletados: newSets, pesoRegistrado: kg }
      })
    )
  }, [clienteId, sesionId, updateProgress, logWeight])

  const handleFinalize = () => {
    navigate(`/alumno/${clienteId}`)
  }

  const formatDate = () => {
    return new Date().toLocaleDateString('es-AR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  }

  return (
    <div className="workout-session-page">

      {/* ── Sticky Top Header ── */}
      <header className="ws-header">
        <div className="ws-header__inner">
          <button
            className="ws-header__back"
            onClick={() => navigate(`/alumno/${clienteId}`)}
            aria-label="Volver al dashboard"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          <div className="ws-header__info">
            <h1 className="ws-header__title">{sessionData.nombre}</h1>
            <p className="ws-header__date">{formatDate()}</p>
          </div>

          {/* Avatar */}
          <div className="ws-header__avatar" aria-label={`${client.nombre} ${client.apellido}`}>
            {client.nombre[0]}{client.apellido[0]}
          </div>
        </div>

        {/* Progress bar */}
        <div className="ws-header__progress-bar" role="progressbar" aria-valuenow={completedCount} aria-valuemin={0} aria-valuemax={totalCount}>
          <div
            className="ws-header__progress-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="ws-header__progress-label">
          {completedCount}/{totalCount} ejercicios completados
        </p>
      </header>

      {/* ── Exercise List ── */}
      <main className="ws-content">
        <div className="ws-exercises">
          {exercises.map((ex, i) => (
            <ExerciseSessionCard
              key={ex.id}
              exercise={ex}
              index={i}
              onSetComplete={handleSetComplete}
              clienteId={clienteId}
              sesionId={sesionId}
            />
          ))}
        </div>
      </main>

      {/* ── Sticky Footer: Finalizar ── */}
      <footer className="ws-footer">
        <button
          id="btn-finalizar-sesion"
          className={`ws-footer__btn${allDone ? ' ws-footer__btn--ready' : ''}`}
          onClick={handleFinalize}
          aria-label="Finalizar sesión de entrenamiento"
        >
          <CheckCheck size={20} strokeWidth={2} />
          Finalizar Sesión
        </button>
      </footer>

    </div>
  )
}
