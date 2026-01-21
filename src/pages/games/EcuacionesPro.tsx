import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { statsService } from '../../services/statsService'

export const EcuacionesPro = () => {
  const navigate = useNavigate()
  
  const [a, setA] = useState(0)
  const [b, setB] = useState(0)
  const [c, setC] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(90) // Más tiempo porque es más difícil
  const [gameOver, setGameOver] = useState(false)
  const [level, setLevel] = useState(1)
  const [lives, setLives] = useState(3)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [wrongAnswers, setWrongAnswers] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [showNewAchievements, setShowNewAchievements] = useState<string[]>([])

  // Generar ecuación tipo: ax + b = c, encontrar x
  const generateEquation = () => {
    const x = Math.floor(Math.random() * 10) + 1 // Solución
    const aVal = Math.floor(Math.random() * 5) + 1
    const bVal = Math.floor(Math.random() * 20) - 10
    const cVal = aVal * x + bVal
    
    setA(aVal)
    setB(bVal)
    setC(cVal)
    setUserAnswer('')
    setFeedback(null)
  }

  useEffect(() => {
    if (!gameOver) {
      generateEquation()
    }
  }, [level, gameOver])

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !gameOver) {
      endGame()
    }
  }, [timeLeft, gameOver])

  const checkAnswer = () => {
    // x = (c - b) / a
    const correctAnswer = (c - b) / a
    const answer = parseFloat(userAnswer)

    if (isNaN(answer)) return

    setQuestionsAnswered(prev => prev + 1)

    // Permitir pequeña tolerancia en decimales
    if (Math.abs(answer - correctAnswer) < 0.01) {
      setCorrectAnswers(prev => prev + 1)
      const points = level * 25 // Álgebra vale más puntos
      setScore(prev => prev + points)
      setFeedback('correct')

      if ((questionsAnswered + 1) % 4 === 0) {
        setLevel(prev => prev + 1)
      }

      setTimeout(() => generateEquation(), 500)
    } else {
      setWrongAnswers(prev => prev + 1)
      setLives(prev => prev - 1)
      setFeedback('wrong')

      if (lives - 1 <= 0) {
        endGame()
      } else {
        setTimeout(() => generateEquation(), 500)
      }
    }
  }

  const endGame = async () => {
    setGameOver(true)
    await saveGameStats()
  }

  const saveGameStats = async () => {
    try {
      setIsSaving(true)
      const userId = statsService.getUserId()
      
      const result = await statsService.saveGameSession({
        userId,
        gameId: 5,
        gameName: 'Ecuaciones',
        category: 'Álgebra',
        score,
        timePlayed: 90 - timeLeft,
        level,
        correctAnswers,
        wrongAnswers
      })

      if (result.newAchievements && result.newAchievements.length > 0) {
        setShowNewAchievements(result.newAchievements)
        setTimeout(() => setShowNewAchievements([]), 5000)
      }
    } catch (error) {
      console.error('❌ Error guardando estadísticas:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const restartGame = () => {
    setScore(0)
    setTimeLeft(90)
    setGameOver(false)
    setLevel(1)
    setLives(3)
    setQuestionsAnswered(0)
    setCorrectAnswers(0)
    setWrongAnswers(0)
    setFeedback(null)
    setShowNewAchievements([])
    generateEquation()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !gameOver) {
      checkAnswer()
    }
  }

  const accuracy = questionsAnswered > 0 
    ? Math.round((correctAnswers / questionsAnswered) * 100) 
    : 0

  // Formatear ecuación
  const formatEquation = () => {
    const bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`
    return `${a}x ${bStr} = ${c}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
        
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
            📐 Ecuaciones Experto
          </h1>
          <p className="text-gray-600">¡Resuelve ecuaciones lineales!</p>
        </div>

        {showNewAchievements.length > 0 && (
          <div className="mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl p-4 animate-bounce">
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl">🏆</span>
              <div>
                <p className="font-bold">¡Nuevos Logros Desbloqueados!</p>
                <p className="text-sm">{showNewAchievements.join(', ')}</p>
              </div>
            </div>
          </div>
        )}

        {!gameOver ? (
          <>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-indigo-600">{score}</div>
                <div className="text-xs text-gray-600">Puntos</div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">{timeLeft}s</div>
                <div className="text-xs text-gray-600">Tiempo</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-purple-600">Nv.{level}</div>
                <div className="text-xs text-gray-600">Nivel</div>
              </div>
              
              <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {'❤️'.repeat(lives)}
                </div>
                <div className="text-xs text-gray-600">Vidas</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 mb-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-800 mb-4">
                  {formatEquation()}
                </div>
                <div className="text-2xl text-gray-600 mb-4">
                  Encuentra el valor de <span className="font-bold text-indigo-600">x</span>
                </div>
                
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-bold text-gray-700">x =</span>
                  <input
                    type="number"
                    step="0.01"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={`text-4xl font-bold text-center w-48 px-6 py-4 rounded-xl border-4 focus:outline-none transition ${
                      feedback === 'correct' 
                        ? 'border-green-500 bg-green-50' 
                        : feedback === 'wrong'
                        ? 'border-red-500 bg-red-50'
                        : 'border-indigo-300 focus:border-indigo-500'
                    }`}
                    placeholder="?"
                    autoFocus
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={checkAnswer}
                disabled={!userAnswer}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✓ Verificar
              </button>
              
              <button
                onClick={() => navigate('/juegos')}
                className="bg-gray-300 text-gray-700 font-bold py-4 px-6 rounded-xl hover:bg-gray-400 transition"
              >
                ← Salir
              </button>
            </div>

            <div className="mt-4 text-center text-sm text-gray-600">
              <span className="mr-4">✓ Correctas: {correctAnswers}</span>
              <span className="mr-4">✗ Incorrectas: {wrongAnswers}</span>
              <span>📊 Precisión: {accuracy}%</span>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-4">
              {score >= 500 ? '🏆' : score >= 250 ? '🎉' : '💪'}
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {score >= 500 ? '¡Eres un Genio!' : score >= 250 ? '¡Excelente!' : '¡Sigue practicando!'}
            </h2>
            
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-xl p-4">
                  <div className="text-3xl font-bold text-indigo-600">{score}</div>
                  <div className="text-sm text-gray-600">Puntuación Final</div>
                </div>
                
                <div className="bg-white rounded-xl p-4">
                  <div className="text-3xl font-bold text-purple-600">Nv.{level}</div>
                  <div className="text-sm text-gray-600">Nivel Alcanzado</div>
                </div>
                
                <div className="bg-white rounded-xl p-4">
                  <div className="text-3xl font-bold text-green-600">{correctAnswers}</div>
                  <div className="text-sm text-gray-600">Correctas</div>
                </div>
                
                <div className="bg-white rounded-xl p-4">
                  <div className="text-3xl font-bold text-blue-600">{accuracy}%</div>
                  <div className="text-sm text-gray-600">Precisión</div>
                </div>
              </div>

              {isSaving ? (
                <div className="text-indigo-600 font-semibold animate-pulse">
                  💾 Guardando estadísticas...
                </div>
              ) : (
                <div className="text-green-600 font-semibold">
                  ✅ Estadísticas guardadas
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={restartGame}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition transform hover:scale-105"
              >
                🔄 Jugar de Nuevo
              </button>
              
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition transform hover:scale-105"
              >
                📊 Ver Dashboard
              </button>
              
              <button
                onClick={() => navigate('/juegos')}
                className="bg-gray-300 text-gray-700 font-bold py-4 px-6 rounded-xl hover:bg-gray-400 transition"
              >
                ← Volver
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}