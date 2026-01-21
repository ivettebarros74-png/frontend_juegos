import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { gameService } from '../services/gameService'
import type { Game } from '../types/game.types'

export const Inicio = () => {
  const navigate = useNavigate()
  const [featuredGames, setFeaturedGames] = useState<Game[]>([])

  useEffect(() => {
    loadFeaturedGames()
  }, [])

  const loadFeaturedGames = async () => {
    try {
      const games = await gameService.getAllGames()
      // Mostrar solo los primeros 3 juegos como destacados
      setFeaturedGames(games.slice(0, 3))
    } catch (error) {
      console.error('Error loading games:', error)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
            ¡Aprende Matemáticas Jugando!
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-6">
            Descubre una forma divertida e interactiva de aprender matemáticas.
            Desafía tu mente y conviértete en un maestro de los números.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <button
              onClick={() => navigate('/juegos')}
              className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-blue-50 transition transform hover:scale-105"
            >
              🎮 Explorar Juegos
            </button>
            <button
              onClick={() => navigate('/sobre-nosotros')}
              className="bg-purple-700 text-white font-bold py-3 px-8 rounded-full hover:bg-purple-800 transition transform hover:scale-105"
            >
              📚 Conocer Más
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <div className="text-4xl font-bold mb-2">6</div>
              <div className="text-lg">Juegos Diferentes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <div className="text-4xl font-bold mb-2">∞</div>
              <div className="text-lg">Problemas Únicos</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-lg">Gratis</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            ¿Por qué elegir nuestros juegos?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Aprendizaje Efectivo</h3>
              <p className="text-gray-600">
                Aprende conceptos matemáticos mientras juegas. La práctica constante mejora tus habilidades.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Progresión Dinámica</h3>
              <p className="text-gray-600">
                Los niveles de dificultad se adaptan a tu progreso. Siempre tendrás el desafío perfecto.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Interfaz Atractiva</h3>
              <p className="text-gray-600">
                Diseño colorido y animaciones que hacen que aprender sea divertido y motivador.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Games */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">
            Juegos Destacados
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Comienza tu aventura matemática con nuestros juegos más populares
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {featuredGames.map(game => (
              <div 
                key={game.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition cursor-pointer"
                onClick={() => navigate(`/juego/${game.id}`)}
              >
                <div className={`${game.color} h-32 flex items-center justify-center`}>
                  <span className="text-6xl">{game.icon}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{game.title}</h3>
                  <p className="text-gray-600 mb-4">{game.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      👥 {game.players.toLocaleString()} jugadores
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      game.difficulty === 'Fácil' ? 'bg-green-100 text-green-800' :
                      game.difficulty === 'Medio' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {game.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/juegos')}
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition transform hover:scale-105"
            >
              Ver Todos los Juegos →
            </button>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="py-16 px-4 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            ¿Cómo Funciona?
          </h2>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Elige tu Juego</h3>
                <p className="text-gray-600">
                  Selecciona entre suma, resta, multiplicación, división, ecuaciones o geometría.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Resuelve Problemas</h3>
                <p className="text-gray-600">
                  Responde correctamente y acumula puntos. La dificultad aumenta progresivamente.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-pink-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Mejora tus Habilidades</h3>
                <p className="text-gray-600">
                  Practica constantemente y observa cómo mejoran tus habilidades matemáticas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para el Desafío?
          </h2>
          <p className="text-lg md:text-xl mb-8">
            Únete a miles de estudiantes que ya están mejorando sus habilidades matemáticas
          </p>
          <button
            onClick={() => navigate('/juegos')}
            className="bg-white text-blue-600 font-bold py-4 px-10 rounded-full hover:bg-blue-50 transition transform hover:scale-105 text-lg"
          >
            Comenzar Ahora 🚀
          </button>
        </div>
      </div>
    </div>
  )
}