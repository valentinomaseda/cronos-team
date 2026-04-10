import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

const CustomSelect = ({ 
  value, 
  onChange, 
  options = [], 
  placeholder = 'Selecciona una opción',
  className = '',
  disabled = false,
  name = '',
  id = '',
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const selectRef = useRef(null)

  // Encontrar la opción seleccionada
  useEffect(() => {
    const option = options.find(opt => opt.value === value)
    setSelectedOption(option || null)
  }, [value, options])

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (option) => {
    if (disabled) return
    
    // Simular evento de cambio nativo
    const event = {
      target: {
        name,
        value: option.value,
        id
      }
    }
    
    onChange(event)
    setIsOpen(false)
  }

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div 
      ref={selectRef} 
      className={`relative ${className}`}
    >
      {/* Select button */}
      <button
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        className={`
          w-full px-4 py-3 
          border-2 border-border-accent rounded-lg 
          bg-surface-deep text-text-on-dark 
          flex items-center justify-between
          transition-all duration-200
          ${!disabled && 'hover:border-cyan hover:shadow-[0_0_0_1px_#0697d8] cursor-pointer'}
          ${isOpen && !disabled && 'border-cyan shadow-[0_0_0_2px_rgba(0,191,255,0.1),0_0_20px_rgba(0,191,255,0.3)]'}
          ${disabled && 'opacity-50 cursor-not-allowed'}
        `}
      >
        <span className={`${!selectedOption && 'text-gray-400'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          size={20} 
          className={`
            transition-transform duration-200 
            ${isOpen ? 'rotate-180' : 'rotate-0'}
            ${disabled ? 'text-gray-400' : 'text-cyan'}
          `}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && !disabled && (
        <div 
          className="
            absolute z-[9999] w-full mt-2 
            bg-surface-deep 
            border-2 border-cyan 
            rounded-lg 
            shadow-[0_0_30px_rgba(0,191,255,0.4)]
            max-h-60 overflow-y-auto
            animate-slide-in-up
          "
        >
          {options.map((option, index) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option)}
              className={`
                w-full px-4 py-3 
                text-left text-text-on-dark
                transition-all duration-150
                ${index !== options.length - 1 && 'border-b border-border-accent'}
                ${value === option.value 
                  ? 'bg-cyanDeep text-cyan font-semibold' 
                  : 'hover:bg-surface-dark hover:text-cyan'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {/* Hidden input para compatibilidad con formularios */}
      <input 
        type="hidden" 
        name={name}
        id={id}
        value={value}
        required={required}
      />
    </div>
  )
}

export default CustomSelect
