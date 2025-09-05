import React, { useState } from 'react'
import { validarRespuesta } from '../../services/Questionsapi.js'

const PreguntaCard = ({ pregunta, onAnswered }) => {
  const [seleccion, setSeleccion] = useState('')
  const [mostrarResultados, setMostrarResultados] = useState(false)
  const [respuestaCorrecta, setRespuestaCorrecta] = useState('')
  const [esCorrecta, setEsCorrecta] = useState(false)
  const [cargando, setCargando] = useState(false)

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
    if (mostrarResultados || cargando) return

    setSeleccion(opcionTexto)
    setCargando(true)

    try {
      // Validar la respuesta seleccionada
      const res = await validarRespuesta(pregunta.id, opcionTexto)
      console.log('Respuesta del API:', res)

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
          // Si fue incorrecta, buscar la correcta probando todas las opciones
          console.log('Buscando respuesta correcta...')
          correcta = await findCorrectAnswer()
        }
      }

      setRespuestaCorrecta(correcta)
      setCargando(false)
      setMostrarResultados(true)

      if (onAnswered) {
        onAnswered(res.correcta)
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
        cursor: 'default'
      }
    }

    if (!mostrarResultados && !cargando) {
      return {
        backgroundColor: '#f5f5f5',
        color: '#333',
        cursor: 'pointer'
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

    // Después de responder: SIEMPRE mostrar la correcta en verde
    if (opcionTexto === respuestaCorrecta) {
      return {
        backgroundColor: '#4CAF50', // Verde para la respuesta correcta
        color: 'white',
        fontWeight: 'bold',
        border: '3px solid #2E7D32'
      }
    }
    // Si seleccioné una incorrecta, mostrarla en rojo
    else if (opcionTexto === seleccion && !esCorrecta) {
      return {
        backgroundColor: '#f44336', // Rojo para mi selección incorrecta
        color: 'white',
        fontWeight: 'bold',
        border: '3px solid #C62828'
      }
    }
    // Las demás opciones en gris
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
              disabled={mostrarResultados || cargando}
            >
              <span className="flex items-center justify-center gap-2">
                {cargando && opcionTexto === seleccion && <span className="text-xl">⏳</span>}
                {mostrarResultados && opcionTexto === respuestaCorrecta && <span className="text-xl">✅</span>}
                {mostrarResultados && opcionTexto === seleccion && !esCorrecta && <span className="text-xl">❌</span>}
                <span className="text-center">{opcionTexto}</span>
              </span>
            </button>
          )
        })}
      </div>

      {/* Mensaje de resultado */}
      {mostrarResultados && (
        <div className={`mt-6 text-center p-4 md:p-6 rounded-xl ${
          esCorrecta ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
        }`}>
          <p className={`text-lg md:text-xl lg:text-2xl font-bold ${
            esCorrecta ? 'text-green-700' : 'text-red-700'
          }`}>
            {esCorrecta
              ? '🎉 ¡Correcto! Bien hecho.'
              : `❌ Incorrecto. La respuesta correcta es: ${respuestaCorrecta}`
            }
          </p>
        </div>
      )}
    </div>
  )
}

export default PreguntaCard
