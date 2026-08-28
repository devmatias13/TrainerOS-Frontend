import { Dumbbell, Hammer } from 'lucide-react'
import './PlaceholderPage.css'

export default function EntrenamientosPage() {
  return (
    <div className="placeholder-page">
      <div className="page-header">
        <h1 className="page-header__title">Entrenamientos</h1>
      </div>
      <div className="placeholder-content">
        <div className="placeholder-icon">
          <Dumbbell size={48} strokeWidth={1} />
        </div>
        <h2 className="placeholder-title">Módulo en construcción</h2>
        <p className="placeholder-desc">
          El constructor de rutinas y banco de ejercicios estará disponible muy pronto.
          Aquí podrás armar bloques, superseries y asignar rutinas a tus clientes.
        </p>
        <div className="placeholder-badge">
          <Hammer size={14} strokeWidth={1.5} />
          Próximamente
        </div>
      </div>
    </div>
  )
}
