import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { statsService } from '../../services/statsService'

export const SumaRapida = () => {
  const navigate = useNavigate()
  
  // Estados del juego
  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameOver, setGameOver] = useState(false)
  const [level, setLevel] = useState(1)
  const [lives, setLives] = useState(3)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [wrongAnswers, setWrongAnswers] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [showNewAchievements, setShowNewAchievements] = useState<string[]>([])

  // Generar números aleatorios según el nivel
  const generateNumbers = () => {
    const maxNumber = level * 10
    const n1 = Math.floor(Math.random() * maxNumber) + 1
    const n2 = Math.floor(Math.random() * maxNumber) + 1
    setNum1(n1)
    setNum2(n2)
    setUserAnswer('')
    setFeedback(null)
  }

  // Iniciar juego
  useEffect(() => {
    if (!gameOver) {
      generateNumbers()
    }
  }, [level, gameOver])

  // Timer
  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !gameOver) {
      endGame()
    }
  }, [timeLeft, gameOver])

  // Verificar respuesta
  const checkAnswer = () => {
    const correctAnswer = num1 + num2
    const answer = parseInt(userAnswer)

    if (isNaN(answer)) {
      return
    }

    setQuestionsAnswered(prev => prev + 1)

    if (answer === correctAnswer) {
      // Respuesta correcta
      setCorrectAnswers(prev => prev + 1)
      const points = level * 10
      setScore(prev => prev + points)
      setFeedback('correct')

      // Subir de nivel cada 5 respuestas correctas
      if ((questionsAnswered + 1) % 5 === 0) {
        setLevel(prev => prev + 1)
      }

      setTimeout(() => {
        generateNumbers()
      }, 500)
    } else {
      // Respuesta incorrecta
      setWrongAnswers(prev => prev + 1)
      setLives(prev => prev - 1)
      setFeedback('wrong')

      if (lives - 1 <= 0) {
        endGame()
      } else {
        setTimeout(() => {
          generateNumbers()
        }, 500)
      }
    }
  }

  // Finalizar juego y guardar estadísticas
  const endGame = async () => {
    setGameOver(true)
    await saveGameStats()
  }

  // Guardar estadísticas en el backend
  const saveGameStats = async () => {
    try {
      setIsSaving(true)
      const userId = statsService.getUserId()
      
      const result = await statsService.saveGameSession({
        userId,
        gameId: 1,
        gameName: 'Suma',
        category: 'Aritmética',
        score,
        timePlayed: 60 - timeLeft,
        level,
        correctAnswers,
        wrongAnswers
      })

      console.log('✅ Partida guardada exitosamente:', result)

      // Mostrar nuevos logros si los hay
      if (result.newAchievements && result.newAchievements.length > 0) {
        setShowNewAchievements(result.newAchievements)
        setTimeout(() => {
          setShowNewAchievements([])
        }, 5000)
      }

    } catch (error) {
      console.error('❌ Error guardando estadísticas:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // Reiniciar juego
  const restartGame = () => {
    setScore(0)
    setTimeLeft(60)
    setGameOver(false)
    setLevel(1)
    setLives(3)
    setQuestionsAnswered(0)
    setCorrectAnswers(0)
    setWrongAnswers(0)
    setFeedback(null)
    setShowNewAchievements([])
    generateNumbers()
  }

  // Manejar Enter para enviar respuesta
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !gameOver) {
      checkAnswer()
    }
  }

  // Calcular precisión
  const accuracy = questionsAnswered > 0 
    ? Math.round((correctAnswers / questionsAnswered) * 100) 
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
            ➕ Suma Rápida
          </h1>
          <p className="text-gray-600">¡Resuelve las sumas lo más rápido posible!</p>
        </div>

        {/* Notificación de nuevos logros */}
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
            {/* Stats Bar */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">{score}</div>
                <div className="text-xs text-gray-600">Puntos</div>
              </div>
              
              <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-green-600">{timeLeft}s</div>
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

            {/* Pregunta */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 mb-6">
              <div className="text-center">
                <div className="text-6xl font-bold text-gray-800 mb-4">
                  {num1} + {num2} = ?
                </div>
                
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className={`text-4xl font-bold text-center w-full max-w-xs px-6 py-4 rounded-xl border-4 focus:outline-none transition ${
                    feedback === 'correct' 
                      ? 'border-green-500 bg-green-50' 
                      : feedback === 'wrong'
                      ? 'border-red-500 bg-red-50'
                      : 'border-blue-300 focus:border-blue-500'
                  }`}
                  placeholder="?"
                  autoFocus
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4">
              <button
                onClick={checkAnswer}
                disabled={!userAnswer}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
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

            {/* Estadísticas en tiempo real */}
            <div className="mt-4 text-center text-sm text-gray-600">
              <span className="mr-4">✓ Correctas: {correctAnswers}</span>
              <span className="mr-4">✗ Incorrectas: {wrongAnswers}</span>
              <span>📊 Precisión: {accuracy}%</span>
            </div>
          </>
        ) : (
          /* Pantalla de Game Over */
          <div className="text-center">
            <div className="text-6xl mb-4">
              {score >= 200 ? '🏆' : score >= 100 ? '🎉' : '💪'}
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {score >= 200 ? '¡Increíble!' : score >= 100 ? '¡Buen trabajo!' : '¡Sigue practicando!'}
            </h2>
            
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-xl p-4">
                  <div className="text-3xl font-bold text-blue-600">{score}</div>
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
                  <div className="text-3xl font-bold text-orange-600">{accuracy}%</div>
                  <div className="text-sm text-gray-600">Precisión</div>
                </div>
              </div>

              {isSaving && (
                <div className="text-blue-600 font-semibold animate-pulse">
                  💾 Guardando estadísticas...
                </div>
              )}
              
              {!isSaving && (
                <div className="text-green-600 font-semibold">
                  ✅ Estadísticas guardadas
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={restartGame}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition transform hover:scale-105"
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