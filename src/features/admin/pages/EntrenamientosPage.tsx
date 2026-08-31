import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dumbbell, Plus, ChevronRight, BarChart2 } from 'lucide-react'
import { useRoutines, type RoutineRow } from '../../workouts/hooks/useRoutines'
import ExerciseBankPage from '../../../features/exercises/pages/ExerciseBankPage'
import LoadingSkeleton from '../../../components/LoadingSkeleton'
import ErrorState from '../../../components/ErrorState'
import './EntrenamientosPage.css'

type Tab = 'rutinas' | 'ejercicios'

export default function EntrenamientosPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('rutinas')

  return (
    <div className="entrenamientos-page">

      {/* ── Page Header ── */}
      <div className="entrenamientos__header">
        <div className="entrenamientos__header-left">
          <h1 className="entrenamientos__title">Entrenamientos</h1>
          <p className="entrenamientos__subtitle">
            Gestiona rutinas y tu banco de ejercicios
          </p>
        </div>

        {activeTab === 'rutinas' && (
          <button
            id="btn-nueva-rutina"
            className="btn-primary"
            onClick={() => navigate('/admin/entrenamientos/rutinas/nueva')}
          >
            <Plus size={15} strokeWidth={2} />
            Nueva Rutina
          </button>
        )}

        {activeTab === 'ejercicios' && (
          <button
            id="btn-nuevo-ejercicio-tab"
            className="btn-primary"
            onClick={() => navigate('/admin/entrenamientos/ejercicios/nuevo')}
          >
            <Plus size={15} strokeWidth={2} />
            Nuevo Ejercicio
          </button>
        )}
      </div>

      {/* ── Tabs ── */}
      <div className="entrenamientos__tabs">
        <button
          id="tab-rutinas"
          className={`entrenamientos__tab${activeTab === 'rutinas' ? ' entrenamientos__tab--active' : ''}`}
          onClick={() => setActiveTab('rutinas')}
        >
          <Dumbbell size={15} strokeWidth={1.5} />
          Rutinas
        </button>
        <button
          id="tab-ejercicios"
          className={`entrenamientos__tab${activeTab === 'ejercicios' ? ' entrenamientos__tab--active' : ''}`}
          onClick={() => setActiveTab('ejercicios')}
        >
          <BarChart2 size={15} strokeWidth={1.5} />
          Ejercicios
        </button>
      </div>

      {/* ── Tab Content ── */}
      <div className="entrenamientos__content">
        {activeTab === 'rutinas' && <RutinasTab />}
        {activeTab === 'ejercicios' && <ExerciseBankPage />}
      </div>
    </div>
  )
}

/* ── Rutinas Tab ── */
function RutinasTab() {
  const navigate = useNavigate()
  const { data: routines = [], isLoading, error, refetch } = useRoutines()

  if (isLoading) {
    return (
      <div className="rutinas-tab">
        <LoadingSkeleton count={3} variant="card" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rutinas-tab">
        <ErrorState message={error.message} onRetry={() => refetch()} />
      </div>
    )
  }

  return (
    <div className="rutinas-tab">
      {routines.length === 0 ? (
        <div className="rutinas-tab__empty">
          <Dumbbell size={40} strokeWidth={1} opacity={0.3} />
          <p>Todavía no tenés rutinas creadas.</p>
          <button
            className="btn-primary"
            onClick={() => navigate('/admin/entrenamientos/rutinas/nueva')}
          >
            <Plus size={14} strokeWidth={2} />
            Crear primera rutina
          </button>
        </div>
      ) : (
        <div className="rutinas-tab__grid">
          {routines.map(r => (
            <RoutineCard key={r.id} routine={r} />
          ))}

          {/* Add new card */}
          <button
            className="rutina-card rutina-card--add"
            onClick={() => navigate('/admin/entrenamientos/rutinas/nueva')}
            aria-label="Crear nueva rutina"
          >
            <div className="rutina-card__add-icon">
              <Plus size={24} strokeWidth={1.5} />
            </div>
            <span className="rutina-card__add-label">Nueva Rutina</span>
          </button>
        </div>
      )}
    </div>
  )
}

function RoutineCard({ routine }: { routine: RoutineRow }) {
  const navigate = useNavigate()

  return (
    <div className="rutina-card" role="article">
      {/* Color accent */}
      <div className="rutina-card__accent" />

      <div className="rutina-card__body">
        <div className="rutina-card__info">
          <h3 className="rutina-card__name">{routine.nombre}</h3>
          {routine.dia && (
            <p className="rutina-card__dia">{routine.dia}</p>
          )}
          {routine.descripcion && (
            <p className="rutina-card__dia">{routine.descripcion}</p>
          )}
        </div>

        <div className="rutina-card__actions">
          <button
            className="rutina-card__edit-btn"
            onClick={() => navigate('/admin/entrenamientos/rutinas/nueva')}
            aria-label={`Editar ${routine.nombre}`}
          >
            Editar
            <ChevronRight size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  )
}
