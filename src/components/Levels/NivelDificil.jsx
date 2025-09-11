import React, { useEffect, useState } from "react"
import { getPreguntasConOpciones } from "../../services/Questionsapi"
import PreguntaCard from "../Card/QuestionCard"
import { useGame } from "../../hooks/useGame"
import { useUserAnswer } from "../../hooks/useUserAnswer"
import { getCurrentUserId, isUserLoggedIn } from "../../utils/userUtils"
import { useNavigate } from "react-router-dom"
import { useGameStats } from "../../hooks/useGameStats"
import { useEndGame } from "../../hooks/useEndGame"
import { VictoryModal, DefeatModal } from "../molecules/WinLoseModal"

const NivelDificil = () => {
  const [preguntas, setPreguntas] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [gameId, setGameId] = useState(null)
  const [startTime, setStartTime] = useState(null)
  const [userAnswer, setUserAnswer] = useState([])
  const [showVictoryModal, setShowVictoryModal] = useState(false)
  const [showDefeatModal, setShowDefeatModal] = useState(false)
  const [gameStats, setGameStats] = useState({})
  const { sendRequest: createGame, loading: creatingGame } = useGame()
  const { sendRequest: saveAnswer, loading: savingAnswer } = useUserAnswer()
  const { endGame } = useEndGame()
  const { calculateStats } = useGameStats()
  const navigate = useNavigate()

  useEffect(() => {
    let isCancelled = false
    const initializeGame = async () => {
      try {

        if (gameId) {
          return
        }
        
        if (!isUserLoggedIn()) {
                  navigate('/login')
                  return
                }
        
        const userId = getCurrentUserId()
        if (!userId) {
          return
        }
        
        const gameData = {
          user: userId,
          difficulty: 'Difícil'
        }
        
        const gameResult = await createGame(gameData)
        
        if (!isCancelled && !gameResult.error && gameResult.data) {
                  const newGameId = gameResult.data._id || gameResult.data.id
                  setGameId(newGameId)
                  console.log('✅ [NivelFacil] Partida creada con ID:', newGameId)
                } else if (!isCancelled) {
                  console.error('❌ [NivelFacil] Error creando partida:', gameResult)
                }
        
                // 2. Cargar las preguntas
                const res = await getPreguntasConOpciones()
        
                if (res.success) {
                  const todasLasPreguntas = res.preguntas
        
                  const preguntasDificiles = todasLasPreguntas.filter(p => p.dificultad === "Fácil")
        
                  setPreguntas(preguntasDificiles)
                  // Inicializar timer para la primera pregunta
                  setStartTime(Date.now())
                } else {
                  console.error('❌ API response not successful:', res)
                }
              } catch (error) {
                console.error('💥 Error initializing game:', error)
              }
            }
            
            initializeGame()
  }, [])

  const handleAnswered = async (isCorrect, selectedOption) => {
    
    if (!gameId || !preguntas[currentIndex]) {
      return
    }

    const responseTime = startTime ? Date.now() - startTime : 0
    
    // Guardar la respuesta en el backend
    const questionId = preguntas[currentIndex]._id || preguntas[currentIndex].id
    if (!questionId) {
      return
    }
    
    const answerData = {
      game: gameId,
      question: questionId,
      selectedOption: selectedOption,
      responseTimeMs: responseTime
    }
    

    const result = await saveAnswer(answerData)
    
    if (result && !result.error) {
      console.log('✅ [NivelDificil] Respuesta guardada exitosamente:', result.data)
    } else {
      console.error('❌ [NivelDificil] Error guardando respuesta:', result)
    }

    // Auto-avanzar después de 2 segundos
    setTimeout(() => {
      if (currentIndex < preguntas.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setStartTime(Date.now()) // Reiniciar timer para la siguiente pregunta
      } else {
        console.log('🎉 [NivelDificil] Juego completado!')
        // Aquí podrías actualizar el estado final del juego
      }
    }, 2000)

    const newAnswer ={
      isCorrect,
      selectedOption,
      responseTimeMs: responseTime,
      questionId: preguntas[currentIndex]._id || preguntas[currentIndex].id
    }

    setUserAnswer(prev => [...prev, newAnswer])

    if (currentIndex >= preguntas.length - 1) {
      const allAnswers = [...userAnswer, newAnswer]
      const stats = calculateStats(allAnswers)
      
      const gameData ={
        endDate: new Date().toISOString(),
        totalScore: stats.totalScore,
        correctAnswers: stats.correctAnswers,
        totalResponseTimeMs: stats.totalResponseTimeMs
      }

      const result = await endGame(gameId, gameData)

      if(result.success){
        console.log('🏆 [NivelDificil] Juego finalizado exitosamente:', result)
        
        // Determinar si el usuario ganó o perdió (70% de respuestas correctas para ganar)
        const passingScore = Math.ceil(preguntas.length * 0.7)
        const didWin = stats.correctAnswers >= passingScore
        
        // Preparar estadísticas para el modal
        const modalStats = {
          score: stats.totalScore,
          correctAnswers: stats.correctAnswers,
          totalQuestions: preguntas.length,
          timeBonus: Math.floor(stats.averageResponseTimeMs < 3500 ? 250 : 100),
          streakBonus: Math.floor(stats.longestStreak * 40),
          difficulty: 'Geógrafo',
          bestScore: stats.totalScore // Podríamos obtener el mejor puntaje del usuario en el futuro
        }
        
        setGameStats(modalStats)
        
        // Mostrar el modal correspondiente
        if (didWin) {
          setShowVictoryModal(true)
        } else {
          setShowDefeatModal(true)
        }
      }
    }
  }

  const handleNext = () => {
    if (currentIndex < preguntas.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setStartTime(Date.now())
    }
  }

  if (creatingGame || preguntas.length === 0) {
    return (
      <div className="relative flex h-screen w-full items-center justify-center bg-gradient-to-b from-blue-900 via-slate-900 to-black">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🏆</div>
          <p className="text-xl text-white">
            {creatingGame ? 'Iniciando partida...' : 'Cargando preguntas nivel Difícil...'}
          </p>
        </div>
      </div>
    )
  }

  const pregunta = preguntas[currentIndex]
  const progreso = ((currentIndex + 1) / preguntas.length) * 100

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-blue-900 via-slate-900 to-black p-4 md:p-6 lg:p-8">
      {/* Modal de Victoria */}
      <VictoryModal 
        isOpen={showVictoryModal} 
        gameStats={gameStats} 
      />
      
      {/* Modal de Derrota */}
      <DefeatModal 
        isOpen={showDefeatModal} 
        gameStats={gameStats} 
      />
      
      <div className="relative w-full max-w-5xl mx-auto rounded-2xl bg-white/80 p-6 md:p-8 lg:p-12 shadow-xl backdrop-blur-md">
        {/* Barra de progreso */}
        <div className="mb-6">
          <div className="h-3 w-full rounded bg-gray-600">
            <div
              className="h-3 rounded bg-blue-500 transition-all"
              style={{ width: `${progreso}%` }}
            ></div>
          </div>
          <p className="mt-2 text-lg text-gray-300 text-center font-medium">
            Pregunta {currentIndex + 1}/{preguntas.length}
          </p>
        </div>

        {/* Componente de Pregunta */}
        <PreguntaCard 
          key={currentIndex}
          pregunta={pregunta} 
          onAnswered={handleAnswered}
          disabled={savingAnswer}
        />

        {/* Botón de siguiente (opcional) */}
        <div className="mt-8 text-center">
          <button
            onClick={handleNext}
            disabled={currentIndex >= preguntas.length - 1}
            className="rounded-xl bg-blue-500 px-8 md:px-12 py-3 md:py-4 text-lg md:text-xl text-white font-bold shadow-lg hover:bg-blue-600 hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300"
          >
            {currentIndex >= preguntas.length - 1 ? '🎉 Completado' : '➡️ Siguiente'}
          </button>
        </div>
      </div>

    </div>
  )
}

export default NivelDificil
