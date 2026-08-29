import { useState, type FormEvent, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, Video } from 'lucide-react'
import { MUSCLE_GROUPS, type MuscleGroup, type Difficulty } from '../api/exercises.api'
import ClientPreview from '../components/ClientPreview'
import './NuevoEjercicioPage.css'

type FormState = {
  nombre: string
  grupoMuscular: MuscleGroup | ''
  dificultad: Difficulty
  instrucciones: string
  videoUrl: string
}

const INITIAL: FormState = {
  nombre: '',
  grupoMuscular: '',
  dificultad: 'Intermedio',
  instrucciones: '',
  videoUrl: '',
}

const DIFFICULTIES: Difficulty[] = ['Principiante', 'Intermedio', 'Avanzado']

export default function NuevoEjercicioPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(INITIAL)

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm(prev => ({ ...prev, [key]: val }))

  // Build preview data
  const previewInstructions = form.instrucciones
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const exercise = {
      ...form,
      instrucciones: previewInstructions,
      id: `ex-${Date.now()}`,
    }
    console.log('Guardar ejercicio:', exercise)
    navigate('/admin/entrenamientos/ejercicios')
  }

  // Scroll to top on mount
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="nuevo-ejercicio-page">

      {/* ── Mobile Header ── */}
      <div className="nuevo-ejercicio__mobile-header">
        <button
          className="nuevo-ejercicio__back-btn"
          onClick={() => navigate(-1)}
          aria-label="Volver"
        >
          <ArrowLeft size={20} strokeWidth={1.5} />
        </button>
        <h1 className="nuevo-ejercicio__mobile-title">Nuevo Ejercicio</h1>
        <div style={{ width: 36 }} />
      </div>

      {/* ── Desktop Header ── */}
      <div className="nuevo-ejercicio__desktop-header">
        <div className="nuevo-ejercicio__desktop-header-left">
          <button
            className="nuevo-ejercicio__back-link"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            Banco de Ejercicios
          </button>
          <h1 className="nuevo-ejercicio__title">Nuevo Ejercicio</h1>
          <p className="nuevo-ejercicio__subtitle">
            Añade un nuevo movimiento a tu base de datos de ejercicios.
          </p>
        </div>
        <button
          id="btn-guardar-ejercicio-desktop"
          className="btn-primary nuevo-ejercicio__save-btn"
          onClick={handleSubmit}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
            <polyline points="7 3 7 8 15 8"/>
          </svg>
          Guardar Ejercicio
        </button>
      </div>

      {/* ── Body ── */}
      <form
        className="nuevo-ejercicio__body"
        onSubmit={handleSubmit}
        id="form-nuevo-ejercicio"
      >

        {/* LEFT COLUMN */}
        <div className="nuevo-ejercicio__left">

          {/* Detalles del Ejercicio */}
          <div className="ne-section">
            <div className="ne-section__heading">
              <FileText size={16} strokeWidth={1.5} className="ne-section__icon" />
              <h2 className="ne-section__title">Detalles del Ejercicio</h2>
            </div>

            <div className="ne-field">
              <label htmlFor="ne-nombre" className="ne-label">
                Nombre del Ejercicio
              </label>
              <input
                id="ne-nombre"
                className="ne-input"
                type="text"
                placeholder="Ej. Sentadilla Frontal con Barra"
                value={form.nombre}
                onChange={e => set('nombre', e.target.value)}
                required
                autoComplete="off"
              />
            </div>

            <div className="ne-row">
              <div className="ne-field">
                <label htmlFor="ne-grupo" className="ne-label">
                  Grupo Muscular Principal
                </label>
                <select
                  id="ne-grupo"
                  className="ne-input"
                  value={form.grupoMuscular}
                  onChange={e => set('grupoMuscular', e.target.value as MuscleGroup)}
                  required
                >
                  <option value="" disabled>Seleccionar…</option>
                  {MUSCLE_GROUPS.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div className="ne-field">
                <label className="ne-label">Nivel de Dificultad</label>
                {/* Desktop: select */}
                <select
                  id="ne-dificultad-select"
                  className="ne-input ne-difficulty-select"
                  value={form.dificultad}
                  onChange={e => set('dificultad', e.target.value as Difficulty)}
                >
                  {DIFFICULTIES.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                {/* Mobile: segmented control */}
                <div className="ne-segmented" role="group" aria-label="Nivel de dificultad">
                  {DIFFICULTIES.map(d => (
                    <button
                      key={d}
                      type="button"
                      className={`ne-segmented__btn${form.dificultad === d ? ' ne-segmented__btn--active' : ''}`}
                      onClick={() => set('dificultad', d)}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="ne-field">
              <label htmlFor="ne-instrucciones" className="ne-label">
                Instrucciones de Ejecución
                <span className="ne-label-hint">(una por línea)</span>
              </label>
              <textarea
                id="ne-instrucciones"
                className="ne-input ne-textarea"
                placeholder={`Describe los puntos clave para una técnica perfecta…\n\nEj.\nMantén los codos altos y el pecho erguido durante todo el movimiento.\nDesciende hasta que los muslos estén paralelos al suelo.`}
                value={form.instrucciones}
                onChange={e => set('instrucciones', e.target.value)}
                rows={5}
              />
            </div>
          </div>

          {/* Multimedia */}
          <div className="ne-section">
            <div className="ne-section__heading">
              <Video size={16} strokeWidth={1.5} className="ne-section__icon" />
              <h2 className="ne-section__title">Multimedia</h2>
            </div>

            <div className="ne-field">
              <label htmlFor="ne-video" className="ne-label">
                URL de Video (YouTube/Vimeo)
              </label>
              <div className="ne-url-wrap">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="ne-url-icon">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                <input
                  id="ne-video"
                  className="ne-input ne-url-input"
                  type="url"
                  placeholder="https://youtube.com/watch?v=…"
                  value={form.videoUrl}
                  onChange={e => set('videoUrl', e.target.value)}
                />
              </div>
              <p className="ne-hint">
                Proporciona un enlace directo para mostrarlo en la app del cliente.
              </p>
            </div>
          </div>

          {/* Mobile preview (inline) */}
          <div className="ne-mobile-preview">
            <ClientPreview
              exercise={{
                nombre: form.nombre || undefined,
                grupoMuscular: form.grupoMuscular || undefined,
                dificultad: form.dificultad,
                instrucciones: previewInstructions,
                videoUrl: form.videoUrl || undefined,
                duracionEstimada: 45,
                series: 4,
              }}
            />
          </div>

        </div>

        {/* RIGHT COLUMN (desktop only) */}
        <div className="nuevo-ejercicio__right">
          <ClientPreview
            exercise={{
              nombre: form.nombre || undefined,
              grupoMuscular: form.grupoMuscular || undefined,
              dificultad: form.dificultad,
              instrucciones: previewInstructions,
              videoUrl: form.videoUrl || undefined,
              duracionEstimada: 45,
              series: 4,
            }}
          />
        </div>

      </form>

      {/* ── Mobile Save Button ── */}
      <div className="nuevo-ejercicio__mobile-footer">
        <button
          id="btn-guardar-ejercicio-mobile"
          className="btn-primary nuevo-ejercicio__mobile-save"
          form="form-nuevo-ejercicio"
          type="submit"
        >
          Guardar Ejercicio
        </button>
      </div>

    </div>
  )
}
