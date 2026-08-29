import { useState } from 'react'
import './WeightLogger.css'

interface WeightLoggerProps {
  targetKg?: number
  setsTotal: number
  setsCompleted: number
  onSetComplete: (kg: number) => void
}

export default function WeightLogger({
  targetKg,
  setsTotal,
  setsCompleted,
  onSetComplete,
}: WeightLoggerProps) {
  const [pesoInput, setPesoInput] = useState(targetKg?.toString() ?? '')
  const [justCompleted, setJustCompleted] = useState(false)

  const remaining = setsTotal - setsCompleted
  const isDone = remaining === 0

  const handleComplete = () => {
    const kg = parseFloat(pesoInput)
    if (isNaN(kg) || kg <= 0) return
    onSetComplete(kg)
    // Animate check
    setJustCompleted(true)
    setTimeout(() => setJustCompleted(false), 800)
  }

  return (
    <div className="weight-logger">
      {/* Sets progress dots */}
      <div className="weight-logger__sets-row">
        <span className="weight-logger__sets-label">Series</span>
        <div className="weight-logger__dots" aria-label={`${setsCompleted} de ${setsTotal} series completadas`}>
          {Array.from({ length: setsTotal }).map((_, i) => (
            <span
              key={i}
              className={`weight-logger__dot${i < setsCompleted ? ' weight-logger__dot--done' : ''}`}
            />
          ))}
        </div>
        <span className="weight-logger__sets-count">
          {isDone ? '✓ Completado' : `${setsCompleted}/${setsTotal}`}
        </span>
      </div>

      {/* Input row */}
      {!isDone && (
        <div className="weight-logger__input-row">
          <div className="weight-logger__input-wrap">
            <input
              id={`peso-input-${setsCompleted}`}
              className="weight-logger__input"
              type="number"
              inputMode="decimal"
              placeholder="Peso"
              value={pesoInput}
              onChange={e => setPesoInput(e.target.value)}
              onFocus={e => e.target.select()}
              aria-label="Peso en kilogramos"
            />
            <span className="weight-logger__unit">kg</span>
          </div>

          {targetKg && (
            <span className="weight-logger__objective">
              Objetivo: {targetKg}kg
            </span>
          )}

          <button
            className={`weight-logger__check-btn${justCompleted ? ' weight-logger__check-btn--flash' : ''}`}
            onClick={handleComplete}
            aria-label="Marcar serie como completada"
            disabled={!pesoInput || parseFloat(pesoInput) <= 0}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </button>
        </div>
      )}

      {isDone && (
        <div className="weight-logger__done-row">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>Todas las series completadas con {pesoInput}kg</span>
        </div>
      )}
    </div>
  )
}
