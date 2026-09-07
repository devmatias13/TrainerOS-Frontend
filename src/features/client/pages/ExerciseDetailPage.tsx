import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MOCK_SESSIONS, type SessionExercise } from '../api/client.api'
import { useWeightHistory } from '../hooks/useClientDashboard'
import { useRoutine } from '../../workouts/hooks/useRoutines'
import { useExercise } from '../../exercises/hooks/useExercises'
import ExerciseHistoryChart from '../components/ExerciseHistoryChart'
import './ExerciseDetailPage.css'

export default function ExerciseDetailPage() {
  const {
    clienteId = 'cliente-001',
    sesionId = '',
    rutinaId = '',
    ejercicioId = 'se-001',
  } = useParams()
  const activeSessionId = rutinaId || sesionId || 'sesion-001'
  const isRutinaRoute = Boolean(rutinaId)
  const basePath = isRutinaRoute
    ? `/alumno/${clienteId}/rutina/${rutinaId}`
    : `/alumno/${clienteId}/sesion/${sesionId || 'sesion-001'}`

  const navigate = useNavigate()

  // 1. Check if we are viewing a DB Routine
  const { data: dbRoutine } = useRoutine(activeSessionId)
  
  // Transform DB routine exercises if present
  const routineExercises: SessionExercise[] = useMemo(() => {
    if (!dbRoutine?.blocks) return []
    const list: SessionExercise[] = []
    dbRoutine.blocks.forEach(block => {
      block.routine_block_exercises.forEach(rbe => {
        const ex = rbe.exercises
        list.push({
          id: rbe.id,
          ejercicioId: rbe.exercise_id,
          nombre: ex?.nombre ?? 'Ejercicio',
          grupoMuscular: ex?.grupo_muscular ?? 'General',
          categoria: 'Fuerza',
          series: rbe.sets ?? 3,
          reps: rbe.reps ?? '10-12',
          descanso: rbe.rest_seconds ?? 60,
          instrucciones: ex?.instrucciones ?? (rbe.notes ? [rbe.notes] : []),
          videoUrl: ex?.video_url ?? undefined,
          historialPesos: [],
          setsCompletados: 0,
        })
      })
    })
    return list
  }, [dbRoutine])

  // Fallback to mock session
  const mockSession = MOCK_SESSIONS.find(s => s.id === activeSessionId) ?? MOCK_SESSIONS[0]
  const exerciseList = routineExercises.length > 0 ? routineExercises : mockSession.ejercicios

  const exercise =
    exerciseList.find(e => e.id === ejercicioId || e.ejercicioId === ejercicioId) ??
    exerciseList[0]

  // Exercise direct query if needed
  const { data: directExercise } = useExercise(exercise?.ejercicioId ?? '')

  const exerciseIndex = exerciseList.findIndex(
    e => e.id === ejercicioId || e.ejercicioId === ejercicioId
  )
  const nextExercise = exerciseList[exerciseIndex + 1]

  const rawExerciseId = exercise?.ejercicioId || exercise?.id || ''
  const { data: dbWeightHistory } = useWeightHistory(clienteId, rawExerciseId)
  const historyData =
    dbWeightHistory && dbWeightHistory.length > 0
      ? dbWeightHistory.map(w => ({ fecha: w.fecha, kg: Number(w.kg) }))
      : exercise?.historialPesos ?? []

  // ── Rest Timer ──
  const [timerSecs, setTimerSecs] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [setsCompleted, setSetsCompleted] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setTimerSecs(s => s + 1)
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [timerRunning])

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const handleSerieComplete = () => {
    if (exercise && setsCompleted < exercise.series) {
      setSetsCompleted(s => s + 1)
    }
    // Start rest timer
    setTimerSecs(0)
    setTimerRunning(true)
    // Auto-stop after rest time
    setTimeout(() => setTimerRunning(false), (exercise?.descanso ?? 60) * 1000)
  }

  const allDone = exercise ? setsCompleted >= exercise.series : false

  const handleBack = () => {
    navigate(basePath)
  }

  const handleNext = () => {
    if (nextExercise) {
      navigate(`${basePath}/ejercicio/${nextExercise.id}`)
    } else {
      navigate(basePath)
    }
  }

  const formatRest = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return m > 0
      ? s > 0
        ? `${m} min ${s}s descanso`
        : `${m} min descanso`
      : `${secs}s descanso`
  }

  if (!exercise) {
    return (
      <div className="exercise-detail-page" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.7)' }}>Ejercicio no encontrado</p>
        <button className="ed-footer__btn" onClick={handleBack} style={{ marginTop: 16 }}>
          Volver
        </button>
      </div>
    )
  }

  const instrucciones = directExercise?.instrucciones?.length
    ? directExercise.instrucciones
    : exercise.instrucciones

  // Sets progress dots
  const dots = Array.from({ length: exercise.series }, (_, i) => i < setsCompleted)

  return (
    <div className="exercise-detail-page">

      {/* ── Video Area ── */}
      <div className="ed-video-area">
        {/* Back button */}
        <button className="ed-back-btn" onClick={handleBack} aria-label="Volver a la sesión">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        {/* Video placeholder with play */}
        <div className="ed-video-placeholder">
          <div className="ed-video-play-btn" role="button" aria-label="Reproducir video">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="rgba(255,255,255,0.9)">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
        </div>

        {/* Timer badge */}
        <div className={`ed-timer-badge${timerRunning ? ' ed-timer-badge--running' : ''}`} aria-live="polite">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          {formatTimer(timerSecs)}
        </div>
      </div>

      {/* ── Scrollable Content ── */}
      <div className="ed-content">

        {/* Categories */}
        <div className="ed-chips">
          <span className="ed-chip">{exercise.grupoMuscular.toUpperCase()}</span>
          <span className={`ed-chip ed-chip--categoria ed-chip--${exercise.categoria.toLowerCase()}`}>
            {exercise.categoria.toUpperCase()}
          </span>
        </div>

        {/* Title */}
        <h1 className="ed-exercise-name">{exercise.nombre}</h1>
        <p className="ed-meta">
          {exercise.series} Series × {exercise.reps} Reps
          <span className="ed-meta__dot">•</span>
          {formatRest(exercise.descanso)}
        </p>

        {/* Progress dots */}
        <div className="ed-sets-progress" aria-label="Progreso de series">
          {dots.map((done, i) => (
            <span
              key={i}
              className={`ed-set-dot${done ? ' ed-set-dot--done' : ''}`}
              aria-label={done ? `Serie ${i + 1} completada` : `Serie ${i + 1}`}
            />
          ))}
          <span className="ed-sets-text">
            {setsCompleted}/{exercise.series} series
          </span>
        </div>

        {/* Trainer Notes */}
        {instrucciones.length > 0 && (
          <div className="ed-notes-card">
            <div className="ed-notes-card__header">
              <span className="ed-notes-card__dot" aria-hidden="true">·</span>
              <h2 className="ed-notes-card__title">Notas del Entrenador</h2>
            </div>
            <ul className="ed-notes-list">
              {instrucciones.map((inst, i) => (
                <li key={i} className="ed-notes-item">
                  <svg className="ed-notes-item__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <span>{inst}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* History Chart */}
        <ExerciseHistoryChart
          historial={historyData}
          label="Historial (Último mes)"
        />

        {/* Bottom spacer for sticky button */}
        <div style={{ height: 100 }} />
      </div>

      {/* ── Sticky Bottom Button ── */}
      <div className="ed-footer">
        {!allDone ? (
          <button
            id="btn-serie-completada"
            className="ed-footer__btn ed-footer__btn--complete"
            onClick={handleSerieComplete}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>Serie Completada</span>
            <span className="ed-footer__sets-badge">{setsCompleted + 1}/{exercise.series}</span>
          </button>
        ) : (
          <button
            id="btn-siguiente-ejercicio"
            className="ed-footer__btn ed-footer__btn--next"
            onClick={handleNext}
          >
            {nextExercise ? (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Siguiente: {nextExercise.nombre}
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Volver a la Sesión
              </>
            )}
          </button>
        )}
      </div>

    </div>
  )
}
