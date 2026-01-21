import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { statsService } from '../../services/statsService'

interface Question {
  figure: 'cuadrado' | 'rectangulo' | 'triangulo' | 'circulo' | 'trapecio'
  operation: 'area' | 'perimetro'
  dimensions: { [key: string]: number }
  correctAnswer: number
  options: number[]
  formula: string
}

export const GeometriaEspacial = () => {
  const navigate = useNavigate()
  
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [timeLeft, setTimeLeft] = useState(120)
  const [level, setLevel] = useState(1)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [wrongAnswers, setWrongAnswers] = useState(0)
  const [showFormula, setShowFormula] = useState(false)
  const [streak, setStreak] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [showNewAchievements, setShowNewAchievements] = useState<string[]>([])

  // Generar pregunta de geometría
  const generateQuestion = (): Question => {
    const figures: Question['figure'][] = ['cuadrado', 'rectangulo', 'triangulo', 'circulo', 'trapecio']
    const operations: Question['operation'][] = ['area', 'perimetro']
    
    const figure = figures[Math.floor(Math.random() * figures.length)]
    const operation = operations[Math.floor(Math.random() * operations.length)]
    
    let dimensions: { [key: string]: number } = {}
    let correctAnswer = 0
    let formula = ''

    const maxDimension = 5 + level * 2

    switch (figure) {
      case 'cuadrado':
        const ladoCuadrado = Math.floor(Math.random() * maxDimension) + 2
        dimensions = { lado: ladoCuadrado }
        if (operation === 'area') {
          correctAnswer = ladoCuadrado * ladoCuadrado
          formula = 'Área = lado²'
        } else {
          correctAnswer = ladoCuadrado * 4
          formula = 'Perímetro = 4 × lado'
        }
        break

      case 'rectangulo':
        const base = Math.floor(Math.random() * maxDimension) + 2
        const altura = Math.floor(Math.random() * maxDimension) + 2
        dimensions = { base, altura }
        if (operation === 'area') {
          correctAnswer = base * altura
          formula = 'Área = base × altura'
        } else {
          correctAnswer = 2 * (base + altura)
          formula = 'Perímetro = 2(base + altura)'
        }
        break

      case 'triangulo':
        const baseTriangulo = Math.floor(Math.random() * maxDimension) + 2
        const alturaTriangulo = Math.floor(Math.random() * maxDimension) + 2
        dimensions = { base: baseTriangulo, altura: alturaTriangulo }
        if (operation === 'area') {
          correctAnswer = Math.round((baseTriangulo * alturaTriangulo) / 2)
          formula = 'Área = (base × altura) / 2'
        } else {
          // Perímetro aproximado (triángulo equilátero)
          correctAnswer = baseTriangulo * 3
          formula = 'Perímetro ≈ 3 × base'
        }
        break

      case 'circulo':
        const radio = Math.floor(Math.random() * maxDimension) + 2
        dimensions = { radio }
        if (operation === 'area') {
          correctAnswer = Math.round(Math.PI * radio * radio)
          formula = 'Área = π × radio²'
        } else {
          correctAnswer = Math.round(2 * Math.PI * radio)
          formula = 'Perímetro = 2 × π × radio'
        }
        break

      case 'trapecio':
        const baseMayor = Math.floor(Math.random() * maxDimension) + 4
        const baseMenor = Math.floor(Math.random() * (maxDimension - 2)) + 2
        const alturaTrapecio = Math.floor(Math.random() * maxDimension) + 2
        dimensions = { baseMayor, baseMenor, altura: alturaTrapecio }
        if (operation === 'area') {
          correctAnswer = Math.round(((baseMayor + baseMenor) * alturaTrapecio) / 2)
          formula = 'Área = ((B + b) × h) / 2'
        } else {
          correctAnswer = baseMayor + baseMenor + (alturaTrapecio * 2)
          formula = 'Perímetro = B + b + 2h'
        }
        break
    }

    // Generar opciones de respuesta
    const options = [correctAnswer]
    while (options.length < 4) {
      const offset = Math.floor(Math.random() * 20) - 10
      const option = correctAnswer + offset
      if (option > 0 && !options.includes(option)) {
        options.push(option)
      }
    }

    // Mezclar opciones
    options.sort(() => Math.random() - 0.5)

    return {
      figure,
      operation,
      dimensions,
      correctAnswer,
      options,
      formula
    }
  }

  // Iniciar juego
  useEffect(() => {
    if (!gameOver) {
      setCurrentQuestion(generateQuestion())
    }
  }, [level, gameOver])

  // Timer
  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !gameOver) {
      endGame()
    }
  }, [timeLeft, gameOver])

  // Verificar respuesta
  const checkAnswer = (answer: number) => {
    if (!currentQuestion || selectedAnswer !== null) return

    setSelectedAnswer(answer)
    setQuestionsAnswered(prev => prev + 1)

    if (answer === currentQuestion.correctAnswer) {
      setCorrectAnswers(prev => prev + 1)
      const points = level * 30
      setScore(prev => prev + points)
      setStreak(prev => prev + 1)
      setFeedback('correct')

      if ((questionsAnswered + 1) % 3 === 0) {
        setLevel(prev => prev + 1)
      }

      setTimeout(() => {
        setSelectedAnswer(null)
        setFeedback(null)
        setCurrentQuestion(generateQuestion())
      }, 1000)
    } else {
      setWrongAnswers(prev => prev + 1)
      setLives(prev => prev - 1)
      setStreak(0)
      setFeedback('wrong')

      if (lives - 1 <= 0) {
        setTimeout(() => endGame(), 1000)
      } else {
        setTimeout(() => {
          setSelectedAnswer(null)
          setFeedback(null)
          setCurrentQuestion(generateQuestion())
        }, 1500)
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
        gameId: 6,
        gameName: 'Geometría',
        category: 'Geometría',
        score,
        timePlayed: 120 - timeLeft,
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
    setTimeLeft(120)
    setGameOver(false)
    setLevel(1)
    setLives(3)
    setQuestionsAnswered(0)
    setCorrectAnswers(0)
    setWrongAnswers(0)
    setStreak(0)
    setFeedback(null)
    setSelectedAnswer(null)
    setShowFormula(false)
    setShowNewAchievements([])
    setCurrentQuestion(generateQuestion())
  }

  const accuracy = questionsAnswered > 0 
    ? Math.round((correctAnswers / questionsAnswered) * 100) 
    : 0

  // Renderizar figura
  const renderFigure = () => {
    if (!currentQuestion) return null

    const { figure, dimensions } = currentQuestion

    switch (figure) {
      case 'cuadrado':
        return (
          <svg width="150" height="150" viewBox="0 0 150 150">
            <rect x="25" y="25" width="100" height="100" fill="#60a5fa" stroke="#1e40af" strokeWidth="3" />
            <text x="75" y="80" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">
              {dimensions.lado}
            </text>
          </svg>
        )
      
      case 'rectangulo':
        return (
          <svg width="180" height="120" viewBox="0 0 180 120">
            <rect x="20" y="20" width="140" height="80" fill="#34d399" stroke="#059669" strokeWidth="3" />
            <text x="90" y="65" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
              {dimensions.base} × {dimensions.altura}
            </text>
          </svg>
        )
      
      case 'triangulo':
        return (
          <svg width="150" height="150" viewBox="0 0 150 150">
            <polygon points="75,20 20,130 130,130" fill="#f59e0b" stroke="#d97706" strokeWidth="3" />
            <text x="75" y="90" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
              b:{dimensions.base} h:{dimensions.altura}
            </text>
          </svg>
        )
      
      case 'circulo':
        return (
          <svg width="150" height="150" viewBox="0 0 150 150">
            <circle cx="75" cy="75" r="60" fill="#ec4899" stroke="#be185d" strokeWidth="3" />
            <text x="75" y="80" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">
              r = {dimensions.radio}
            </text>
          </svg>
        )
      
      case 'trapecio':
        return (
          <svg width="150" height="150" viewBox="0 0 150 150">
            <polygon points="40,30 110,30 130,120 20,120" fill="#8b5cf6" stroke="#6d28d9" strokeWidth="3" />
            <text x="75" y="80" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
              B:{dimensions.baseMayor} b:{dimensions.baseMenor}
            </text>
          </svg>
        )
    }
  }

  const getFigureName = () => {
    if (!currentQuestion) return ''
    
    const names = {
      cuadrado: 'Cuadrado',
      rectangulo: 'Rectángulo',
      triangulo: 'Triángulo',
      circulo: 'Círculo',
      trapecio: 'Trapecio'
    }
    
    return names[currentQuestion.figure]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-3xl w-full">
        
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 mb-2">
            📐 Geometría Genio
          </h1>
          <p className="text-gray-600">¡Calcula áreas y perímetros!</p>
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

        {!gameOver && currentQuestion ? (
          <>
            {/* Stats */}
            <div className="grid grid-cols-5 gap-3 mb-6">
              <div className="bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-cyan-600">{score}</div>
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

              <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-orange-600">🔥{streak}</div>
                <div className="text-xs text-gray-600">Racha</div>
              </div>
            </div>

            {/* Pregunta */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-6">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Calcula el {currentQuestion.operation} del {getFigureName()}
                </h2>
                
                <div className="flex justify-center my-6">
                  {renderFigure()}
                </div>

                {/* Botón mostrar fórmula */}
                <button
                  onClick={() => setShowFormula(!showFormula)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-sm mb-4"
                >
                  {showFormula ? '🙈 Ocultar' : '💡 Ver'} Fórmula
                </button>

                {showFormula && (
                  <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-3 mb-4">
                    <p className="text-blue-800 font-semibold">{currentQuestion.formula}</p>
                  </div>
                )}
              </div>

              {/* Opciones */}
              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedAnswer === option
                  const isCorrect = option === currentQuestion.correctAnswer
                  
                  let buttonClass = 'bg-white border-4 border-gray-300 hover:border-cyan-400'
                  
                  if (isSelected) {
                    if (feedback === 'correct') {
                      buttonClass = 'bg-green-100 border-4 border-green-500'
                    } else if (feedback === 'wrong') {
                      buttonClass = 'bg-red-100 border-4 border-red-500'
                    }
                  } else if (feedback === 'wrong' && isCorrect) {
                    buttonClass = 'bg-green-100 border-4 border-green-500'
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => checkAnswer(option)}
                      disabled={selectedAnswer !== null}
                      className={`${buttonClass} text-2xl font-bold py-6 rounded-xl transition transform hover:scale-105 disabled:cursor-not-allowed`}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/juegos')}
                className="flex-1 bg-gray-300 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-400 transition"
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
          /* Game Over */
          <div className="text-center">
            <div className="text-6xl mb-4">
              {score >= 600 ? '🏆' : score >= 300 ? '🎉' : '💪'}
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {score >= 600 ? '¡Genio de la Geometría!' : score >= 300 ? '¡Gran trabajo!' : '¡Sigue practicando!'}
            </h2>
            
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-xl p-4">
                  <div className="text-3xl font-bold text-cyan-600">{score}</div>
                  <div className="text-sm text-gray-600">Puntuación Final</div>
                </div>
                
                <div className="bg-white rounded-xl p-4">
                  <div className="text-3xl font-bold text-blue-600">Nv.{level}</div>
                  <div className="text-sm text-gray-600">Nivel Alcanzado</div>
                </div>
                
                <div className="bg-white rounded-xl p-4">
                  <div className="text-3xl font-bold text-green-600">{correctAnswers}</div>
                  <div className="text-sm text-gray-600">Correctas</div>
                </div>
                
                <div className="bg-white rounded-xl p-4">
                  <div className="text-3xl font-bold text-purple-600">{accuracy}%</div>
                  <div className="text-sm text-gray-600">Precisión</div>
                </div>
              </div>

              {isSaving ? (
                <div className="text-cyan-600 font-semibold animate-pulse">
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
                className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-4 rounded-xl hover:from-cyan-700 hover:to-blue-700 transition transform hover:scale-105"
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