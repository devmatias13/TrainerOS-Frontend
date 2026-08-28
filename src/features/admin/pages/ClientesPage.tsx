import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserPlus, UserCircle, FileText, MessageSquare } from 'lucide-react'
import './ClientesPage.css'

type Tab = 'todos' | 'activos' | 'pendientes' | 'vencer'
type StatusType = 'aldia' | 'vence' | 'pendiente'

interface Client {
  id: number
  name: string
  goal: string
  initials: string
  status: StatusType
  statusLabel: string
  lastSession: string
}

const CLIENTS: Client[] = [
  { id: 1, name: 'Carlos Rivera', goal: 'Hipertrofia A',    initials: 'CR', status: 'aldia',    statusLabel: 'Al día',          lastSession: 'Ayer' },
  { id: 2, name: 'Ana Gómez',     goal: 'Pérdida de Peso B', initials: 'AG', status: 'vence',    statusLabel: 'Vence en 3 días', lastSession: 'Hace 2 días' },
  { id: 3, name: 'Miguel López',  goal: 'Fuerza Base',       initials: 'ML', status: 'pendiente',statusLabel: 'Pendiente',        lastSession: 'Hace 1 semana' },
  { id: 4, name: 'Laura Pérez',   goal: 'Resistencia',       initials: 'LP', status: 'aldia',    statusLabel: 'Al día',          lastSession: 'Hoy' },
  { id: 5, name: 'Rodrigo Vega',  goal: 'Hipertrofia B',     initials: 'RV', status: 'pendiente',statusLabel: 'Pendiente',        lastSession: 'Hace 2 semanas' },
]

const statusColor: Record<StatusType, string> = {
  aldia:    '#22c55e',
  vence:    '#f59e0b',
  pendiente:'#ba1a1a',
}

const tabs: { key: Tab; label: string }[] = [
  { key: 'todos',      label: 'Todos' },
  { key: 'activos',    label: 'Activos' },
  { key: 'pendientes', label: 'Pendientes' },
  { key: 'vencer',     label: 'Próximos a Vencer' },
]

function filterClients(clients: Client[], tab: Tab) {
  if (tab === 'todos')      return clients
  if (tab === 'activos')    return clients.filter(c => c.status === 'aldia')
  if (tab === 'pendientes') return clients.filter(c => c.status === 'pendiente')
  if (tab === 'vencer')     return clients.filter(c => c.status === 'vence')
  return clients
}

export default function ClientesPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('todos')

  const displayed = filterClients(CLIENTS, activeTab)

  return (
    <div className="clientes-page">
      {/* Page header */}
      <div className="page-header">
        <h1 className="page-header__title">Gestión de Clientes</h1>
        <button
          className="btn-primary"
          onClick={() => navigate('/admin/clientes/nuevo')}
        >
          <UserPlus size={16} strokeWidth={1.5} />
          Nuevo Cliente
        </button>
      </div>

      {/* Tabs */}
      <div className="clientes-page__tabs">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`tab-btn${activeTab === t.key ? ' tab-btn--active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Client grid */}
      <div className="clientes-grid">
        {displayed.map(client => (
          <div key={client.id} className="client-card">
            <div className="client-card__header">
              <div className="client-card__avatar">
                <UserCircle size={28} strokeWidth={1.5} />
                <span className="client-card__initials">{client.initials}</span>
              </div>
              <div className="client-card__info">
                <p className="client-card__name">{client.name}</p>
                <p className="client-card__goal">{client.goal}</p>
              </div>
            </div>

            <div className="client-card__status-row">
              <div className="client-card__status">
                <span
                  className="status-dot"
                  style={{ background: statusColor[client.status] }}
                />
                <span className="status-label">{client.statusLabel}</span>
              </div>
              <span className="client-card__last-session">
                Últ. Sesión: {client.lastSession}
              </span>
            </div>

            <div className="client-card__actions">
              <button className="icon-action-btn" title="Ver perfil">
                <UserCircle size={16} strokeWidth={1.5} />
              </button>
              <button className="icon-action-btn" title="Ver rutina">
                <FileText size={16} strokeWidth={1.5} />
              </button>
              <button className="icon-action-btn" title="Mensaje">
                <MessageSquare size={16} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
