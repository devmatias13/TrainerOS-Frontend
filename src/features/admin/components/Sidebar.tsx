import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  CreditCard,
  UserPlus,
  HelpCircle,
  LogOut,
} from 'lucide-react'
import './Sidebar.css'

const navItems = [
  { to: '/admin/dashboard',      icon: LayoutDashboard, label: 'Panel General' },
  { to: '/admin/clientes',       icon: Users,           label: 'Clientes' },
  { to: '/admin/entrenamientos', icon: Dumbbell,        label: 'Entrenamientos' },
  { to: '/admin/finanzas',       icon: CreditCard,      label: 'Finanzas' },
]

export default function Sidebar() {
  const navigate = useNavigate()

  return (
    <>
      {/* ── Desktop sidebar ───────────────────────────── */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar__logo">
          <div className="sidebar__logo-mark">
            <span>T</span>
          </div>
          <div className="sidebar__logo-text">
            <span className="sidebar__logo-name">TrainerOS</span>
            <span className="sidebar__logo-tagline">Elite Performance</span>
          </div>
        </div>

        {/* Primary Nav */}
        <nav className="sidebar__nav">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sidebar__nav-item${isActive ? ' sidebar__nav-item--active' : ''}`
              }
            >
              <Icon size={18} strokeWidth={1.5} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* CTA */}
        <button
          className="sidebar__cta"
          onClick={() => navigate('/admin/clientes/nuevo')}
        >
          <UserPlus size={16} strokeWidth={1.5} />
          Añadir Cliente
        </button>

        {/* Footer links */}
        <div className="sidebar__footer">
          <button className="sidebar__footer-item">
            <HelpCircle size={16} strokeWidth={1.5} />
            <span>Soporte</span>
          </button>
          <button className="sidebar__footer-item">
            <LogOut size={16} strokeWidth={1.5} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* ── Mobile bottom navigation ──────────────────── */}
      <nav className="bottom-nav">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `bottom-nav__item${isActive ? ' bottom-nav__item--active' : ''}`
            }
          >
            <Icon size={22} strokeWidth={1.5} />
            <span>{label.split(' ')[0]}</span>
          </NavLink>
        ))}
      </nav>
    </>
  )
}
