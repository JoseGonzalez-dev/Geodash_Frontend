import React, { useEffect, useState } from "react"
import { getPreguntasConOpciones } from "../../services/Questionsapi"

const NivelDificil = () => {
  const [preguntas, setPreguntas] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchPreguntas = async () => {
      const res = await getPreguntasConOpciones()
      if (res.success) {
        setPreguntas(res.preguntas.filter(p => p.dificultad === "Dificil"))
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
    <div className="relative flex h-screen w-full items-center justify-center bg-gradient-to-b from-blue-900 via-slate-900 to-black">
      <div className="relative w-[600px] rounded-2xl bg-white/70 p-6 shadow-xl backdrop-blur-md">
        {/* Barra de progreso */}
        <div className="mb-4">
          <div className="h-2 w-full rounded bg-gray-600">
            <div
              className="h-2 rounded bg-blue-500 transition-all"
              style={{ width: `${progreso}%` }}
            ></div>
          </div>
          <p className="mt-1 text-sm text-gray-300">
            Pregunta {currentIndex + 1}/{preguntas.length}
          </p>
        </div>

        {/* Pregunta */}
        <h3 className="mb-6 text-center text-lg font-semibold text-gray-100">
          {pregunta.texto}
        </h3>

        {/* Opciones */}
        <div className="grid grid-cols-2 gap-4">
          {pregunta.opciones.map((opcion, i) => (
            <button
              key={i}
              onClick={handleNext}
              className="rounded-lg bg-sky-100 py-3 text-lg font-medium text-gray-800 shadow hover:bg-sky-200"
            >
              {opcion.texto}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NivelDificil
