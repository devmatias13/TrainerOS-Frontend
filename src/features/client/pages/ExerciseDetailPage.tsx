import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ExternalLink, ArrowLeft, Check, ChevronRight, VideoOff } from 'lucide-react'
import { MOCK_SESSIONS, type SessionExercise } from '../api/client.api'
import { useWeightHistory } from '../hooks/useClientDashboard'
import { useRoutine } from '../../workouts/hooks/useRoutines'
import { useExercise } from '../../exercises/hooks/useExercises'
import ExerciseHistoryChart from '../components/ExerciseHistoryChart'
import { parseVideoUrl } from '../../../utils/video'
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

  // ── Load the DB routine (contains exercises with video_url via join) ──
  const { data: dbRoutine, isLoading: loadingRoutine } = useRoutine(activeSessionId)

  // Transform DB routine exercises
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
          videoUrl: ex?.video_url || undefined,
          historialPesos: [],
          setsCompletados: 0,
        })
      })
    })
    return list
  }, [dbRoutine])

  const isDbRoutine = Boolean(dbRoutine)
  const mockSession = MOCK_SESSIONS.find(s => s.id === activeSessionId) ?? MOCK_SESSIONS[0]

  const exerciseList: SessionExercise[] = useMemo(() => {
    if (routineExercises.length > 0) return routineExercises
    if (!loadingRoutine && !isDbRoutine) return mockSession.ejercicios
    return []
  }, [routineExercises, loadingRoutine, isDbRoutine, mockSession])

  const exercise = useMemo(() =>
    exerciseList.find(e => e.id === ejercicioId || e.ejercicioId === ejercicioId) ??
    exerciseList[0]
  , [exerciseList, ejercicioId])

  // Secondary query: single exercise record (for fresh instructions/video if needed)
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
      intervalRef.current = setInterval(() => setTimerSecs(s => s + 1), 1000)
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
    if (exercise && setsCompleted < exercise.series) setSetsCompleted(s => s + 1)
    setTimerSecs(0)
    setTimerRunning(true)
    setTimeout(() => setTimerRunning(false), (exercise?.descanso ?? 60) * 1000)
  }

  const allDone = exercise ? setsCompleted >= exercise.series : false

  const handleBack = () => navigate(basePath)
  const handleNext = () => {
    if (nextExercise) navigate(`${basePath}/ejercicio/${nextExercise.id}`)
    else navigate(basePath)
  }

  const formatRest = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return m > 0 ? (s > 0 ? `${m} min ${s}s descanso` : `${m} min descanso`) : `${secs}s descanso`
  }

  if (loadingRoutine && isRutinaRoute) {
    return (
      <div className="exercise-detail-page">
        <div className="ed-loading">
          <div className="ed-loading__spinner" />
          <p>Cargando ejercicio...</p>
        </div>
      </div>
    )
  }

  if (!exercise) {
    return (
      <div className="exercise-detail-page" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.7)' }}>Ejercicio no encontrado</p>
        <button className="ed-footer__btn" onClick={handleBack} style={{ marginTop: 16 }}>
          Volver a la rutina
        </button>
      </div>
    )
  }

  // Instructions fallback
  const instrucciones = directExercise?.instrucciones?.length
    ? directExercise.instrucciones
    : exercise.instrucciones

  // Resolve video with robust parser
  const rawVideoUrl = exercise.videoUrl || directExercise?.video_url || ''
  const video = parseVideoUrl(rawVideoUrl)

  // Sets progress dots
  const dots = Array.from({ length: exercise.series }, (_, i) => i < setsCompleted)

  return (
    <div className="exercise-detail-page">

      {/* ── Top Navigation Bar (Mobile & Desktop) ── */}
      <header className="ed-top-nav">
        <button className="ed-back-btn" onClick={handleBack} aria-label="Volver a la sesión">
          <ArrowLeft size={18} strokeWidth={2} />
          <span className="ed-back-btn__label">Volver a la rutina</span>
        </button>
        <span className="ed-top-nav__title">{exercise.nombre}</span>
        <div className="ed-top-nav__space" />
      </header>

      {/* ── Main Grid Layout (2 cols on desktop, 1 col on mobile) ── */}
      <div className="ed-grid-layout">

        {/* ── Column 1: Video Player ── */}
        <div className="ed-video-col">
          <div className={`ed-video-area${video.isShorts ? ' ed-video-area--shorts' : ''}`}>
            {/* Video: YouTube / Vimeo / Direct / External Link / Placeholder */}
            {video.type === 'youtube' && video.embedUrl ? (
              <iframe
                className="ed-video-embed"
                src={video.embedUrl}
                title={`Video de técnica: ${exercise.nombre}`}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              />
            ) : video.type === 'vimeo' && video.embedUrl ? (
              <iframe
                className="ed-video-embed"
                src={video.embedUrl}
                title={`Video de técnica: ${exercise.nombre}`}
                allowFullScreen
                allow="autoplay; fullscreen; picture-in-picture"
              />
            ) : video.type === 'direct' && video.rawUrl ? (
              <video
                className="ed-video-embed"
                src={video.rawUrl}
                controls
                autoPlay
                playsInline
                preload="metadata"
                aria-label={`Video demostrativo de ${exercise.nombre}`}
              />
            ) : video.type === 'unsupported' && video.rawUrl ? (
              <div className="ed-video-external">
                <div className="ed-video-placeholder__icon" aria-hidden="true">
                  <ExternalLink size={24} color="#b5c7ea" />
                </div>
                <p className="ed-video-external__title">Video disponible en enlace externo</p>
                <a
                  href={video.rawUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ed-video-external__btn"
                >
                  Abrir video original ↗
                </a>
              </div>
            ) : (
              <div className="ed-video-placeholder">
                <div className="ed-video-placeholder__icon" aria-hidden="true">
                  <VideoOff size={24} color="rgba(82, 103, 125, 0.7)" />
                </div>
                <span className="ed-video-placeholder__label">Sin video demostrativo</span>
              </div>
            )}

            {/* Timer badge */}
            <div className={`ed-timer-badge${timerRunning ? ' ed-timer-badge--running' : ''}`} aria-live="polite">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {formatTimer(timerSecs)}
            </div>
          </div>
        </div>

        {/* ── Column 2: Exercise Details & Notes ── */}
        <div className="ed-details-col">

          {/* Chips */}
          <div className="ed-chips">
            <span className="ed-chip">{exercise.grupoMuscular.toUpperCase()}</span>
            <span className={`ed-chip ed-chip--categoria ed-chip--${exercise.categoria.toLowerCase()}`}>
              {exercise.categoria.toUpperCase()}
            </span>
            {video.rawUrl && (
              <a
                href={video.rawUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ed-chip ed-chip--link"
                title="Abrir video en pestaña nueva"
              >
                <ExternalLink size={10} strokeWidth={2} />
                VER LINK
              </a>
            )}
          </div>

          {/* Title */}
          <h1 className="ed-exercise-name">{exercise.nombre}</h1>
          <p className="ed-meta">
            {exercise.series} series × {exercise.reps} reps
            <span className="ed-meta__dot">·</span>
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
            <span className="ed-sets-text">{setsCompleted}/{exercise.series} series</span>
          </div>

          {/* Trainer Notes */}
          {instrucciones.length > 0 && (
            <div className="ed-notes-card">
              <div className="ed-notes-card__header">
                <h2 className="ed-notes-card__title">Notas del Entrenador</h2>
              </div>
              <ul className="ed-notes-list">
                {instrucciones.map((inst, i) => (
                  <li key={i} className="ed-notes-item">
                    <svg className="ed-notes-item__icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
          <ExerciseHistoryChart historial={historyData} label="Historial (Último mes)" />

          {/* Completed / Next Action Button */}
          <div className="ed-action-container">
            {!allDone ? (
              <button
                id="btn-serie-completada"
                className="ed-footer__btn ed-footer__btn--complete"
                onClick={handleSerieComplete}
              >
                <Check size={18} strokeWidth={2.5} />
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
                    <ChevronRight size={18} strokeWidth={2.5} />
                    <span>Siguiente: {nextExercise.nombre}</span>
                  </>
                ) : (
                  <>
                    <Check size={18} strokeWidth={2.5} />
                    <span>Volver a la Rutina</span>
                  </>
                )}
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  )
}
