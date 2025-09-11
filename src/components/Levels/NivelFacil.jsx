import React, { useEffect, useState } from "react"
import { getPreguntasConOpciones } from "../../services/Questionsapi"
import PreguntaCard from "../Card/QuestionCard"

const NivelFacil = () => {
  const [preguntas, setPreguntas] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        console.log('🔍 Fetching preguntas para nivel Fácil...')
        const res = await getPreguntasConOpciones()
        console.log('📦 Respuesta completa de la API:', res)

        if (res.success) {
          const todasLasPreguntas = res.preguntas
          console.log('📝 Todas las preguntas:', todasLasPreguntas)
          console.log('🎯 Dificultades disponibles:', [...new Set(todasLasPreguntas.map(p => p.dificultad))])

          const preguntasFaciles = todasLasPreguntas.filter(p => p.dificultad === "Fácil")
          console.log('✅ Preguntas fáciles encontradas:', preguntasFaciles.length)
          console.log('🔍 Primera pregunta fácil:', preguntasFaciles[0])

          setPreguntas(preguntasFaciles)
        } else {
          console.error('❌ API response not successful:', res)
        }
      } catch (error) {
        console.error('💥 Error fetching preguntas:', error)
      }
    }
    fetchPreguntas()
  }, [])

  const handleNext = () => {
    if (currentIndex < preguntas.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  if (preguntas.length === 0) {
    return (
      <div className="relative flex h-screen w-full items-center justify-center bg-gradient-to-b from-sky-200 to-green-200">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🌍</div>
          <p className="text-xl text-gray-700">Cargando preguntas nivel Fácil...</p>
          <p className="text-sm text-gray-500 mt-2">Revisa la consola para más detalles</p>
        </div>
      </div>
    )
  }

  const pregunta = preguntas[currentIndex]
  const progreso = ((currentIndex + 1) / preguntas.length) * 100

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-sky-200 to-green-200 p-4 md:p-6 lg:p-8">
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
          key={currentIndex} // Reinicia el componente cuando cambia la pregunta
          pregunta={pregunta}
          onAnswered={() => {
            // Auto-avanzar después de 2 segundos
            setTimeout(() => {
              if (currentIndex < preguntas.length - 1) {
                handleNext()
              }
            }, 2000)
          }}
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

export default NivelFacil
