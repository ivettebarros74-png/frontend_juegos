import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Line, Bar, Radar } from 'react-chartjs-2'
import { statsService, type UserStats } from '../services/statsService'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
)

export const Dashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string>('')

  useEffect(() => {
    loadUserStats()
  }, [])

  const loadUserStats = async () => {
    try {
      setLoading(true)
      const id = statsService.getUserId()
      setUserId(id)
      const data = await statsService.getUserStats(id)
      setStats(data)
      setError(null)
    } catch (err: any) {
      console.error('Error loading stats:', err)
      setError(err.response?.data?.error || 'Error al cargar estadísticas')
    } finally {
      setLoading(false)
    }
  }

  const handleResetStats = async () => {
    if (!window.confirm('¿Estás seguro de que quieres resetear todas tus estadísticas?')) {
      return
    }

    try {
      await statsService.resetUserStats(userId)
      await loadUserStats()
      alert('Estadísticas reseteadas correctamente')
    } catch (err) {
      console.error('Error resetting stats:', err)
      alert('Error al resetear estadísticas')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📊</div>
          <p className="text-xl font-bold text-gray-700">Cargando estadísticas...</p>
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-xl font-bold text-red-600 mb-4">{error || 'Error al cargar datos'}</p>
          <button
            onClick={loadUserStats}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-bold"
          >
            🔄 Reintentar
          </button>
        </div>
      </div>
    )
  }

  // Si no hay datos, mostrar mensaje de bienvenida
  if (stats.totalGames === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl text-center">
          <div className="text-6xl mb-4">🎮</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            ¡Bienvenido a tu Dashboard!
          </h1>
          <p className="text-gray-600 mb-6">
            Aún no has jugado ninguna partida. Comienza a jugar para ver tus estadísticas,
            progreso y desbloquear logros increíbles.
          </p>
          <button
            onClick={() => navigate('/juegos')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:from-blue-700 hover:to-purple-700 transition transform hover:scale-105"
          >
            🚀 Comenzar a Jugar
          </button>
        </div>
      </div>
    )
  }

  // Preparar datos para gráficas
  const progressChartData = {
    labels: stats.dailyProgress.slice(-7).map(d => {
      const date = new Date(d.date)
      return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
    }),
    datasets: [
      {
        label: 'Puntuación Diaria',
        data: stats.dailyProgress.slice(-7).map(d => d.score),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  const categoryChartData = {
    labels: Object.keys(stats.scoresPerCategory),
    datasets: [
      {
        label: 'Puntos por Juego',
        data: Object.values(stats.scoresPerCategory),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(236, 72, 153, 0.8)'
        ]
      }
    ]
  }

  const skillsChartData = {
    labels: Object.keys(stats.scoresPerCategory),
    datasets: [
      {
        label: 'Nivel de Habilidad',
        data: Object.values(stats.scoresPerCategory).map(score => Math.min((score / 50), 100)),
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(59, 130, 246)'
      }
    ]
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Mi Dashboard</h1>
              <p className="text-lg opacity-90">Analiza tu progreso y mejora tus habilidades matemáticas</p>
              <p className="text-sm opacity-75 mt-2">Usuario ID: {userId}</p>
            </div>
            <button
              onClick={handleResetStats}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition"
              title="Resetear estadísticas (solo testing)"
            >
              🔄 Reset
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-semibold">Partidas Jugadas</span>
              <span className="text-3xl">🎮</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">{stats.totalGames}</div>
            <div className="text-sm text-gray-500 mt-1">Promedio: {stats.averageScore} pts</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-semibold">Puntos Totales</span>
              <span className="text-3xl">⭐</span>
            </div>
            <div className="text-3xl font-bold text-purple-600">
              {stats.totalScore.toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-semibold">Racha Actual</span>
              <span className="text-3xl">🔥</span>
            </div>
            <div className="text-3xl font-bold text-orange-600">{stats.currentStreak} días</div>
            <div className="text-sm text-gray-500 mt-1">Mejor: {stats.bestStreak} días</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-semibold">Tiempo Jugado</span>
              <span className="text-3xl">⏱️</span>
            </div>
            <div className="text-3xl font-bold text-green-600">{formatTime(stats.totalTime)}</div>
          </div>
        </div>

        {/* Gráficas */}
        {stats.dailyProgress.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Progreso Últimos 7 Días</h2>
              <Line data={progressChartData} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Puntos por Juego</h2>
              <Bar data={categoryChartData} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>
          </div>
        )}

        {/* Radar */}
        {Object.keys(stats.scoresPerCategory).length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Análisis de Habilidades</h2>
            <div className="max-w-2xl mx-auto">
              <Radar data={skillsChartData} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>
          </div>
        )}

        {/* Categorías por juegos */}
        {Object.keys(stats.gamesPerCategory).length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Partidas por Categoría</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(stats.gamesPerCategory).map(([category, count]) => (
                <div key={category} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">{count}</div>
                  <div className="text-gray-700 font-semibold">{category}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Áreas Fuertes y Débiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
              <span className="text-3xl mr-3">💪</span>
              Áreas Fuertes
            </h2>
            <div className="space-y-2">
              {stats.strongAreas.length > 0 ? (
                stats.strongAreas.map((area, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-3 flex items-center justify-between">
                    <span className="font-semibold text-gray-700">{area}</span>
                    <span className="text-green-600 text-xl">✓</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">Juega más partidas para ver tus áreas fuertes</p>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
              <span className="text-3xl mr-3">📈</span>
              Áreas a Mejorar
            </h2>
            <div className="space-y-2">
              {stats.weakAreas.length > 0 ? (
                stats.weakAreas.map((area, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-3 flex items-center justify-between">
                    <span className="font-semibold text-gray-700">{area}</span>
                    <button
                      onClick={() => navigate('/juegos')}
                      className="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-orange-600 transition"
                    >
                      Practicar
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">Juega más partidas para identificar áreas de mejora</p>
              )}
            </div>
          </div>
        </div>

        {/* Logros */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
            <span className="text-3xl mr-3">🏆</span>
            Logros Desbloqueados ({stats.achievements.length})
          </h2>
          {stats.achievements.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {stats.achievements.map((achievement, idx) => (
                <div key={idx} className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-4 text-center transform hover:scale-105 transition">
                  <div className="text-4xl mb-2">{achievement.icon || '🏅'}</div>
                  <div className="text-sm font-semibold text-gray-700">{achievement.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(achievement.unlockedAt).toLocaleDateString('es-ES')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">¡Comienza a jugar para desbloquear logros! 🎮</p>
              <button
                onClick={() => navigate('/juegos')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-bold"
              >
                Ir a Juegos
              </button>
            </div>
          )}
        </div>

        {/* Botón volver */}
        <div className="text-center">
          <button
            onClick={() => navigate('/juegos')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:from-blue-700 hover:to-purple-700 transition transform hover:scale-105"
          >
            🎮 Volver a Juegos
          </button>
        </div>
      </div>
    </div>
  )
}