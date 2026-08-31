import { useNavigate, useParams } from 'react-router-dom'
import { MOCK_CLIENT, MOCK_SESSIONS } from '../api/client.api'
import { useClientProfile, useClientSessions } from '../hooks/useClientDashboard'
import './ClientDashboard.css'

export default function ClientDashboard() {
  const { clienteId = 'cliente-001' } = useParams()
  const navigate = useNavigate()

  const { data: dbClient } = useClientProfile(clienteId)
  const { data: dbSessions } = useClientSessions(clienteId)

  const client = dbClient ? {
    id: dbClient.id,
    nombre: dbClient.nombre,
    apellido: dbClient.apellido,
    entrenadorNombre: 'Pablo Díaz',
    semanaActual: dbClient.semana_actual,
    totalSemanas: dbClient.total_semanas,
    sesionesCompletadasSemana: 1,
    totalSesionesSemana: 4,
  } : MOCK_CLIENT

  const sessions = (dbSessions && dbSessions.length > 0) ? dbSessions.map(s => ({
    id: s.id,
    clienteId: s.client_id,
    nombre: s.nombre,
    fecha: s.fecha,
    status: s.status,
    ejercicios: s.session_exercises.map(se => ({
      id: se.id,
      ejercicioId: se.exercise_id,
      nombre: se.exercises?.nombre ?? 'Ejercicio',
      grupoMuscular: se.exercises?.grupo_muscular ?? 'General',
      categoria: (se.categoria ?? 'Hipertrofia') as any,
      series: se.series,
      reps: se.reps,
      descanso: se.descanso,
      pesoObjetivo: se.peso_objetivo ? Number(se.peso_objetivo) : undefined,
      instrucciones: se.exercises?.instrucciones ?? [],
      videoUrl: se.exercises?.video_url ?? undefined,
      historialPesos: [],
      setsCompletados: se.sets_completados,
      pesoRegistrado: se.peso_registrado ? Number(se.peso_registrado) : undefined,
    })),
  })) : MOCK_SESSIONS

  // First pending session = today's workout
  const todaySession = sessions.find(s => s.status === 'pending') ?? sessions[0]

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Buenos días'
    if (h < 19) return 'Buenas tardes'
    return 'Buenas noches'
  }

  const weekProgress = client.sesionesCompletadasSemana / client.totalSesionesSemana
  const programProgress = (client.semanaActual - 1) / client.totalSemanas

  // SVG ring helpers
  const RING_R = 44
  const RING_CIRC = 2 * Math.PI * RING_R

  return (
    <div className="client-dashboard">

      {/* ── Top Header ── */}
      <header className="cd-header">
        <div className="cd-header__greeting">
          <p className="cd-header__saludo">{greeting()},</p>
          <h1 className="cd-header__name">{client.nombre}</h1>
        </div>
        <div className="cd-header__avatar" aria-label={`${client.nombre} ${client.apellido}`}>
          {client.nombre[0]}{client.apellido[0]}
        </div>
      </header>

      {/* ── Trainer credit ── */}
      <p className="cd-trainer-credit">
        Entrenador: <strong>{client.entrenadorNombre}</strong>
      </p>

      {/* ── Bento Grid ── */}
      <div className="cd-bento">

        {/* Weekly Ring — big card */}
        <div className="cd-bento-card cd-bento-card--ring">
          <h2 className="cd-bento-card__title">Semana {client.semanaActual}</h2>
          <div className="cd-ring-wrap">
            <svg className="cd-ring-svg" viewBox="0 0 100 100" aria-label={`${client.sesionesCompletadasSemana} de ${client.totalSesionesSemana} sesiones completadas`}>
              {/* Background ring */}
              <circle
                cx="50" cy="50" r={RING_R}
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="10"
              />
              {/* Progress ring */}
              <circle
                cx="50" cy="50" r={RING_R}
                fill="none"
                stroke="rgba(82,103,125,0.9)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={RING_CIRC}
                strokeDashoffset={RING_CIRC * (1 - weekProgress)}
                transform="rotate(-90 50 50)"
                style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)' }}
              />
              {/* Inner text */}
              <text x="50" y="46" textAnchor="middle" fontSize="18" fontWeight="700" fontFamily="var(--font-display)" fill="#ffffff">
                {client.sesionesCompletadasSemana}/{client.totalSesionesSemana}
              </text>
              <text x="50" y="60" textAnchor="middle" fontSize="8" fontFamily="var(--font-body)" fill="rgba(255,255,255,0.5)">
                SESIONES
              </text>
            </svg>
          </div>
          <p className="cd-ring-label">
            {client.totalSesionesSemana - client.sesionesCompletadasSemana === 0
              ? '¡Semana completa! 💪'
              : `${client.totalSesionesSemana - client.sesionesCompletadasSemana} sesión${client.totalSesionesSemana - client.sesionesCompletadasSemana > 1 ? 'es' : ''} restante${client.totalSesionesSemana - client.sesionesCompletadasSemana > 1 ? 's' : ''}`
            }
          </p>
        </div>

        {/* Program Progress card */}
        <div className="cd-bento-card cd-bento-card--program">
          <p className="cd-bento-card__label">PROGRAMA</p>
          <p className="cd-program__weeks">
            Semana <strong>{client.semanaActual}</strong>/{client.totalSemanas}
          </p>
          <div className="cd-program__bar-wrap" aria-label={`Semana ${client.semanaActual} de ${client.totalSemanas}`}>
            <div className="cd-program__bar">
              <div
                className="cd-program__bar-fill"
                style={{ width: `${programProgress * 100}%` }}
              />
            </div>
          </div>
          <p className="cd-program__pct">
            {Math.round(programProgress * 100)}% completado
          </p>
        </div>

        {/* Today's session CTA */}
        {todaySession && (
          <div className="cd-bento-card cd-bento-card--today">
            <p className="cd-bento-card__label">HOY</p>
            <h3 className="cd-today__name">{todaySession.nombre}</h3>
            <p className="cd-today__meta">
              {todaySession.ejercicios.length} ejercicios
              · ~{todaySession.ejercicios.reduce((s, e) => s + (e.series * 4), 0)} min est.
            </p>
            <button
              id="btn-comenzar-entrenamiento"
              className="cd-today__cta"
              onClick={() => navigate(`/alumno/${clienteId}/sesion/${todaySession.id}`)}
            >
              Comenzar Entrenamiento
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        )}

        {/* Upcoming sessions */}
        <div className="cd-bento-card cd-bento-card--upcoming">
          <p className="cd-bento-card__label">PRÓXIMAS SESIONES</p>
          <div className="cd-upcoming-list">
            {sessions.slice(0, 3).map((s, i) => (
              <div key={s.id} className="cd-upcoming-item">
                <div className={`cd-upcoming-item__dot${i === 0 ? ' cd-upcoming-item__dot--today' : ''}`} />
                <div className="cd-upcoming-item__info">
                  <span className="cd-upcoming-item__name">{s.nombre}</span>
                  <span className="cd-upcoming-item__count">
                    {s.ejercicios.length} ejercicios
                  </span>
                </div>
                <button
                  className="cd-upcoming-item__btn"
                  onClick={() => navigate(`/alumno/${clienteId}/sesion/${s.id}`)}
                  aria-label={`Ir a ${s.nombre}`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom safe area */}
      <div style={{ height: 32 }} />
    </div>
  )
}
