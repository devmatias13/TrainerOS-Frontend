import { useEffect, useRef, type ReactNode } from 'react'
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react'
import './ConfirmModal.css'

export interface ConfirmModalProps {
  isOpen: boolean
  title: string
  description: ReactNode
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'primary'
  isLoading?: boolean
  onConfirm: () => void
  onClose: () => void
}

export default function ConfirmModal({
  isOpen,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isLoading, onClose])

  if (!isOpen) return null

  return (
    <div
      className="confirm-modal-overlay"
      role="dialog"
      aria-modal="true"
      onClick={e => {
        if (!isLoading && e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="confirm-modal" ref={modalRef}>
        <div className="confirm-modal__header">
          <div className={`confirm-modal__icon confirm-modal__icon--${variant}`}>
            {variant === 'danger' ? (
              <Trash2 size={20} strokeWidth={2} />
            ) : (
              <AlertTriangle size={20} strokeWidth={2} />
            )}
          </div>
          <div className="confirm-modal__titles">
            <h3 className="confirm-modal__title">{title}</h3>
          </div>
          <button
            type="button"
            className="confirm-modal__close"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Cerrar modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="confirm-modal__body">
          {typeof description === 'string' ? (
            <p className="confirm-modal__description">{description}</p>
          ) : (
            description
          )}
        </div>

        <div className="confirm-modal__footer">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`confirm-modal__btn-confirm confirm-modal__btn-confirm--${variant}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading && <Loader2 size={16} className="confirm-modal__spinner" />}
            <span>{isLoading ? 'Procesando...' : confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
