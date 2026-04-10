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
          bg-bg-surface text-text 
          flex items-center justify-between
          transition-all duration-200
          ${!disabled && 'hover:border-brandBlue hover:shadow-[0_0_0_1px_var(--color-brandBlue)] cursor-pointer'}
          ${isOpen && !disabled && 'border-brandBlue shadow-[0_0_0_2px_rgb(6_151_216_/_0.1)]'}
          ${disabled && 'opacity-50 cursor-not-allowed'}
        `}
      >
        <span className={`${!selectedOption && 'text-text-muted'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          size={20} 
          className={`
            transition-transform duration-200 
            ${isOpen ? 'rotate-180' : 'rotate-0'}
            ${disabled ? 'text-text-muted' : 'text-brandBlue'}
          `}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && !disabled && (
        <div 
          className="
            absolute z-[9999] w-full mt-2 
            bg-bg-surface 
            border-2 border-brandBlue 
            rounded-lg 
            shadow-[0_6px_18px_rgb(15_23_42_/_0.12)]
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
                text-left text-text
                transition-all duration-150
                ${index !== options.length - 1 && 'border-b border-border-accent'}
                ${value === option.value 
                  ? 'bg-bg text-brandBlue font-semibold' 
                  : 'hover:bg-bg hover:text-brandBlue'
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
