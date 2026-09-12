import { useNavigate } from 'react-router-dom'
import './NotFoundPage.css'

export default function NotFoundPage() {
  const navigate = useNavigate()

  const RING_R = 44
  const RING_CIRC = 2 * Math.PI * RING_R

  return (
    <div className="not-found">

      {/* ── Ring — 0% progress, the signature element ── */}
      <div className="nf-ring-wrap" aria-hidden="true">
        <svg viewBox="0 0 100 100" className="nf-ring-svg">
          {/* Outer decorative tick marks */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i / 12) * 360 - 90
            const rad = (angle * Math.PI) / 180
            const r1 = 48, r2 = 44
            return (
              <line
                key={i}
                x1={50 + r1 * Math.cos(rad)}
                y1={50 + r1 * Math.sin(rad)}
                x2={50 + r2 * Math.cos(rad)}
                y2={50 + r2 * Math.sin(rad)}
                stroke="rgba(82,103,125,0.25)"
                strokeWidth="1"
                strokeLinecap="round"
              />
            )
          })}

          {/* Track */}
          <circle
            cx="50" cy="50" r={RING_R}
            fill="none"
            stroke="rgba(82,103,125,0.15)"
            strokeWidth="9"
          />

          {/* Progress arc — 0%, just a tiny cap showing the starting point */}
          <circle
            cx="50" cy="50" r={RING_R}
            fill="none"
            stroke="rgba(28,46,74,0.6)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={RING_CIRC}
            strokeDashoffset={RING_CIRC * 0.999}
            transform="rotate(-90 50 50)"
          />

          {/* Center text */}
          <text
            x="50" y="45"
            textAnchor="middle"
            fontSize="22"
            fontWeight="700"
            fontFamily="'Plus Jakarta Sans', sans-serif"
            fill="rgba(255,255,255,0.9)"
            letterSpacing="-1"
          >
            404
          </text>
          <text
            x="50" y="58"
            textAnchor="middle"
            fontSize="7"
            fontFamily="'Inter', sans-serif"
            fill="rgba(82,103,125,0.7)"
            letterSpacing="1.5"
          >
            NO ENCONTRADO
          </text>
        </svg>
      </div>

      {/* ── Copy ── */}
      <div className="nf-copy">
        <p className="nf-eyebrow">Error de ruta</p>
        <h1 className="nf-headline">Esta página no existe<br />en tu programa</h1>
        <p className="nf-body">
          El link que seguiste no corresponde a ninguna ruta registrada.
          Volvé al inicio o revisá la URL.
        </p>
      </div>

      {/* ── CTAs ── */}
      <div className="nf-actions">
        <button
          className="nf-btn nf-btn--primary"
          onClick={() => navigate('/admin/dashboard')}
        >
          Ir al Panel
        </button>
        <button
          className="nf-btn nf-btn--secondary"
          onClick={() => navigate(-1)}
        >
          Volver atrás
        </button>
      </div>

      {/* ── Ambient grid lines (decoration) ── */}
      <div className="nf-grid-bg" aria-hidden="true" />

    </div>
  )
}
