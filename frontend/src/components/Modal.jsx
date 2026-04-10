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
        return <Info size={48} className="text-[#00BFFF] mx-auto mb-4" strokeWidth={2.5} />
    }
  }

  const getHeaderColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600'
      case 'error':
        return 'bg-red-600'
      case 'warning':
        return 'bg-yellow-600'
      default:
        return 'bg-[#1E40AF]'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-[#1a2942] to-[#0f1729] rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col animate-scale-in border border-[#1E40AF]">
        {/* Header */}
        <div className={`${getHeaderColor()} text-white p-4 flex items-center justify-between rounded-t-xl flex-shrink-0`}>
          <h3 className="text-lg font-bold">{title || 'Notificación'}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full active:scale-95 transition-all"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 text-center">
          {getIcon()}
          <p className="text-[#F3F4F6] text-base leading-relaxed whitespace-pre-line">{message}</p>
        </div>

        {/* Footer con botones */}
        <div className="flex-shrink-0 p-4 flex gap-3 justify-center border-t border-[#1E40AF]">
          {buttons && buttons.length > 0 ? (
            buttons.map((button, index) => {
              const Icon = button.loading ? Loader2 : button.icon
              return (
                <button
                  key={index}
                  onClick={button.onClick}
                  disabled={button.disabled || button.loading}
                  className={`px-6 py-3 rounded-lg font-semibold text-white transition-all active:scale-95 flex items-center gap-2 ${
                    button.disabled || button.loading
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  } ${
                    button.variant === 'secondary'
                      ? 'bg-gray-600 hover:bg-gray-700'
                      : button.variant === 'danger'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-[#00BFFF] hover:bg-[#1E40AF]'
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
              className="px-8 py-3 bg-[#00BFFF] hover:bg-[#1E40AF] text-white rounded-lg font-semibold transition-all active:scale-95"
            >
              Aceptar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
