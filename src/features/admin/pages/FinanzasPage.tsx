import { CreditCard, Hammer } from 'lucide-react'
import './PlaceholderPage.css'

export default function FinanzasPage() {
  return (
    <div className="placeholder-page">
      <div className="page-header">
        <h1 className="page-header__title">Finanzas</h1>
      </div>
      <div className="placeholder-content">
        <div className="placeholder-icon">
          <CreditCard size={48} strokeWidth={1} />
        </div>
        <h2 className="placeholder-title">Módulo en construcción</h2>
        <p className="placeholder-desc">
          El panel de finanzas te permitirá controlar ingresos, pagos pendientes
          y el estado de suscripción de cada cliente en un solo lugar.
        </p>
        <div className="placeholder-badge">
          <Hammer size={14} strokeWidth={1.5} />
          Próximamente
        </div>
      </div>
    </div>
  )
}
