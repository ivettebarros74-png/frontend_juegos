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
  const [timeLeft, setTimeLeft] = useState(90)
  const [gameOver, setGameOver] = useState(false)
  const [level, setLevel] = useState(1)
  const [lives, setLives] = useState(3)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [wrongAnswers, setWrongAnswers] = useState(0)
  const [isSaving, setIsSaving] = useState(false)

  const generateEquation = () => {
    const x = Math.floor(Math.random() * 10) + 1
    const aVal = Math.floor(Math.random() * 5) + 1
    const bVal = Math.floor(Math.random() * 20) - 10
    const cVal = aVal * x + bVal
    
    setA(aVal)
    setB(bVal)
    setC(cVal)
    setUserAnswer('')
  }

  useEffect(() => {
    generateEquation()
  }, [])

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !gameOver) {
      setGameOver(true)
    }
  }, [timeLeft, gameOver])

  const checkAnswer = () => {
    if (userAnswer.trim() === '') return

    const correctAnswer = (c - b) / a
    const userNum = parseFloat(userAnswer)

    if (isNaN(userNum)) return

    if (Math.abs(userNum - correctAnswer) < 0.01) {
      const newCorrectAnswers = correctAnswers + 1
      const newQuestionsAnswered = questionsAnswered + 1
      
      setScore(prev => prev + (25 * level))
      setCorrectAnswers(newCorrectAnswers)
      setQuestionsAnswered(newQuestionsAnswered)
      setFeedback('correct')
      
      setTimeout(() => {
        setFeedback(null)
        
        if (newCorrectAnswers % 4 === 0) {
          setLevel(prev => prev + 1)
        } else {
          generateEquation()
        }
      }, 500)
    } else {
      const newLives = lives - 1
      const newWrongAnswers = wrongAnswers + 1
      const newQuestionsAnswered = questionsAnswered + 1
      
      setLives(newLives)
      setWrongAnswers(newWrongAnswers)
      setQuestionsAnswered(newQuestionsAnswered)
      setFeedback('wrong')
      
      setTimeout(() => {
        setFeedback(null)
        
        if (newLives <= 0) {
          setGameOver(true)
        } else {
          generateEquation()
        }
      }, 500)
    }
  }

  useEffect(() => {
    if (level > 1) {
      generateEquation()
    }
  }, [level])

  useEffect(() => {
    if (gameOver && questionsAnswered > 0 && !isSaving) {
      saveGameSession()
    }
  }, [gameOver])

  const saveGameSession = async () => {
    if (isSaving) return
    
    setIsSaving(true)
    
    const sessionData = {
      userId: statsService.getUserId(),
      gameId: 5,
      gameName: 'EcuacionesPro',
      category: 'Álgebra' as const,
      score: score,
      timePlayed: 90 - timeLeft,
      level: level,
      correctAnswers: correctAnswers,
      wrongAnswers: wrongAnswers
    }

    try {
      await statsService.saveGameSession(sessionData)
    } catch (error) {
      console.error('Error al guardar la sesión:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const resetGame = () => {
    setScore(0)
    setTimeLeft(90)
    setGameOver(false)
    setLevel(1)
    setLives(3)
    setQuestionsAnswered(0)
    setCorrectAnswers(0)
    setWrongAnswers(0)
    setFeedback(null)
    setUserAnswer('')
    setTimeout(() => generateEquation(), 100)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !gameOver && userAnswer.trim() !== '') {
      checkAnswer()
    }
  }

  const accuracy = questionsAnswered > 0 
    ? Math.round((correctAnswers / questionsAnswered) * 100)
    : 0

  const formatEquation = () => {
    const bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`
    return `${a}x ${bStr} = ${c}`
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-600 py-8 px-4'>
      <div className='container mx-auto max-w-4xl'>
        <div className='bg-white rounded-2xl shadow-2xl p-6 mb-6'>
          <div className='flex items-center justify-between mb-4'>
            <button
              onClick={() => navigate('/juegos')}
              className='bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition'
            >
              ← Volver
            </button>
            <h1 className='text-4xl font-extrabold text-center flex-1'>
              📐 Ecuaciones Pro
            </h1>
            <button
              onClick={() => navigate('/stats')}
              className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition'
            >
              📊 Stats
            </button>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='bg-blue-100 rounded-lg p-3 text-center'>
              <p className='text-sm text-blue-600 font-semibold'>Puntos</p>
              <p className='text-2xl font-bold text-blue-800'>{score}</p>
            </div>
            <div className='bg-green-100 rounded-lg p-3 text-center'>
              <p className='text-sm text-green-600 font-semibold'>Tiempo</p>
              <p className='text-2xl font-bold text-green-800' key={timeLeft}>{timeLeft}s</p>
            </div>
            <div className='bg-purple-100 rounded-lg p-3 text-center'>
              <p className='text-sm text-purple-600 font-semibold'>Nivel</p>
              <p className='text-2xl font-bold text-purple-800'>{level}</p>
            </div>
            <div className='bg-red-100 rounded-lg p-3 text-center'>
              <p className='text-sm text-red-600 font-semibold'>Vidas</p>
              <p className='text-2xl font-bold text-red-800'>{'❤️'.repeat(lives)}</p>
            </div>
          </div>
        </div>

        {!gameOver ? (
          <div className='bg-white rounded-2xl shadow-2xl p-8'>
            <div className='text-center mb-8'>
              <div className='text-6xl font-bold text-gray-800 mb-4' key={`${a}-${b}-${c}`}>
                {formatEquation()}
              </div>
              
              <p className='text-2xl text-gray-600 mb-6'>
                Encuentra el valor de <span className='font-bold text-indigo-600'>x</span>
              </p>
              
              {feedback && (
                <div className={`text-2xl font-bold mb-4 ${
                  feedback === 'correct' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {feedback === 'correct' ? '✓ ¡Correcto!' : '✗ Incorrecto'}
                </div>
              )}

              <div className='flex items-center justify-center gap-3 mb-6'>
                <span className='text-3xl font-bold text-gray-700'>x =</span>
                <input
                  type='number'
                  step='0.01'
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className='w-full max-w-xs text-center text-4xl font-bold border-4 border-indigo-300 rounded-lg p-4 focus:outline-none focus:border-indigo-500'
                  placeholder='?'
                  autoFocus
                  disabled={gameOver}
                />
              </div>
            </div>

            <button
              onClick={checkAnswer}
              disabled={userAnswer.trim() === ''}
              className='w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold py-4 rounded-lg text-xl hover:from-indigo-600 hover:to-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Verificar Respuesta
            </button>

            <div className='mt-6 grid grid-cols-3 gap-4 text-center text-sm'>
              <div>
                <p className='text-gray-600'>Respondidas</p>
                <p className='text-2xl font-bold text-blue-600'>{questionsAnswered}</p>
              </div>
              <div>
                <p className='text-gray-600'>Correctas</p>
                <p className='text-2xl font-bold text-green-600'>{correctAnswers}</p>
              </div>
              <div>
                <p className='text-gray-600'>Precisión</p>
                <p className='text-2xl font-bold text-purple-600'>{accuracy}%</p>
              </div>
            </div>
          </div>
        ) : (
          <div className='bg-white rounded-2xl shadow-2xl p-8 text-center'>
            <div className='text-6xl mb-4'>
              {lives > 0 ? '⏰' : '💔'}
            </div>
            <h2 className='text-4xl font-bold text-gray-800 mb-4'>
              {lives > 0 ? '¡Tiempo Agotado!' : '¡Juego Terminado!'}
            </h2>
            
            <div className='bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-6 mb-6'>
              <p className='text-5xl font-bold text-indigo-600 mb-2'>{score}</p>
              <p className='text-gray-600'>Puntos Totales</p>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
              <div className='bg-blue-50 rounded-lg p-4'>
                <p className='text-sm text-blue-600'>Respondidas</p>
                <p className='text-2xl font-bold text-blue-800'>{questionsAnswered}</p>
              </div>
              <div className='bg-green-50 rounded-lg p-4'>
                <p className='text-sm text-green-600'>Correctas</p>
                <p className='text-2xl font-bold text-green-800'>{correctAnswers}</p>
              </div>
              <div className='bg-red-50 rounded-lg p-4'>
                <p className='text-sm text-red-600'>Incorrectas</p>
                <p className='text-2xl font-bold text-red-800'>{wrongAnswers}</p>
              </div>
              <div className='bg-purple-50 rounded-lg p-4'>
                <p className='text-sm text-purple-600'>Precisión</p>
                <p className='text-2xl font-bold text-purple-800'>{accuracy}%</p>
              </div>
            </div>

            <div className='flex gap-4'>
              <button
                onClick={resetGame}
                className='flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 rounded-lg text-xl hover:from-green-600 hover:to-emerald-600 transition'
              >
                🔄 Jugar de Nuevo
              </button>
              <button
                onClick={() => navigate('/juegos')}
                className='flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold py-4 rounded-lg text-xl hover:from-gray-600 hover:to-gray-700 transition'
              >
                🏠 Menú Principal
              </button>
            </div>

            {isSaving && (
              <p className='mt-4 text-gray-600'>💾 Guardando resultados...</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}