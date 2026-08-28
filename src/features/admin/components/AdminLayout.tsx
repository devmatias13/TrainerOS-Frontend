import { Outlet } from 'react-router-dom'
import { Bell, UserCircle } from 'lucide-react'
import Sidebar from './Sidebar'
import './AdminLayout.css'
import './MobileTopbar.css'

function MobileTopbar() {
  return (
    <header className="mobile-topbar">
      <div className="mobile-topbar__logo">
        <div className="mobile-topbar__logo-mark">T</div>
        <span className="mobile-topbar__logo-name">TrainerOS</span>
      </div>
      <div className="mobile-topbar__actions">
        <button className="mobile-topbar__icon-btn" aria-label="Notificaciones">
          <Bell size={20} strokeWidth={1.5} />
          <span className="mobile-topbar__badge" />
        </button>
        <div className="mobile-topbar__avatar">
          <UserCircle size={30} strokeWidth={1.5} />
        </div>
      </div>
    </header>
  )
}

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-layout__main">
        <MobileTopbar />
        <Outlet />
      </div>
    </div>
  )
}
