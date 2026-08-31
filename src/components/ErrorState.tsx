import { AlertTriangle, RefreshCw } from 'lucide-react'
import './ErrorState.css'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export default function ErrorState({
  message = 'Ocurrió un error al cargar los datos.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="error-state">
      <div className="error-state__icon">
        <AlertTriangle size={32} strokeWidth={1.5} />
      </div>
      <p className="error-state__message">{message}</p>
      {onRetry && (
        <button className="error-state__retry" onClick={onRetry}>
          <RefreshCw size={16} strokeWidth={2} />
          Reintentar
        </button>
      )}
    </div>
  )
}
