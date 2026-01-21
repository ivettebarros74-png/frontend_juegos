import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { gameService } from '../services/gameService'
import type { Game } from '../types/game.types'

export const Games = () => {
    const navigate = useNavigate()
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Todos')
    const [searchTerm, setSearchTerm] = useState('')
    const [games, setGames] = useState<Game[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Mapeo de colores
    const getColorClass = (colorName: string) => {
        const colorMap: { [key: string]: string } = {
            '#FF6B6B': 'bg-red-500',
            '#4ECDC4': 'bg-cyan-500',
            '#95E1D3': 'bg-teal-300',
            '#F38181': 'bg-red-400',
            '#AA96DA': 'bg-purple-400',
            '#FCBAD3': 'bg-pink-300',
            'red': 'bg-red-500',
            'blue': 'bg-blue-500',
            'green': 'bg-green-500',
            'yellow': 'bg-yellow-500',
            'purple': 'bg-purple-500',
            'pink': 'bg-pink-500',
            'orange': 'bg-orange-500',
            'cyan': 'bg-cyan-500',
            'teal': 'bg-teal-500'
        }
        return colorMap[colorName] || 'bg-blue-500'
    }

    useEffect(() => {
        fetchGames()
    }, [])

    const fetchGames = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await gameService.getAllGames()

            console.log('Fetched games with colors:')
            data.forEach((game: Game) => {
                console.log(`- ${game.title}: ${game.color}`)
            })
            setGames(data)
        } catch (err) {
            setError('Error al cargar los juegos. Intenta nuevamente.')
            console.error('Error fetching games:', err)
        } finally {
            setLoading(false)
        }
    }

    const handlePlayGame = async (gameId: number) => {
        try {
            await gameService.incrementPlayers(gameId)
            navigate(`/juego/${gameId}`)
        } catch (err) {
            console.error('Error incrementing players:', err)
            navigate(`/juego/${gameId}`)
        }
    }

    const difficulties = ['Todos', 'Fácil', 'Medio', 'Difícil']

    const filteredGames = games.filter(game => {
        const matchesDifficulty = selectedDifficulty === 'Todos' || game.difficulty === selectedDifficulty
        const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            game.description.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesDifficulty && matchesSearch
    })

    const getDifficultyColor = (difficulty: string) => {
        switch(difficulty) {
            case 'Fácil': return 'bg-green-500 text-white'
            case 'Medio': return 'bg-yellow-500 text-white'
            case 'Difícil': return 'bg-red-500 text-white'
            default: return 'bg-gray-500 text-white'
        }
    }

    if (loading) {
        return (
            <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
                <div className='text-center'>
                    <div className='text-6xl mb-4 animate-bounce'>⏳</div>
                    <p className='text-gray-700 text-xl font-semibold'>Cargando juegos...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
                <div className='text-center bg-white p-8 rounded-lg shadow-xl border border-gray-200'>
                    <div className='text-6xl mb-4'>❌</div>
                    <h2 className='text-2xl font-bold text-gray-800 mb-2'>Oops!</h2>
                    <p className='text-gray-600 mb-4'>{error}</p>
                    <button 
                        onClick={fetchGames}
                        className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md'>
                        Reintentar
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            {/* Header con gradiente */}
            <div className='bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4 mb-8 shadow-lg'>
                <div className='container mx-auto max-w-7xl text-center'>
                    <h1 className='text-5xl font-extrabold mb-4'>🎮 Juegos de Matemáticas</h1>
                    <p className='text-xl max-w-2xl mx-auto opacity-90'>
                        ¡Elige tu juego favorito y comienza a aprender mientras te diviertes!
                    </p>
                </div>
            </div>

            <div className='container mx-auto max-w-7xl px-4 pb-12'>
                {/* Search and Filters */}
                <div className='mb-8 space-y-4'>
                    <div className='max-w-md mx-auto'>
                        <input
                            type="text"
                            placeholder="🔍 Buscar juegos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='w-full px-4 py-3 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                    </div>

                    <div className='flex flex-wrap justify-center gap-3'>
                        {difficulties.map(difficulty => (
                            <button
                                key={difficulty}
                                onClick={() => setSelectedDifficulty(difficulty)}
                                className={`px-6 py-2 rounded-lg font-semibold transition shadow-md ${
                                    selectedDifficulty === difficulty
                                        ? 'bg-blue-600 text-white shadow-lg scale-105'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                }`}
                            >
                                {difficulty}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Counter */}
                <div className='text-center mb-6'>
                    <p className='text-gray-600 text-lg font-semibold'>
                        📊 Mostrando <span className='text-blue-600 font-bold'>{filteredGames.length}</span> de {games.length} juegos
                    </p>
                </div>

                {/* Games Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredGames.map(game => (
                        <div 
                            key={game.id}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl flex flex-col border border-gray-200"
                        >
                            {/* Icon Header */}
                            <div className={`${getColorClass(game.color)} h-40 flex items-center justify-center relative`}>
                                <span className="text-7xl drop-shadow-lg">{game.icon}</span>
                                <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${getDifficultyColor(game.difficulty)}`}>
                                    {game.difficulty}
                                </div>
                            </div>

                            {/* Content */}
                            <div className='p-6 flex flex-col flex-grow'>
                                <h3 className='text-2xl font-bold text-gray-800 mb-3'>{game.title}</h3>
                                <p className='text-gray-600 mb-4 flex-grow leading-relaxed'>{game.description}</p>
                                
                                {/* Stats */}
                                <div className='flex items-center justify-between mb-4 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg'>
                                    <div className='flex items-center'>
                                        <span className='mr-2 text-lg'>👥</span>
                                        <span className='font-semibold'>{game.players} jugadores</span>
                                    </div>
                                    {game.category && (
                                        <span className='bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold'>
                                            {game.category}
                                        </span>
                                    )}
                                </div>

                                {/* Play Button */}
                                <button 
                                    onClick={() => handlePlayGame(game.id)}
                                    className={`w-full ${getColorClass(game.color)} text-white font-bold py-3 rounded-lg hover:opacity-90 transition-all shadow-md hover:shadow-lg`}
                                >
                                    🎯 Jugar Ahora
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No Results */}
                {filteredGames.length === 0 && (
                    <div className='text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200'>
                        <div className='text-7xl mb-4'>🔍</div>
                        <h3 className='text-2xl font-bold text-gray-800 mb-2'>No se encontraron juegos</h3>
                        <p className='text-gray-600'>Intenta con otros términos de búsqueda o filtros</p>
                    </div>
                )}
            </div>
        </div>
    )
}