import type { LucideIcon } from 'lucide-react'
import { Inbox } from 'lucide-react'
import './EmptyState.css'

interface EmptyStateProps {
  icon?: LucideIcon
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'Sin datos',
  description = 'No hay nada para mostrar aún.',
  action,
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        <Icon size={32} strokeWidth={1.5} />
      </div>
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__desc">{description}</p>
      {action && (
        <button className="empty-state__cta" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  )
}
