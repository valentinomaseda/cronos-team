import { X, AlertCircle, CheckCircle2, Info, AlertTriangle, Loader2 } from 'lucide-react'

export default function Modal({ isOpen, onClose, title, message, type = 'info', buttons }) {
  if (!isOpen) return null

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" strokeWidth={2.5} />
      case 'error':
        return <AlertCircle size={48} className="text-red-500 mx-auto mb-4" strokeWidth={2.5} />
      case 'warning':
        return <AlertTriangle size={48} className="text-yellow-500 mx-auto mb-4" strokeWidth={2.5} />
      default:
        return <Info size={48} className="text-brandBlue mx-auto mb-4" strokeWidth={2.5} />
    }
  }

  const getHeaderColor = () => {
    switch (type) {
      case 'success':
        return 'bg-success'
      case 'error':
        return 'bg-primary'
      case 'warning':
        return 'bg-primary text-white'
      default:
        return 'bg-bg'
    }
  }

  return (
    <div className="modal-shell animate-fade-in">
      <div className="modal-panel animate-scale-in">
        {/* Header */}
        <div className={`${getHeaderColor()} p-4 flex items-center justify-between rounded-t-xl flex-shrink-0`}>
          <h3 className="text-lg font-bold">{title || 'Notificación'}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-bg rounded-full active:scale-95 transition-all"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 text-center">
          {getIcon()}
          <p className="text-text text-base leading-relaxed whitespace-pre-line">{message}</p>
        </div>

        {/* Footer con botones */}
        <div className="flex-shrink-0 p-4 flex gap-3 justify-center border-t border-border-accent">
          {buttons && buttons.length > 0 ? (
            buttons.map((button, index) => {
              const Icon = button.loading ? Loader2 : button.icon
              return (
                <button
                  key={index}
                  onClick={button.onClick}
                  disabled={button.disabled || button.loading}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all active:scale-95 flex items-center gap-2 ${
                    button.disabled || button.loading
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  } ${
                    button.variant === 'secondary'
                      ? 'btn-secondary'
                      : button.variant === 'danger'
                      ? 'btn-danger'
                      : 'btn-primary'
                  }`}
                >
                  {Icon && <Icon size={20} className={button.loading ? 'animate-spin' : ''} />}
                  {button.label}
                </button>
              )
            })
          ) : (
            <button
              onClick={onClose}
              className="px-8 py-3 btn-primary"
            >
              Aceptar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
