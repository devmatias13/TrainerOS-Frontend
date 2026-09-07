import { useState } from 'react'
import { X, Search, Dumbbell, CheckCircle2, Plus } from 'lucide-react'
import { useRoutines } from '../../workouts/hooks/useRoutines'
import { useAssignRoutine, useClientRoutines } from '../hooks/useClientRoutines'
import './AssignRoutineModal.css'

interface AssignRoutineModalProps {
  isOpen: boolean
  clientId: string
  clientName: string
  onClose: () => void
}

export default function AssignRoutineModal({
  isOpen,
  clientId,
  clientName,
  onClose,
}: AssignRoutineModalProps) {
  const [search, setSearch] = useState('')

  const { data: allRoutines = [], isLoading: loadingRoutines } = useRoutines()
  const { data: assignedRoutines = [] } = useClientRoutines(clientId)
  const assignRoutine = useAssignRoutine()

  const assignedIds = new Set(assignedRoutines.map(ar => ar.routine_id))

  const filtered = allRoutines.filter(r =>
    r.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (r.dia?.toLowerCase().includes(search.toLowerCase()) ?? false)
  )

  const handleAssign = async (routineId: string) => {
    if (assignedIds.has(routineId)) return
    try {
      await assignRoutine.mutateAsync({ clientId, routineId })
    } catch (err) {
      console.error('Error assigning routine:', err)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="assign-modal-overlay"
      role="dialog"
      aria-modal="true"
      onClick={e => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="assign-modal">
        {/* Header */}
        <div className="assign-modal__header">
          <div>
            <h3 className="assign-modal__title">Asignar Rutina</h3>
            <p className="assign-modal__subtitle">a {clientName}</p>
          </div>
          <button
            type="button"
            className="assign-modal__close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="assign-modal__search-wrap">
          <Search size={15} className="assign-modal__search-icon" />
          <input
            type="text"
            className="assign-modal__search"
            placeholder="Buscar rutina..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* List */}
        <div className="assign-modal__list">
          {loadingRoutines ? (
            <div className="assign-modal__empty">Cargando rutinas...</div>
          ) : filtered.length === 0 ? (
            <div className="assign-modal__empty">
              <Dumbbell size={32} opacity={0.3} strokeWidth={1} />
              <p>No hay rutinas disponibles</p>
            </div>
          ) : (
            filtered.map(routine => {
              const isAssigned = assignedIds.has(routine.id)
              return (
                <button
                  key={routine.id}
                  className={`assign-modal__item${isAssigned ? ' assign-modal__item--assigned' : ''}`}
                  onClick={() => handleAssign(routine.id)}
                  disabled={isAssigned || assignRoutine.isPending}
                  aria-label={isAssigned ? `${routine.nombre} ya asignada` : `Asignar ${routine.nombre}`}
                >
                  <div className="assign-modal__item-info">
                    <span className="assign-modal__item-name">{routine.nombre}</span>
                    {routine.dia && (
                      <span className="assign-modal__item-day">{routine.dia}</span>
                    )}
                    {routine.descripcion && (
                      <span className="assign-modal__item-desc">{routine.descripcion}</span>
                    )}
                  </div>
                  <div className="assign-modal__item-action">
                    {isAssigned ? (
                      <CheckCircle2 size={18} className="assign-modal__item-check" />
                    ) : (
                      <Plus size={18} className="assign-modal__item-plus" />
                    )}
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
