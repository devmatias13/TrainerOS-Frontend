import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserPlus, UserCircle, FileText, MessageSquare } from 'lucide-react'
import { useClients } from '../hooks/useClients'
import LoadingSkeleton from '../../../components/LoadingSkeleton'
import ErrorState from '../../../components/ErrorState'
import EmptyState from '../../../components/EmptyState'
import './ClientesPage.css'

type Tab = 'todos' | 'activos' | 'pendientes' | 'vencer'

const statusColor: Record<string, string> = {
  aldia:    '#22c55e',
  vence:    '#f59e0b',
  pendiente:'#ba1a1a',
}

const statusLabels: Record<string, string> = {
  aldia:     'Al día',
  vence:     'Vence pronto',
  pendiente: 'Pendiente',
}

const tabs: { key: Tab; label: string }[] = [
  { key: 'todos',      label: 'Todos' },
  { key: 'activos',    label: 'Activos' },
  { key: 'pendientes', label: 'Pendientes' },
  { key: 'vencer',     label: 'Próximos a Vencer' },
]

function getInitials(nombre: string, apellido: string): string {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
}

export default function ClientesPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('todos')

  const { data: clients = [], isLoading, error, refetch } = useClients(activeTab)

  if (isLoading) {
    return (
      <div className="clientes-page">
        <div className="page-header">
          <h1 className="page-header__title">Gestión de Clientes</h1>
        </div>
        <LoadingSkeleton count={4} variant="list" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="clientes-page">
        <ErrorState message={error.message} onRetry={() => refetch()} />
      </div>
    )
  }

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
      {clients.length === 0 ? (
        <EmptyState
          icon={UserCircle}
          title="Sin clientes"
          description="Aún no tenés clientes registrados. Creá el primero para empezar."
          action={{
            label: 'Nuevo Cliente',
            onClick: () => navigate('/admin/clientes/nuevo'),
          }}
        />
      ) : (
        <div className="clientes-grid">
          {clients.map(client => (
            <div key={client.id} className="client-card">
              <div className="client-card__header">
                <div className="client-card__avatar">
                  <UserCircle size={28} strokeWidth={1.5} />
                  <span className="client-card__initials">
                    {getInitials(client.nombre, client.apellido)}
                  </span>
                </div>
                <div className="client-card__info">
                  <p className="client-card__name">
                    {client.nombre} {client.apellido}
                  </p>
                  <p className="client-card__goal">{client.objetivo ?? client.plan_tier}</p>
                </div>
              </div>

              <div className="client-card__status-row">
                <div className="client-card__status">
                  <span
                    className="status-dot"
                    style={{ background: statusColor[client.status] ?? '#94a3b8' }}
                  />
                  <span className="status-label">
                    {statusLabels[client.status] ?? client.status}
                  </span>
                </div>
                <span className="client-card__last-session">
                  Semana {client.semana_actual}/{client.total_semanas}
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
      )}
    </div>
  )
}
