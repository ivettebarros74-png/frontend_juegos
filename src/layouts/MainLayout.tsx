import { Link } from 'react-router-dom'
import { useState } from 'react'

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold flex items-center gap-2">
              <span className="text-3xl">🎮</span>
              Math Games
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-6">
              <Link to="/" className="hover:bg-white/10 px-4 py-2 rounded-lg transition">
                Inicio
              </Link>
              <Link to="/juegos" className="hover:bg-white/10 px-4 py-2 rounded-lg transition">
                Juegos
              </Link>
              <Link to="/dashboard" className="hover:bg-white/10 px-4 py-2 rounded-lg transition flex items-center gap-2">
                <span>📊</span>
                Mi Progreso
              </Link>
              <Link to="/sobre-nosotros" className="hover:bg-white/10 px-4 py-2 rounded-lg transition">
                Sobre Nosotros
              </Link>
              <Link to="/contacto" className="hover:bg-white/10 px-4 py-2 rounded-lg transition">
                Contacto
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pb-4">
              <Link to="/" className="block py-2 hover:bg-white/10 px-4 rounded-lg">
                Inicio
              </Link>
              <Link to="/juegos" className="block py-2 hover:bg-white/10 px-4 rounded-lg">
                Juegos
              </Link>
              <Link to="/dashboard" className="block py-2 hover:bg-white/10 px-4 rounded-lg">
                📊 Mi Progreso
              </Link>
              <Link to="/sobre-nosotros" className="block py-2 hover:bg-white/10 px-4 rounded-lg">
                Sobre Nosotros
              </Link>
              <Link to="/contacto" className="block py-2 hover:bg-white/10 px-4 rounded-lg">
                Contacto
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2024 Math Games. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}