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

  // Obtener las opciones de respuesta
  const opciones = pregunta.texto_respuestas || pregunta.opciones || []

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Timer */}
      <QuestionTimer 
        timeLeft={timeLeft}
        progress={progress}
        isActive={isActive}
        hasTimedOut={hasTimedOut}
      />
      
      {/* Pregunta */}
      <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-8 text-gray-800 leading-relaxed px-4">
        {pregunta.texto}
      </h3>
      
      {/* Opciones - Grid responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
        {opciones.map((op, i) => {
          const opcionTexto = typeof op === 'string' ? op : (op.texto || op)
          return (
            <button
              key={i}
              style={getButtonStyle(opcionTexto)}
              className="p-4 md:p-6 lg:p-8 rounded-xl text-base md:text-lg lg:text-xl font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
              onClick={() => handleSeleccion(opcionTexto)}
              disabled={mostrarResultados || cargando || disabled || hasAnswered || hasTimedOut}
            >
              <span className="flex items-center justify-center gap-2">
                {cargando && opcionTexto === seleccion && <span className="text-xl animate-spin">⏳</span>}
                {mostrarResultados && esCorrecta && opcionTexto === seleccion && <span className="text-xl animate-bounce">✅</span>}
                {mostrarResultados && opcionTexto === seleccion && !esCorrecta && <span className="text-xl animate-pulse">❌</span>}
                <span className="text-center">{opcionTexto}</span>
              </span>
            </button>
          )
        })}
      </div>

      
    </div>
  )
}

export default PreguntaCard
