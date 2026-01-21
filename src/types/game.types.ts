export interface Game {
    id: number
    title: string
    description: string
    icon: string
    color: string
    difficulty: 'Fácil' | 'Medio' | 'Difícil'
    players: number
    category?: string
    isActive?: boolean
    createdAt?: string
    updatedAt?: string
}