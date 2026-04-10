import { Menu } from 'lucide-react'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-bg-surface border-b border-border z-50 shadow-sm transition-colors duration-200">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        
        {/* Identidad de Marca */}
        <div className="flex items-center space-x-3">
          {/* Contenedor del logo para darle un marco pulcro */}
          <div className="h-10 w-10 md:h-11 md:w-11 bg-white rounded-full border border-border shadow-sm flex items-center justify-center p-1 shrink-0">
            <img 
              src="/logo.jpg" 
              alt="Cronos Team Logo" 
              className="h-full w-full object-contain rounded-full"
              loading="eager"
            />
          </div>
          <h1 className="font-display text-xl md:text-2xl text-text uppercase tracking-wide">
            Cronos Team
          </h1>
        </div>

      </div>
    </header>
  )
}