import React, { useEffect, useState } from 'react'
import { getPreguntasConOpciones } from '../../services/Questionsapi'
import PreguntaCard from '../Card/QuestionCard'

const NivelMedio = () => {
  const [preguntas, setPreguntas] = useState([])

  useEffect(() => {
    const fetchPreguntas = async () => {
      const res = await getPreguntasConOpciones()
      if (res.success) {
        setPreguntas(res.preguntas.filter(p => p.dificultad === 'Medio'))
      }
    }
    fetchPreguntas()
  }, [])

  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-gradient-to-b from-sky-300 to-pink-200">
      <div className="relative w-[600px] rounded-2xl bg-white/70 p-6 shadow-xl backdrop-blur-md">
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
          Preguntas Nivel Medio
        </h2>

        {preguntas.map(p => (
          <div key={p.id} className="mb-8">
            {/* Barra de progreso */}
            <div className="mb-4">
              <div className="h-2 w-full rounded bg-gray-200">
                <div
                  className="h-2 rounded bg-blue-500"
                  style={{ width: "40%" }}
                ></div>
              </div>
              <p className="mt-1 text-sm text-gray-600">Pregunta</p>
            </div>

            {/* Pregunta */}
            <h3 className="mb-6 text-center text-lg font-semibold text-gray-800">
              {p.texto}
            </h3>

            {/* Opciones */}
            <div className="grid grid-cols-2 gap-4">
              {p.opciones.map((opcion, i) => (
                <button
                  key={i}
                  className="rounded-lg bg-sky-100 py-3 text-lg font-medium text-gray-800 shadow hover:bg-sky-200"
                >
                  {opcion.texto}
                </button>
              ))}
            </div>

            {/* Botones de navegación */}
            <div className="mt-6 flex justify-center gap-4">
              <button className="rounded-lg bg-red-500 px-6 py-2 font-semibold text-white shadow hover:bg-red-600">
                Volver
              </button>
              <button className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white shadow hover:bg-blue-700">
                Continuar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NivelMedio