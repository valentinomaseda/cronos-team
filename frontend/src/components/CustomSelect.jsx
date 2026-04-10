import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

/**
 * Select personalizado con estética racing/neón
 * Reemplaza el select nativo con control total sobre opciones
 */
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
          border-2 border-[#1E40AF] rounded-lg 
          bg-[#0f1729] text-[#F3F4F6] 
          flex items-center justify-between
          transition-all duration-200
          ${!disabled && 'hover:border-[#00BFFF] hover:shadow-[0_0_0_1px_#00BFFF] cursor-pointer'}
          ${isOpen && !disabled && 'border-[#00BFFF] shadow-[0_0_0_2px_rgba(0,191,255,0.1),0_0_20px_rgba(0,191,255,0.3)]'}
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
            ${disabled ? 'text-gray-400' : 'text-[#00BFFF]'}
          `}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && !disabled && (
        <div 
          className="
            absolute z-[9999] w-full mt-2 
            bg-[#0f1729] 
            border-2 border-[#00BFFF] 
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
                text-left text-[#F3F4F6]
                transition-all duration-150
                ${index !== options.length - 1 && 'border-b border-[#1E40AF]'}
                ${value === option.value 
                  ? 'bg-[#1E40AF] text-[#00BFFF] font-semibold' 
                  : 'hover:bg-[#1a2942] hover:text-[#00BFFF]'
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
