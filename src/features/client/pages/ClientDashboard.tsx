import { useNavigate, useParams } from 'react-router-dom'
import { Dumbbell, ChevronRight, Calendar } from 'lucide-react'
import { useClientProfile, useClientAssignedRoutines } from '../hooks/useClientDashboard'
import './ClientDashboard.css'

export default function ClientDashboard() {
  const { clienteId = '' } = useParams()
  const navigate = useNavigate()

  const { data: dbClient, isLoading: loadingClient } = useClientProfile(clienteId)
  const { data: assignedRoutines = [], isLoading: loadingRoutines } = useClientAssignedRoutines(clienteId)

  const isLoading = loadingClient || loadingRoutines

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Buenos días'
    if (h < 19) return 'Buenas tardes'
    return 'Buenas noches'
  }

  const weekProgress = dbClient
    ? (dbClient.semana_actual - 1) / dbClient.total_semanas
    : 0

  const RING_R = 44
  const RING_CIRC = 2 * Math.PI * RING_R

  if (isLoading) {
    return (
      <div className="client-dashboard">
        <div className="cd-loading">
          <div className="cd-loading__spinner" />
          <p>Cargando tu programa...</p>
        </div>
      </div>
    )
  }

  if (!dbClient) {
    return (
      <div className="client-dashboard">
        <div className="cd-not-found">
          <Dumbbell size={48} opacity={0.3} strokeWidth={1} />
          <h2>Cliente no encontrado</h2>
          <p>El link que usaste no corresponde a ningún alumno registrado.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="client-dashboard">

      {/* ── Top Header ── */}
      <header className="cd-header">
        <div className="cd-header__greeting">
          <p className="cd-header__saludo">{greeting()},</p>
          <h1 className="cd-header__name">{dbClient.nombre}</h1>
        </div>
        <div
          className="cd-header__avatar"
          aria-label={`${dbClient.nombre} ${dbClient.apellido}`}
        >
          {dbClient.nombre[0]}{dbClient.apellido[0]}
        </div>
      </header>

      {/* ── Bento Grid ── */}
      <div className="cd-bento">

        {/* Weekly Ring */}
        <div className="cd-bento-card cd-bento-card--ring">
          <h2 className="cd-bento-card__title">Semana {dbClient.semana_actual}</h2>
          <div className="cd-ring-wrap">
            <svg
              className="cd-ring-svg"
              viewBox="0 0 100 100"
              aria-label={`Semana ${dbClient.semana_actual} de ${dbClient.total_semanas}`}
            >
              <circle cx="50" cy="50" r={RING_R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
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
              <text x="50" y="46" textAnchor="middle" fontSize="18" fontWeight="700" fontFamily="var(--font-display)" fill="#ffffff">
                {dbClient.semana_actual}/{dbClient.total_semanas}
              </text>
              <text x="50" y="60" textAnchor="middle" fontSize="8" fontFamily="var(--font-body)" fill="rgba(255,255,255,0.5)">
                SEMANAS
              </text>
            </svg>
          </div>
          <p className="cd-ring-label">
            {Math.round(weekProgress * 100)}% del programa completado
          </p>
        </div>

        {/* Program progress */}
        <div className="cd-bento-card cd-bento-card--program">
          <p className="cd-bento-card__label">PROGRAMA</p>
          <p className="cd-program__weeks">
            Semana <strong>{dbClient.semana_actual}</strong>/{dbClient.total_semanas}
          </p>
          <div className="cd-program__bar-wrap" aria-label={`Semana ${dbClient.semana_actual} de ${dbClient.total_semanas}`}>
            <div className="cd-program__bar">
              <div
                className="cd-program__bar-fill"
                style={{ width: `${weekProgress * 100}%` }}
              />
            </div>
          </div>
          <p className="cd-program__pct">
            {Math.round(weekProgress * 100)}% completado
          </p>
        </div>

        {/* Routines count */}
        <div className="cd-bento-card cd-bento-card--program">
          <p className="cd-bento-card__label">MIS RUTINAS</p>
          <p className="cd-program__weeks">
            <strong>{assignedRoutines.length}</strong> rutina{assignedRoutines.length !== 1 ? 's' : ''} asignada{assignedRoutines.length !== 1 ? 's' : ''}
          </p>
          <p className="cd-program__pct" style={{ marginTop: 4 }}>
            {assignedRoutines.length === 0
              ? 'Tu entrenador aún no te asignó rutinas'
              : 'Revisá tus rutinas abajo 👇'}
          </p>
        </div>

      </div>

      {/* ── Rutinas Asignadas ── */}
      <section className="cd-routines-section">
        <h2 className="cd-routines-section__title">
          <Dumbbell size={18} strokeWidth={1.5} />
          Mis Rutinas
        </h2>

        {assignedRoutines.length === 0 ? (
          <div className="cd-routines-empty">
            <Dumbbell size={36} opacity={0.25} strokeWidth={1} />
            <p>Tu entrenador aún no te asignó ninguna rutina.</p>
            <span>¡Pronto aparecerán aquí!</span>
          </div>
        ) : (
          <div className="cd-routines-grid">
            {assignedRoutines.map(ar => {
              const routine = ar.routines
              if (!routine) return null
              return (
                <div key={ar.id} className="cd-routine-card">
                  <div className="cd-routine-card__accent" />
                  <div className="cd-routine-card__body">
                    <div className="cd-routine-card__info">
                      <h3 className="cd-routine-card__name">{routine.nombre}</h3>
                      {routine.dia && (
                        <div className="cd-routine-card__day">
                          <Calendar size={12} strokeWidth={1.5} />
                          {routine.dia}
                        </div>
                      )}
                      {routine.descripcion && (
                        <p className="cd-routine-card__desc">{routine.descripcion}</p>
                      )}
                    </div>
                    <button
                      className="cd-routine-card__btn"
                      onClick={() => navigate(`/alumno/${clienteId}/rutina/${routine.id}`)}
                      aria-label={`Ver rutina ${routine.nombre}`}
                    >
                      Ver Rutina
                      <ChevronRight size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Bottom safe area */}
      <div style={{ height: 40 }} />
    </div>
  )
}
