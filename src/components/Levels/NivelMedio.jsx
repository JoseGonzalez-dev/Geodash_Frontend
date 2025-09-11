import React, { useEffect, useState } from "react"
import { getPreguntasConOpciones } from "../../services/Questionsapi"
import PreguntaCard from "../Card/QuestionCard"
import { useGame } from "../../hooks/useGame"
import { useUserAnswer } from "../../hooks/useUserAnswer"
import { getCurrentUserId, isUserLoggedIn } from "../../utils/userUtils"

const NivelMedio = () => {
  const [preguntas, setPreguntas] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [gameId, setGameId] = useState(null)
  const [startTime, setStartTime] = useState(null)
  const { sendRequest: createGame, loading: creatingGame } = useGame()
  const { sendRequest: saveAnswer, loading: savingAnswer } = useUserAnswer()

  useEffect(() => {
    let isCancelled = false;
    
    const initializeGame = async () => {
      try {
        // Verificar si ya hay una partida en progreso
        if (gameId) {
          console.log('⚠️ [NivelMedio] Ya existe una partida:', gameId)
          return
        }
        
        // 1. Crear la partida en el backend
        console.log('🔍 [NivelMedio] Verificando usuario logueado...')
        
        if (!isUserLoggedIn()) {
          console.warn('⚠️ [NivelMedio] Usuario no logueado, redirigiendo...')
          return
        }
        
        const userId = getCurrentUserId()
        if (!userId) {
          console.error('❌ [NivelMedio] No se pudo obtener ID del usuario')
          return
        }
        
        console.log('🎮 [NivelMedio] Creando partida nivel Medio para usuario:', userId)
        const gameData = {
          user: userId,
          difficulty: 'Medio'
        }
        console.log('📊 [NivelMedio] Datos de partida a enviar:', gameData)
        
        const gameResult = await createGame(gameData)
        console.log('🎯 [NivelMedio] Resultado de creación:', gameResult)
        
        if (!isCancelled && !gameResult.error && gameResult.data) {
          const newGameId = gameResult.data._id || gameResult.data.id
          setGameId(newGameId)
          console.log('✅ [NivelMedio] Partida creada con ID:', newGameId)
        } else if (!isCancelled) {
          console.error('❌ [NivelMedio] Error creando partida:', gameResult)
        }

        // 2. Cargar las preguntas
        console.log('✈️ Fetching preguntas para nivel Medio...')
        const res = await getPreguntasConOpciones()
        console.log('📦 Respuesta completa de la API:', res)
        
        if (res.success) {
          const todasLasPreguntas = res.preguntas
          console.log('📝 Todas las preguntas:', todasLasPreguntas)
          console.log('🎯 Dificultades disponibles:', [...new Set(todasLasPreguntas.map(p => p.dificultad))])
          
          const preguntasMedio = todasLasPreguntas.filter(p => p.dificultad === "Medio")
          console.log('✅ Preguntas medio encontradas:', preguntasMedio.length)
          console.log('✈️ Primera pregunta medio:', preguntasMedio[0])
          
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
    console.log('🎯 [NivelMedio] Respuesta recibida:', { isCorrect, selectedOption })
    console.log('🎮 [NivelMedio] GameId actual:', gameId)
    console.log('❓ [NivelMedio] Pregunta actual:', preguntas[currentIndex])
    
    if (!gameId || !preguntas[currentIndex]) {
      console.error('❌ [NivelMedio] Faltan datos:', { gameId, pregunta: preguntas[currentIndex] })
      return
    }

    const responseTime = startTime ? Date.now() - startTime : 0
    console.log('⏱️ [NivelMedio] Tiempo de respuesta:', responseTime, 'ms')
    
    // Guardar la respuesta en el backend
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
    
    console.log('💾 [NivelMedio] Datos de respuesta a enviar:', answerData)

    const result = await saveAnswer(answerData)
    console.log('📋 [NivelMedio] Resultado de guardado:', result)
    
    if (result && !result.error) {
      console.log('✅ [NivelMedio] Respuesta guardada exitosamente:', result.data)
    } else {
      console.error('❌ [NivelMedio] Error guardando respuesta:', result)
    }

    // Auto-avanzar después de 2 segundos
    setTimeout(() => {
      if (currentIndex < preguntas.length - 1) {
        console.log('➡️ [NivelMedio] Avanzando a siguiente pregunta...')
        setCurrentIndex(currentIndex + 1)
        setStartTime(Date.now()) // Reiniciar timer para la siguiente pregunta
      } else {
        console.log('🎉 [NivelMedio] Juego completado!')
      }
    }, 2000)
  }

  const handleNext = () => {
    if (currentIndex < preguntas.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setStartTime(Date.now())
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

export default NivelMedio
