import React, { useEffect, useState } from "react"
import { getPreguntasConOpciones } from "../../services/Questionsapi"
import PreguntaCard from "../Card/QuestionCard"

const NivelDificil = () => {
  const [preguntas, setPreguntas] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchPreguntas = async () => {
      const res = await getPreguntasConOpciones()
      if (res.success) {
        setPreguntas(res.preguntas.filter(p => p.dificultad === "Difícil"))
      }
    }
    fetchPreguntas()
  }, [])

  const handleNext = () => {
    if (currentIndex < preguntas.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  if (preguntas.length === 0) return <p>Cargando preguntas...</p>

  const pregunta = preguntas[currentIndex]
  const progreso = ((currentIndex + 1) / preguntas.length) * 100

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-blue-900 via-slate-900 to-black p-4 md:p-6 lg:p-8">
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
          onAnswered={() => {
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

export default NivelDificil
