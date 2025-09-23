import React, { useState, useEffect } from 'react'
import { validarRespuesta } from '../../services/Questionsapi.js'
import { useQuestionTimer } from '../../hooks/useQuestionTimer'
import QuestionTimer from '../Timer/QuestionTimer'

const PreguntaCard = ({ pregunta, onAnswered, disabled = false }) => {
  const [seleccion, setSeleccion] = useState('')
  const [mostrarResultados, setMostrarResultados] = useState(false)
  const [respuestaCorrecta, setRespuestaCorrecta] = useState('')
  const [esCorrecta, setEsCorrecta] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [opcionesDesordenadas, setOpcionesDesordenadas] = useState([])

  // Timer de 20 segundos
  const handleTimeout = () => {
    if (!hasAnswered && !mostrarResultados) {
      // Marcar como incorrecta automáticamente
      setEsCorrecta(false)
      setMostrarResultados(true)
      setHasAnswered(true)

      if (onAnswered) {
        // Para timeout, usar una opción especial que indique "sin respuesta"
        onAnswered(false, 'TIMEOUT')
      }
    }
  }

  const { timeLeft, progress, isActive, hasTimedOut, startTimer, stopTimer } = useQuestionTimer(20000, handleTimeout)

  // Función para desordenar array usando Fisher-Yates shuffle
  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Desordenar opciones cuando llega una nueva pregunta
  useEffect(() => {
    if (pregunta && (pregunta.texto_respuestas || pregunta.opciones)) {
      const opciones = pregunta.texto_respuestas || pregunta.opciones || []
      const opcionesConTexto = opciones.map(op => typeof op === 'string' ? op : (op.texto || op))
      setOpcionesDesordenadas(shuffleArray(opcionesConTexto))
    }
  }, [pregunta?.id])

  // Iniciar timer cuando se carga la pregunta
  useEffect(() => {
    if (pregunta && !disabled) {
      // Usar requestAnimationFrame para asegurar que se ejecute después del render
      const rafId = requestAnimationFrame(() => {
        startTimer()
      })

      return () => {
        cancelAnimationFrame(rafId)
        stopTimer()
      }
    }
  }, [pregunta?.id, disabled])

  const findCorrectAnswer = async () => {
    // Estrategia: probar todas las opciones hasta encontrar la correcta
    const opciones = pregunta.texto_respuestas || pregunta.opciones || []

    for (const op of opciones) {
      const opcionTexto = typeof op === 'string' ? op : (op.texto || op)
      try {
        const testRes = await validarRespuesta(pregunta.id, opcionTexto)
        if (testRes.correcta) {
          return opcionTexto
        }
      } catch (error) {
        console.error('Error probando opción:', opcionTexto, error)
      }
    }
    return "No encontrada"
  }

  const handleSeleccion = async (opcionTexto) => {
    if (mostrarResultados || cargando || disabled || hasAnswered) return

    setSeleccion(opcionTexto)
    setCargando(true)
    setHasAnswered(true)

    // Detener el timer cuando se responde
    stopTimer()

    try {
      // Validar la respuesta seleccionada
      const res = await validarRespuesta(pregunta.id, opcionTexto)

      setEsCorrecta(res.correcta)

      let correcta = null

      // Primero intentar obtener del API o pregunta
      if (res.respuesta_correcta) {
        correcta = res.respuesta_correcta
      } else if (res.opcion_correcta) {
        correcta = res.opcion_correcta
      } else if (pregunta.opcion_correcta) {
        correcta = pregunta.opcion_correcta
      } else {
        // Si la respuesta fue correcta, ya sabemos cuál es
        if (res.correcta) {
          correcta = opcionTexto
        } else {
          correcta = await findCorrectAnswer()
        }
      }

      setRespuestaCorrecta(correcta)
      setCargando(false)
      setMostrarResultados(true)

      if (onAnswered) {
        onAnswered(res.correcta, opcionTexto)
      }
    } catch (error) {
      console.error('Error validando respuesta:', error)
      setCargando(false)
      setMostrarResultados(true)
    }
  }

  const getButtonStyle = (opcionTexto) => {
    // Estado de carga
    if (cargando && opcionTexto === seleccion) {
      return {
        backgroundColor: '#FFC107', // Amarillo para cargando
        color: 'white',
        cursor: 'default',
        transform: 'scale(1.05)',
        boxShadow: '0 8px 25px rgba(255, 193, 7, 0.4)'
      }
    }

    // Si hay timeout, deshabilitar todos los botones
    if (hasTimedOut && !mostrarResultados) {
      return {
        backgroundColor: '#f44336', // Rojo para timeout
        color: 'white',
        cursor: 'default',
        opacity: 0.8
      }
    }

    if (!mostrarResultados && !cargando && !hasTimedOut) {
      return {
        backgroundColor: '#f5f5f5',
        color: '#333',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }
    }

    if (!mostrarResultados) {
      return {
        backgroundColor: '#f5f5f5',
        color: '#333',
        cursor: 'default',
        opacity: 0.7
      }
    }

    // Después de responder: Solo mostrar la correcta si la respuesta fue correcta
    if (esCorrecta && opcionTexto === seleccion) {
      return {
        backgroundColor: '#4CAF50', // Verde para respuesta correcta
        color: 'white',
        fontWeight: 'bold',
        border: '3px solid #2E7D32',
        transform: 'scale(1.05)',
        boxShadow: '0 8px 25px rgba(76, 175, 80, 0.4)',
        animation: 'pulse 0.6s ease-in-out'
      }
    }
    // Si seleccioné una incorrecta, mostrarla en rojo (sin mostrar la correcta)
    else if (opcionTexto === seleccion && !esCorrecta) {
      return {
        backgroundColor: '#f44336', // Rojo para mi selección incorrecta
        color: 'white',
        fontWeight: 'bold',
        border: '3px solid #C62828',
        transform: 'scale(0.98)',
        boxShadow: '0 4px 15px rgba(244, 67, 54, 0.3)'
      }
    }
    // Las demás opciones en gris (sin mostrar la correcta si fue incorrecta)
    else {
      return {
        backgroundColor: '#e0e0e0', // Gris para las no seleccionadas
        color: '#666',
        opacity: 0.6
      }
    }
  }

  return (
    <div className="w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Timer */}
      <QuestionTimer
        timeLeft={timeLeft}
        progress={progress}
        isActive={isActive}
        hasTimedOut={hasTimedOut}
      />

      {/* Pregunta */}
      <h3 className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl 2xl:text-3xl font-bold text-center mb-6 sm:mb-8 lg:mb-8 xl:mb-10 2xl:mb-10 text-gray-800 leading-relaxed">
        {pregunta.texto}
      </h3>

      {/* Opciones - Grid responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-7 2xl:gap-8 mb-6">
        {opcionesDesordenadas.map((opcionTexto, i) => {
          return (
            <button
              key={`${pregunta?.id}-${i}`}
              style={getButtonStyle(opcionTexto)}
              className="p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 2xl:p-8 rounded-lg sm:rounded-xl text-sm sm:text-base md:text-base lg:text-lg xl:text-xl 2xl:text-xl font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
              onClick={() => handleSeleccion(opcionTexto)}
              disabled={mostrarResultados || cargando || disabled || hasAnswered || hasTimedOut}
            >
              <span className="flex items-center justify-center gap-2 sm:gap-3">
                {cargando && opcionTexto === seleccion && <span className="text-lg sm:text-xl animate-spin">⏳</span>}
                {mostrarResultados && esCorrecta && opcionTexto === seleccion && <span className="text-lg sm:text-xl animate-bounce">✅</span>}
                {mostrarResultados && opcionTexto === seleccion && !esCorrecta && <span className="text-lg sm:text-xl animate-pulse">❌</span>}
                <span className="text-center leading-tight">{opcionTexto}</span>
              </span>
            </button>
          )
        })}
      </div>


    </div>
  )
}

export default PreguntaCard
