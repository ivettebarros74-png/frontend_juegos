import axios from 'axios'
import type { Game } from '../types/game.types'

const API_URL = import.meta.env.VITE_API_URL || 'https://backend-juegos.onrender.com/api'

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})

export const gameService = {
    async getAllGames(): Promise<Game[]> {
        const { data } = await api.get('/games')
        return data
    },

    async getGameById(id: number): Promise<Game> {
        const { data } = await api.get(`/games/${id}`)
        return data
    },

    async incrementPlayers(id: number): Promise<Game> {
        const { data } = await api.post(`/games/${id}/play`)
        return data
    }
}