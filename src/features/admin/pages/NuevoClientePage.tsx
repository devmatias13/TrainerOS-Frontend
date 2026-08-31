import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, CreditCard, Activity, Flag } from 'lucide-react'
import { useCreateClient } from '../hooks/useClients'
import './NuevoClientePage.css'

interface FormState {
  nombre: string
  email: string
  telefono: string
  fechaNacimiento: string
  tipoPlan: string
  fechaInicio: string
  estadoPago: 'pagado' | 'pendiente'
  peso: string
  altura: string
  grasaCorporal: string
  experiencia: string
  objetivo: string
  historialMedico: string
  consideraciones: string
}

const INITIAL: FormState = {
  nombre: '', email: '', telefono: '', fechaNacimiento: '',
  tipoPlan: 'basico', fechaInicio: '', estadoPago: 'pagado',
  peso: '', altura: '', grasaCorporal: '', experiencia: 'principiante',
  objetivo: '', historialMedico: '', consideraciones: '',
}

export default function NuevoClientePage() {
  const navigate = useNavigate()
  const createClient = useCreateClient()
  const [form, setForm] = useState<FormState>(INITIAL)

  const set = (key: keyof FormState, val: string) =>
    setForm(prev => ({ ...prev, [key]: val }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await createClient.mutateAsync({
        nombre: form.nombre.split(' ')[0] || form.nombre,
        apellido: form.nombre.split(' ').slice(1).join(' ') || '',
        email: form.email,
        telefono: form.telefono || null,
        fecha_nacimiento: form.fechaNacimiento || null,
        plan_tier: form.tipoPlan as any,
        fecha_inicio: form.fechaInicio || new Date().toISOString().split('T')[0],
        estado_pago: form.estadoPago,
        peso_inicial: form.peso ? parseFloat(form.peso) : null,
        altura: form.altura ? parseFloat(form.altura) : null,
        grasa_corporal: form.grasaCorporal ? parseFloat(form.grasaCorporal) : null,
        experiencia: form.experiencia as any,
        objetivo: form.objetivo || null,
        historial_medico: form.historialMedico || null,
        consideraciones: form.consideraciones || null,
        trainer_id: '00000000-0000-0000-0000-000000000001', // TODO: replace with auth user id
      })
      navigate('/admin/clientes')
    } catch (err) {
      console.error('Error creating client:', err)
    }
  }

  return (
    <div className="nuevo-cliente-page">
      {/* Header */}
      <div className="page-header page-header--border">
        <h1 className="page-header__title">Añadir Nuevo Cliente</h1>
      </div>

      <form className="nuevo-cliente-form" onSubmit={handleSubmit}>

        {/* ── Información Personal ── */}
        <div className="form-section">
          <div className="form-section__heading">
            <User size={18} strokeWidth={1.5} className="form-section__icon" />
            <h2 className="form-section__title">Información Personal</h2>
          </div>
          <div className="form-grid form-grid--2">
            <div className="form-field">
              <label className="form-label">Nombre Completo</label>
              <input
                id="nombre"
                className="form-input"
                type="text"
                placeholder="Ej. Juan Pérez"
                value={form.nombre}
                onChange={e => set('nombre', e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label className="form-label">Correo Electrónico</label>
              <input
                id="email"
                className="form-input"
                type="email"
                placeholder="juan@ejemplo.com"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label className="form-label">Teléfono</label>
              <input
                id="telefono"
                className="form-input"
                type="tel"
                placeholder="+34 600 000 000"
                value={form.telefono}
                onChange={e => set('telefono', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="form-label">Fecha de Nacimiento</label>
              <input
                id="fechaNacimiento"
                className="form-input"
                type="date"
                value={form.fechaNacimiento}
                onChange={e => set('fechaNacimiento', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ── Suscripción ── */}
        <div className="form-section">
          <div className="form-section__heading">
            <CreditCard size={18} strokeWidth={1.5} className="form-section__icon" />
            <h2 className="form-section__title">Suscripción</h2>
          </div>
          <div className="form-grid form-grid--1">
            <div className="form-field">
              <label className="form-label">Tipo de Plan</label>
              <select
                id="tipoPlan"
                className="form-input"
                value={form.tipoPlan}
                onChange={e => set('tipoPlan', e.target.value)}
              >
                <option value="basico">Básico (1 vez/semana)</option>
                <option value="estandar">Estándar (3 veces/semana)</option>
                <option value="premium">Premium (5 veces/semana)</option>
                <option value="personalizado">Personalizado</option>
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">Fecha de Inicio</label>
              <input
                id="fechaInicio"
                className="form-input"
                type="date"
                value={form.fechaInicio}
                onChange={e => set('fechaInicio', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="form-label">Estado de Pago</label>
              <div className="radio-group">
                {(['pagado', 'pendiente'] as const).map(v => (
                  <label key={v} className="radio-label">
                    <input
                      type="radio"
                      name="estadoPago"
                      value={v}
                      checked={form.estadoPago === v}
                      onChange={() => set('estadoPago', v)}
                    />
                    <span className="radio-custom" />
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom two-col sections */}
        <div className="form-two-col">

          {/* ── Perfil Físico ── */}
          <div className="form-section">
            <div className="form-section__heading">
              <Activity size={18} strokeWidth={1.5} className="form-section__icon" />
              <h2 className="form-section__title">Perfil Físico</h2>
            </div>
            <div className="form-grid form-grid--2">
              <div className="form-field">
                <label className="form-label">Peso (kg)</label>
                <input
                  id="peso"
                  className="form-input"
                  type="number"
                  placeholder="75"
                  value={form.peso}
                  onChange={e => set('peso', e.target.value)}
                />
              </div>
              <div className="form-field">
                <label className="form-label">Altura (cm)</label>
                <input
                  id="altura"
                  className="form-input"
                  type="number"
                  placeholder="175"
                  value={form.altura}
                  onChange={e => set('altura', e.target.value)}
                />
              </div>
              <div className="form-field">
                <label className="form-label">% Grasa Corporal</label>
                <input
                  id="grasa"
                  className="form-input"
                  type="number"
                  placeholder="15"
                  value={form.grasaCorporal}
                  onChange={e => set('grasaCorporal', e.target.value)}
                />
              </div>
              <div className="form-field">
                <label className="form-label">Exp. de Entrenamiento</label>
                <select
                  id="experiencia"
                  className="form-input"
                  value={form.experiencia}
                  onChange={e => set('experiencia', e.target.value)}
                >
                  <option value="principiante">Principiante</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── Objetivos y Notas ── */}
          <div className="form-section">
            <div className="form-section__heading">
              <Flag size={18} strokeWidth={1.5} className="form-section__icon" />
              <h2 className="form-section__title">Objetivos y Notas</h2>
            </div>
            <div className="form-grid form-grid--1">
              <div className="form-field">
                <label className="form-label">Objetivo Principal</label>
                <input
                  id="objetivo"
                  className="form-input"
                  type="text"
                  placeholder="Ej. Hipertrofia, Pérdida de peso"
                  value={form.objetivo}
                  onChange={e => set('objetivo', e.target.value)}
                />
              </div>
              <div className="form-field">
                <label className="form-label">Historial Médico / Lesiones</label>
                <textarea
                  id="historialMedico"
                  className="form-input form-textarea"
                  placeholder="Alergias, cirugías previas, molestias crónicas..."
                  value={form.historialMedico}
                  onChange={e => set('historialMedico', e.target.value)}
                  rows={3}
                />
              </div>
              <div className="form-field">
                <label className="form-label">Consideraciones Especiales</label>
                <textarea
                  id="consideraciones"
                  className="form-input form-textarea"
                  placeholder="Disponibilidad, preferencias de material..."
                  value={form.consideraciones}
                  onChange={e => set('consideraciones', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="form-footer">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/admin/clientes')}
          >
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={createClient.isPending}>
            {createClient.isPending ? 'Guardando...' : 'Guardar Cliente'}
          </button>
        </div>

      </form>
    </div>
  )
}
