import { Bell, UserCircle } from 'lucide-react'
import './Topbar.css'

interface TopbarProps {
  title?: string
}

export default function Topbar({ title }: TopbarProps) {
  return (
    <header className="topbar">
      {title && <h1 className="topbar__title">{title}</h1>}
      <div className="topbar__actions">
        <button className="topbar__icon-btn" aria-label="Notificaciones">
          <Bell size={18} strokeWidth={1.5} />
          <span className="topbar__badge" />
        </button>
        <div className="topbar__avatar">
          <UserCircle size={32} strokeWidth={1.5} />
        </div>
      </div>
    </header>
  )
}
