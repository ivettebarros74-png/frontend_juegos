import axios from 'axios'

const API_URL = 'http://localhost:3000/api/stats'

export interface GameSessionData {
  userId: string
  gameId: number
  gameName: string
  category: 'Aritmética' | 'Álgebra' | 'Geometría'
  score: number
  timePlayed: number
  level: number
  correctAnswers: number
  wrongAnswers: number
}

export interface Achievement {
  name: string
  icon?: string
  unlockedAt: string
}

export interface DailyProgress {
  date: string
  score: number
  gamesPlayed: number
}

export interface UserStats {
  userId: string
  totalGames: number
  totalScore: number
  averageScore: number
  totalTime: number
  gamesPerCategory: { [key: string]: number }
  scoresPerCategory: { [key: string]: number }
  dailyProgress: DailyProgress[]
  achievements: Achievement[]
  currentStreak: number
  bestStreak: number
  strongAreas: string[]
  weakAreas: string[]
}

export interface GameSession {
  id: number
  gameId: number
  gameName: string
  category: string
  score: number
  timePlayed: number
  level: number
  accuracy: number
  playedAt: string
}

export interface GameHistoryResponse {
  sessions: GameSession[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

class StatsService {
  // Obtener o crear userId
  getUserId(): string {
    let userId = localStorage.getItem('userId')
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('userId', userId)
      console.log('✅ Nuevo userId creado:', userId)
    }
    return userId
  }

  // Obtener estadísticas del usuario
  async getUserStats(userId: string): Promise<UserStats> {
    try {
      const response = await axios.get(`${API_URL}/user/${userId}`)
      console.log('✅ Estadísticas obtenidas:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error)
      throw error
    }
  }

  // Guardar sesión de juego
  async saveGameSession(sessionData: GameSessionData) {
    try {
      const response = await axios.post(`${API_URL}/session`, sessionData)
      console.log('✅ Partida guardada:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error guardando partida:', error)
      throw error
    }
  }

  // Obtener historial de partidas
  async getGameHistory(
    userId: string, 
    limit = 10, 
    page = 1, 
    gameId?: number
  ): Promise<GameHistoryResponse> {
    try {
      const params: any = { limit, page }
      if (gameId) params.gameId = gameId

      const response = await axios.get(`${API_URL}/history/${userId}`, { params })
      console.log('✅ Historial obtenido:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error obteniendo historial:', error)
      throw error
    }
  }

  // Obtener ranking global
  async getLeaderboard(limit = 10, category?: string) {
    try {
      const params: any = { limit }
      if (category) params.category = category

      const response = await axios.get(`${API_URL}/leaderboard`, { params })
      console.log('✅ Ranking obtenido:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error obteniendo ranking:', error)
      throw error
    }
  }

  // Resetear estadísticas (solo para testing)
  async resetUserStats(userId: string) {
    try {
      const response = await axios.delete(`${API_URL}/reset/${userId}`)
      console.log('✅ Estadísticas reseteadas:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error reseteando estadísticas:', error)
      throw error
    }
  }
}

export const statsService = new StatsService()