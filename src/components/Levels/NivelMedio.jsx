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

const NivelMedio = () => {
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
  const { calculateStats, saveResult } = useGameStats()
  const navigate = useNavigate()

  useEffect(() => {
    let isCancelled = false;
    
    const initializeGame = async () => {
      try {
        // Verificar si ya hay una partida en progreso
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
          difficulty: 'Medio'
        }
        
        const gameResult = await createGame(gameData)
        
        if (!isCancelled && !gameResult.error && gameResult.data) {
          const newGameId = gameResult.data._id || gameResult.data.id
          setGameId(newGameId)
        } else if (!isCancelled) {
          console.error('❌ [NivelMedio] Error creando partida:', gameResult)
        }

        const res = await getPreguntasConOpciones()
        
        if (res.success) {
          const todasLasPreguntas = res.preguntas
          
          const preguntasMedio = todasLasPreguntas.filter(p => p.dificultad === "Medio")
          
          setPreguntas(preguntasMedio)
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
    
    // Solo guardar en el backend si no es timeout
    if (selectedOption !== 'TIMEOUT') {
      const questionId = preguntas[currentIndex]._id || preguntas[currentIndex].id
      if (!questionId) {
        console.error('❌ [NivelMedio] No se encontró ID de la pregunta:', preguntas[currentIndex])
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
        console.log('✅')
      } else {
        console.error('❌ [NivelMedio] Error guardando respuesta:', result)
      }
    } 

    // Auto-avanzar después de 1.5 segundos
    setTimeout(() => {
      if (currentIndex < preguntas.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setStartTime(Date.now()) // Reiniciar timer para la siguiente pregunta
      }
    }, 1500)

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
        
        // Determinar si el usuario ganó o perdió (70% de respuestas correctas para ganar)
        const passingScore = Math.ceil(preguntas.length * 0.7)
        const didWin = stats.correctAnswers >= passingScore
        
        // Preparar estadísticas para el modal
        const modalStats = {
          score: stats.totalScore,
          correctAnswers: stats.correctAnswers,
          totalQuestions: preguntas.length,
          timeBonus: Math.floor(stats.averageResponseTime < 4000 ? 200 : 75),
          streakBonus: 0,
          difficulty: 'Viajero',
          bestScore: stats.totalScore // Podríamos obtener el mejor puntaje del usuario en el futuro
        }
        
        setGameStats(modalStats)
        // Guardar resultados locales para trofeos (Viajero)
        saveResult('traveler', {
          correctAnswers: stats.correctAnswers,
          totalQuestions: preguntas.length,
          totalScore: stats.totalScore,
          averageResponseTime: stats.averageResponseTime
        })
        
        // Mostrar el modal correspondiente
        if (didWin) {
          setShowVictoryModal(true)
        } else {
          setShowDefeatModal(true)
        }
      }
    }
  }

  if (creatingGame || preguntas.length === 0) {
    return (
      <div className="relative flex h-screen w-full items-center justify-center bg-gradient-to-b from-sky-300 to-pink-200">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">✈️</div>
          <p className="text-xl text-gray-700">
            {creatingGame ? 'Iniciando partida...' : 'Cargando preguntas nivel Medio...'}
          </p>
          <p className="text-sm text-gray-500 mt-2">Revisa la consola para más detalles</p>
        </div>
      </div>
    )
  }

  const pregunta = preguntas[currentIndex]
  const progreso = ((currentIndex + 1) / preguntas.length) * 100

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-sky-300 to-pink-200 p-4 md:p-6 lg:p-8">
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
          <div className="h-3 w-full rounded bg-gray-200">
            <div
              className="h-3 rounded bg-blue-500 transition-all"
              style={{ width: `${progreso}%` }}
            ></div>
          </div>
          <p className="mt-2 text-lg text-gray-600 text-center font-medium">
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

      </div>
    </div>
  )
}

export default NivelMedio
