import { useState, useEffect, useRef } from 'react'
import type { BlockExercise } from '../api/workouts.api'
import './SetRepEditor.css'

interface SetRepEditorProps {
  blockExercise: BlockExercise
  onSave: (sets: number, reps: string) => void
  onClose: () => void
}

export default function SetRepEditor({
  blockExercise,
  onSave,
  onClose,
}: SetRepEditorProps) {
  const [sets, setSets] = useState(blockExercise.sets)
  const [reps, setReps] = useState(blockExercise.reps)
  const dialogRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const handleSave = () => {
    onSave(sets, reps)
    onClose()
  }

  const QUICK_REPS = ['6', '8', '10', '12', '15', '8-10', '10-12', '12-15']
  const QUICK_SETS = [2, 3, 4, 5]

  return (
    <div className="sre-overlay" role="dialog" aria-modal="true" aria-label="Editar Series y Reps">
      <div className="sre-panel" ref={dialogRef}>
        <div className="sre-header">
          <span className="sre-exercise-name">{blockExercise.exercise.nombre}</span>
          <button className="sre-close" onClick={onClose} aria-label="Cerrar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="sre-body">
          {/* Sets */}
          <div className="sre-field">
            <label className="sre-label">Series</label>
            <div className="sre-counter">
              <button
                className="sre-counter__btn"
                onClick={() => setSets(s => Math.max(1, s - 1))}
                aria-label="Menos series"
              >−</button>
              <span className="sre-counter__value">{sets}</span>
              <button
                className="sre-counter__btn"
                onClick={() => setSets(s => Math.min(10, s + 1))}
                aria-label="Más series"
              >+</button>
            </div>
            <div className="sre-quick-btns">
              {QUICK_SETS.map(q => (
                <button
                  key={q}
                  className={`sre-quick${sets === q ? ' sre-quick--active' : ''}`}
                  onClick={() => setSets(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Reps */}
          <div className="sre-field">
            <label className="sre-label">Repeticiones</label>
            <input
              className="sre-input"
              type="text"
              value={reps}
              onChange={e => setReps(e.target.value)}
              placeholder="10 ó 8-12"
              aria-label="Repeticiones"
            />
            <div className="sre-quick-btns">
              {QUICK_REPS.map(q => (
                <button
                  key={q}
                  className={`sre-quick${reps === q ? ' sre-quick--active' : ''}`}
                  onClick={() => setReps(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="sre-preview">
          <span className="sre-preview__sets">{sets}</span>
          <span className="sre-preview__label">SETS</span>
          <span className="sre-preview__x">×</span>
          <span className="sre-preview__reps">{reps}</span>
          <span className="sre-preview__label">REPS</span>
        </div>

        <div className="sre-footer">
          <button className="sre-btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="sre-btn-save" onClick={handleSave}>Guardar</button>
        </div>
      </div>
    </div>
  )
}
