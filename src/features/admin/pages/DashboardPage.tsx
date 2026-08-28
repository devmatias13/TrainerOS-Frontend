import { Copy, UserPlus, Plus, CalendarPlus, MoreHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './DashboardPage.css'

/* ── Progress Ring SVG ─────────────────────────────────────────── */
function ProgressRing({ percent }: { percent: number }) {
  const r = 54
  const circ = 2 * Math.PI * r
  const filled = (percent / 100) * circ

  return (
    <svg className="progress-ring" viewBox="0 0 128 128" width="128" height="128">
      {/* Outer track */}
      <circle cx="64" cy="64" r={r} fill="none" stroke="rgba(189,196,212,0.25)" strokeWidth="10" />
      {/* Outer fill */}
      <circle
        cx="64" cy="64" r={r}
        fill="none"
        stroke="white"
        strokeWidth="10"
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 64 64)"
        style={{ transition: 'stroke-dasharray 1s ease' }}
      />
      {/* Inner track */}
      <circle cx="64" cy="64" r="38" fill="none" stroke="rgba(189,196,212,0.15)" strokeWidth="8" />
      {/* Inner fill */}
      <circle
        cx="64" cy="64" r="38"
        fill="none"
        stroke="rgba(189,196,212,0.55)"
        strokeWidth="8"
        strokeDasharray={`${(0.68 * 2 * Math.PI * 38)} ${2 * Math.PI * 38}`}
        strokeLinecap="round"
        transform="rotate(-90 64 64)"
      />
      <text x="64" y="60" textAnchor="middle" fill="white" fontSize="18" fontWeight="700" fontFamily="'Plus Jakarta Sans',sans-serif">
        {percent}%
      </text>
      <text x="64" y="76" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="10" fontFamily="Inter,sans-serif">
        Meta
      </text>
    </svg>
  )
}

/* ── Heatmap ────────────────────────────────────────────────────── */
const HEATMAP_ROWS = 5
const HEATMAP_COLS = 7
function getIntensity() {
  const levels = [0, 1, 2, 3]
  return levels[Math.floor(Math.random() * levels.length)]
}
const heatmapData = Array.from({ length: HEATMAP_ROWS }, () =>
  Array.from({ length: HEATMAP_COLS }, () => getIntensity())
)
const intensityBg = ['#e5e2dc', '#8496b7', '#4d6080', '#1C2E4A']

function Heatmap() {
  return (
    <div className="heatmap">
      {heatmapData.map((row, ri) => (
        <div key={ri} className="heatmap__row">
          {row.map((lvl, ci) => (
            <div
              key={ci}
              className="heatmap__cell"
              style={{ background: intensityBg[lvl] }}
              title={`Intensidad: ${lvl}`}
            />
          ))}
        </div>
      ))}
      <div className="heatmap__legend">
        <span>Menos Activo</span>
        <div className="heatmap__legend-swatches">
          {intensityBg.map((bg, i) => (
            <div key={i} className="heatmap__cell heatmap__cell--sm" style={{ background: bg }} />
          ))}
        </div>
        <span>Muy Activo</span>
      </div>
    </div>
  )
}

/* ── Clients recientes ─────────────────────────────────────────── */
const recentClients = [
  { initials: 'EJ', name: 'Emma Johnson',  color: '#BDC4D4' },
  { initials: 'DL', name: 'David Lee',     color: '#8496b7' },
  { initials: 'TC', name: 'Tom Cruise',    color: '#1C2E4A' },
]

/* ── Sessions próximas ─────────────────────────────────────────── */
const nextSessions = [
  { name: 'Sarah Jenkins', type: 'HIIT Circuit • 10:00 AM', badge: 'En 2 hs' },
  { name: 'Mike Ross',     type: 'Strength Training • 1:00 PM', badge: 'Hoy' },
]

/* ── Page ───────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const navigate = useNavigate()

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard__header">
        <div className="dashboard__header-left">
          <h1 className="dashboard__greeting">¡Bienvenido de nuevo, Coach!</h1>
          <p className="dashboard__sub">Tu link de acceso para alumnos es:</p>
        </div>
        <div className="dashboard__link-chip">
          <span>traineros.com/coach/unique-link</span>
          <button className="dashboard__copy-btn" aria-label="Copiar link">
            <Copy size={14} strokeWidth={1.5} />
          </button>
        </div>
        <div className="dashboard__topbar-actions">
          <button className="topbar-icon-btn" aria-label="Notificaciones">
            <span className="topbar-notif-dot" />
            🔔
          </button>
        </div>
      </div>

      {/* Bento grid */}
      <div className="dashboard__bento">

        {/* ── Resumen Mensual ── */}
        <div className="bento-card bento-card--dark bento-span-8">
          <div className="resumen__data">
            <p className="resumen__label">Ingresos Totales</p>
            <p className="resumen__value">$24,500</p>
            <p className="resumen__label resumen__label--mt">Alumnos Activos</p>
            <p className="resumen__active">142</p>
          </div>
          <div className="resumen__ring">
            <ProgressRing percent={82} />
          </div>
        </div>

        {/* ── Acciones Rápidas ── */}
        <div className="bento-card bento-span-4">
          <p className="bento-card__title">Acciones Rápidas</p>
          <div className="quick-actions">
            <button
              className="quick-action quick-action--primary"
              onClick={() => navigate('/admin/clientes/nuevo')}
            >
              <UserPlus size={16} strokeWidth={1.5} />
              Añadir Nuevo Cliente
            </button>
            <button
              className="quick-action quick-action--secondary"
              onClick={() => navigate('/admin/entrenamientos')}
            >
              <Plus size={16} strokeWidth={1.5} />
              Crear Rutina
            </button>
            <button className="quick-action quick-action--secondary">
              <CalendarPlus size={16} strokeWidth={1.5} />
              Registrar Sesión
            </button>
          </div>
        </div>

        {/* ── Check-ins Heatmap ── */}
        <div className="bento-card bento-span-7">
          <div className="bento-card__header">
            <p className="bento-card__title">Check-ins de Clientes (30 Días)</p>
            <button className="bento-card__more"><MoreHorizontal size={16} strokeWidth={1.5} /></button>
          </div>
          <Heatmap />
        </div>

        {/* ── Próximas Sesiones ── */}
        <div className="bento-card bento-span-5">
          <div className="bento-card__header">
            <p className="bento-card__title">Próximas Sesiones</p>
            <a href="#" className="bento-card__link">Ver Todo</a>
          </div>
          <div className="sessions">
            {nextSessions.map((s, i) => (
              <div key={i} className="session-item">
                <div className="session-item__icon">🏋️</div>
                <div className="session-item__info">
                  <p className="session-item__name">{s.name}</p>
                  <p className="session-item__type">{s.type}</p>
                </div>
                <span className="session-item__badge">{s.badge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Clientes Recientes ── */}
        <div className="bento-card bento-span-12">
          <div className="bento-card__header">
            <p className="bento-card__title">Clientes Recientes</p>
            <a href="#" className="bento-card__link" onClick={e => { e.preventDefault(); navigate('/admin/clientes') }}>Ver Todos los Clientes</a>
          </div>
          <div className="recent-clients">
            {recentClients.map((c, i) => (
              <div key={i} className="recent-client-card">
                <div className="recent-client-card__avatar" style={{ background: c.color }}>
                  <span style={{ color: c.color === '#1C2E4A' ? '#fff' : '#1C2E4A' }}>{c.initials}</span>
                </div>
                <p className="recent-client-card__name">{c.name}</p>
              </div>
            ))}
            <div className="recent-client-card recent-client-card--add" onClick={() => navigate('/admin/clientes/nuevo')}>
              <div className="recent-client-card__avatar recent-client-card__avatar--add">
                <Plus size={20} strokeWidth={1.5} />
              </div>
              <p className="recent-client-card__name">Añadir</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
