export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 nav-shell border-b z-50 shadow-lg">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Logo y Texto */}
        <div className="flex items-center space-x-3 animate-scale-in">
          <img 
            src="/logo.jpg" 
            alt="Cronos Team" 
            className="h-10 w-10 md:h-12 md:w-12 object-contain"
            loading="eager"
          />
          <h1 className="racing-sans text-xl md:text-2xl lg:text-3xl font-bold tracking-tighter bg-linear-to-r from-white to-cyan bg-clip-text text-transparent uppercase">
            Cronos Team
          </h1>
        </div>

        {/* Placeholder para menú/perfil (futuro) */}
        <div className="w-10 md:w-12">
          {/* Espacio reservado para botón de perfil/menú */}
        </div>
      </div>
    </header>
  )
}
