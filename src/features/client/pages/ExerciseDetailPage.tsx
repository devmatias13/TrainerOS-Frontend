import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MOCK_SESSIONS } from '../api/client.api'
import ExerciseHistoryChart from '../components/ExerciseHistoryChart'
import './ExerciseDetailPage.css'

export default function ExerciseDetailPage() {
  const {
    clienteId = 'cliente-001',
    sesionId = 'sesion-001',
    ejercicioId = 'se-001',
  } = useParams()
  const navigate = useNavigate()

  const session = MOCK_SESSIONS.find(s => s.id === sesionId) ?? MOCK_SESSIONS[0]
  const exercise = session.ejercicios.find(e => e.id === ejercicioId) ?? session.ejercicios[0]
  const exerciseIndex = session.ejercicios.findIndex(e => e.id === ejercicioId)
  const nextExercise = session.ejercicios[exerciseIndex + 1]

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
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [timerRunning])

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const handleSerieComplete = () => {
    if (setsCompleted < exercise.series) {
      setSetsCompleted(s => s + 1)
    }
    // Start rest timer
    setTimerSecs(0)
    setTimerRunning(true)
    // Auto-stop after rest time
    setTimeout(() => setTimerRunning(false), exercise.descanso * 1000)
  }

  const allDone = setsCompleted >= exercise.series

  const handleBack = () => {
    navigate(`/alumno/${clienteId}/sesion/${sesionId}`)
  }

  const handleNext = () => {
    if (nextExercise) {
      navigate(`/alumno/${clienteId}/sesion/${sesionId}/ejercicio/${nextExercise.id}`)
    } else {
      navigate(`/alumno/${clienteId}/sesion/${sesionId}`)
    }
  }

  const formatRest = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return m > 0 ? (s > 0 ? `${m} min ${s}s descanso` : `${m} min descanso`) : `${secs}s descanso`
  }

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
        {exercise.instrucciones.length > 0 && (
          <div className="ed-notes-card">
            <div className="ed-notes-card__header">
              <span className="ed-notes-card__dot" aria-hidden="true">·</span>
              <h2 className="ed-notes-card__title">Notas del Entrenador</h2>
            </div>
            <ul className="ed-notes-list">
              {exercise.instrucciones.map((inst, i) => (
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
          historial={exercise.historialPesos}
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
