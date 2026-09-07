import { useState, useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCheck, Dumbbell } from 'lucide-react'
import { MOCK_SESSIONS, MOCK_CLIENT, type SessionExercise } from '../api/client.api'
import { useUpdateSessionProgress, useLogWeight, useClientProfile } from '../hooks/useClientDashboard'
import { useRoutine } from '../../workouts/hooks/useRoutines'
import ExerciseSessionCard from '../components/ExerciseSessionCard'
import './WorkoutSessionPage.css'

export default function WorkoutSessionPage() {
  const { clienteId = '', sesionId = '', rutinaId = '' } = useParams()
  const activeId = rutinaId || sesionId || 'sesion-001'
  const navigate = useNavigate()

  const { data: dbClient } = useClientProfile(clienteId)
  const { data: dbRoutine, isLoading: loadingRoutine } = useRoutine(activeId)

  const updateProgress = useUpdateSessionProgress()
  const logWeight = useLogWeight()

  // Fallback to mock session if not found in db
  const mockSession = MOCK_SESSIONS.find(s => s.id === activeId) ?? MOCK_SESSIONS[0]
  const clientName = dbClient ? `${dbClient.nombre} ${dbClient.apellido}` : `${MOCK_CLIENT.nombre} ${MOCK_CLIENT.apellido}`
  const clientInitials = dbClient
    ? `${dbClient.nombre?.[0] || ''}${dbClient.apellido?.[0] || ''}`
    : `${MOCK_CLIENT.nombre[0]}${MOCK_CLIENT.apellido[0]}`

  const [exercises, setExercises] = useState<SessionExercise[]>([])

  // Load exercises from database routine if available, or fallback to mock
  useEffect(() => {
    if (dbRoutine && dbRoutine.blocks) {
      const routineExercises: SessionExercise[] = []
      dbRoutine.blocks.forEach(block => {
        block.routine_block_exercises.forEach(rbe => {
          const exInfo = rbe.exercises
          routineExercises.push({
            id: rbe.id,
            ejercicioId: rbe.exercise_id,
            nombre: exInfo?.nombre ?? 'Ejercicio',
            grupoMuscular: exInfo?.grupo_muscular ?? 'General',
            categoria: 'Fuerza',
            series: rbe.sets ?? 3,
            reps: rbe.reps ?? '10-12',
            descanso: rbe.rest_seconds ?? 60,
            instrucciones: exInfo?.instrucciones ?? (rbe.notes ? [rbe.notes] : []),
            videoUrl: exInfo?.video_url ?? undefined,
            historialPesos: [],
            setsCompletados: 0,
          })
        })
      })
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExercises(routineExercises)
    } else if (!loadingRoutine && !dbRoutine) {
      setExercises(mockSession.ejercicios.map(e => ({ ...e })))
    }
  }, [dbRoutine, loadingRoutine, mockSession])

  const sessionTitle = dbRoutine?.nombre ?? mockSession.nombre
  const sessionDay = dbRoutine?.dia

  const completedCount = exercises.filter(e => e.setsCompletados >= e.series).length
  const totalCount = exercises.length
  const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0
  const allDone = totalCount > 0 && completedCount === totalCount

  const handleSetComplete = useCallback((exerciseId: string, kg: number) => {
    setExercises(prev =>
      prev.map(ex => {
        if (ex.id !== exerciseId) return ex
        const newSets = Math.min(ex.setsCompletados + 1, ex.series)
        // Fire mutation in background if valid UUID
        if (exerciseId.includes('-') && exerciseId.length > 20) {
          updateProgress.mutate({
            id: exerciseId,
            sessionId: activeId,
            sets_completados: newSets,
            peso_registrado: kg,
          })
          logWeight.mutate({
            client_id: clienteId,
            exercise_id: ex.ejercicioId,
            session_id: activeId,
            kg,
            fecha: new Date().toISOString().split('T')[0],
          })
        }
        return { ...ex, setsCompletados: newSets, pesoRegistrado: kg }
      })
    )
  }, [clienteId, activeId, updateProgress, logWeight])

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

  if (loadingRoutine && activeId && activeId.includes('-') && activeId.length > 20) {
    return (
      <div className="workout-session-page" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px' }}>Cargando rutina...</p>
      </div>
    )
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
            <h1 className="ws-header__title">{sessionTitle}</h1>
            <p className="ws-header__date">{sessionDay ? `${sessionDay} • ` : ''}{formatDate()}</p>
          </div>

          {/* Avatar */}
          <div className="ws-header__avatar" aria-label={clientName}>
            {clientInitials}
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
        {exercises.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 16px', color: 'rgba(255,255,255,0.5)' }}>
            <Dumbbell size={36} opacity={0.3} strokeWidth={1} style={{ margin: '0 auto 12px' }} />
            <p style={{ margin: 0, fontSize: '14px' }}>Esta rutina no contiene ejercicios cargados todavía.</p>
          </div>
        ) : (
          <div className="ws-exercises">
            {exercises.map((ex, i) => (
              <ExerciseSessionCard
                key={ex.id}
                exercise={ex}
                index={i}
                onSetComplete={handleSetComplete}
                clienteId={clienteId}
                sesionId={activeId}
              />
            ))}
          </div>
        )}
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
