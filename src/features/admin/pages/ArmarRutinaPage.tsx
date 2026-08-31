import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, X } from 'lucide-react'
import { useRoutineBuilder } from '../../../features/workouts/hooks/useRoutineBuilder'
import { useCreateRoutine } from '../../../features/workouts/hooks/useRoutines'
import ExercisePicker from '../../../features/workouts/components/ExercisePicker'
import RoutineBuilder from '../../../features/workouts/components/RoutineBuilder'
import type { Tables } from '../../../lib/supabase'
import './ArmarRutinaPage.css'

export default function ArmarRutinaPage() {
  const navigate = useNavigate()
  const [routineTitle, setRoutineTitle] = useState('Nueva Rutina')
  const [isPickerOpen, setIsPickerOpen] = useState(false) // mobile drawer state
  const [pickerTargetBlockId, setPickerTargetBlockId] = useState<string | null>(null)

  const createRoutine = useCreateRoutine()

  const {
    blocks,
    addBlock,
    addExerciseToBlock,
    removeBlock,
    removeExerciseFromBlock,
    updateSetsReps,
    totalExercises,
    estimatedMinutes,
  } = useRoutineBuilder(routineTitle)

  const handleAddFromPicker = (exercise: Tables<'exercises'>) => {
    if (pickerTargetBlockId) {
      addExerciseToBlock(pickerTargetBlockId, exercise)
    } else {
      addBlock(exercise)
    }
    setIsPickerOpen(false)
    setPickerTargetBlockId(null)
  }

  const handleDropExercise = (exercise: Tables<'exercises'>) => {
    addBlock(exercise)
  }

  const handleDropToBlock = (blockId: string, exercise: Tables<'exercises'>) => {
    addExerciseToBlock(blockId, exercise)
  }

  const handleFinalize = async () => {
    try {
      await createRoutine.mutateAsync({
        nombre: routineTitle,
        dia: null,
        descripcion: `${totalExercises} ejercicios · ${estimatedMinutes} min est.`,
        trainer_id: '00000000-0000-0000-0000-000000000001',
      })
      navigate('/admin/entrenamientos')
    } catch (err) {
      console.error('Error saving routine:', err)
      navigate('/admin/entrenamientos')
    }
  }

  return (
    <div className="armar-rutina-page">

      {/* ── Desktop/Mobile Header ── */}
      <header className="armar-rutina__header">
        <div className="armar-rutina__header-left">
          <button
            className="armar-rutina__back"
            onClick={() => navigate(-1)}
            aria-label="Volver"
          >
            <ArrowLeft size={18} strokeWidth={1.5} />
          </button>
          <div className="armar-rutina__title-wrap">
            <span className="armar-rutina__title-prefix">Armar Rutina:</span>
            <input
              className="armar-rutina__title-input"
              value={routineTitle}
              onChange={e => setRoutineTitle(e.target.value)}
              aria-label="Nombre de la rutina"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Mobile-only: Finalizar en header */}
        <button
          className="armar-rutina__finalize-mobile btn-primary"
          onClick={handleFinalize}
        >
          Finalizar
        </button>
      </header>

      {/* ── Desktop Layout: split panel ── */}
      <div className="armar-rutina__body">

        {/* Left panel: Exercise Picker */}
        <div className="armar-rutina__picker-panel">
          <ExercisePicker onAdd={handleAddFromPicker} />
        </div>

        {/* Right panel: Routine Builder canvas */}
        <div className="armar-rutina__builder-panel">
          <RoutineBuilder
            blocks={blocks}
            onDropExercise={handleDropExercise}
            onDropExerciseToBlock={handleDropToBlock}
            onRemoveBlock={removeBlock}
            onRemoveExercise={removeExerciseFromBlock}
            onUpdateSetsReps={updateSetsReps}
            onFinalize={handleFinalize}
            totalExercises={totalExercises}
            estimatedMinutes={estimatedMinutes}
          />
        </div>
      </div>

      {/* ── Mobile: Routine list view ── */}
      <div className="armar-rutina__mobile-body">
        {/* Routine info */}
        <div className="armar-rutina__mobile-meta">
          <span className="armar-rutina__mobile-stats">
            {totalExercises} Ejercicio{totalExercises !== 1 ? 's' : ''} · {estimatedMinutes} min est.
          </span>
        </div>

        {/* Builder blocks */}
        <RoutineBuilder
          blocks={blocks}
          onDropExercise={handleDropExercise}
          onDropExerciseToBlock={handleDropToBlock}
          onRemoveBlock={removeBlock}
          onRemoveExercise={removeExerciseFromBlock}
          onUpdateSetsReps={updateSetsReps}
          onFinalize={handleFinalize}
          totalExercises={totalExercises}
          estimatedMinutes={estimatedMinutes}
        />

        {/* Add Exercise button (mobile) */}
        <div className="armar-rutina__mobile-add">
          <button
            className="armar-rutina__mobile-add-btn"
            onClick={() => {
              setPickerTargetBlockId(null)
              setIsPickerOpen(true)
            }}
          >
            <Plus size={18} strokeWidth={2} />
            Agregar Ejercicio
          </button>
        </div>

        {/* Mobile FAB */}
        <button
          id="fab-armar-rutina"
          className="armar-rutina__fab"
          onClick={() => {
            setPickerTargetBlockId(null)
            setIsPickerOpen(true)
          }}
          aria-label="Agregar ejercicio"
        >
          <Plus size={24} strokeWidth={2} />
        </button>
      </div>

      {/* ── Mobile: Exercise Picker Bottom Sheet ── */}
      {isPickerOpen && (
        <div className="armar-rutina__sheet-overlay" onClick={() => setIsPickerOpen(false)}>
          <div
            className="armar-rutina__sheet"
            onClick={e => e.stopPropagation()}
          >
            <div className="armar-rutina__sheet-header">
              <span className="armar-rutina__sheet-title">Banco de Ejercicios</span>
              <button
                className="armar-rutina__sheet-close"
                onClick={() => setIsPickerOpen(false)}
                aria-label="Cerrar"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>
            <div className="armar-rutina__sheet-body">
              <ExercisePicker onAdd={handleAddFromPicker} />
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
