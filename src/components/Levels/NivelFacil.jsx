import React, { useEffect, useState } from 'react'
import { getPreguntasConOpciones } from '../../services/Questionsapi'
import PreguntaCard from '../Card/QuestionCard'

const NivelFacil = () => {
  const [preguntas, setPreguntas] = useState([])

  useEffect(() => {
    const fetchPreguntas = async () => {
      const res = await getPreguntasConOpciones()
      if(res.success){
        setPreguntas(res.preguntas.filter(p => p.dificultad === 'Fácil'))
      }
    }
    fetchPreguntas()
  }, [])

  return (
    <div>
      <h2>Preguntas Nivel Fácil</h2>
      {preguntas.map(p => (
        <PreguntaCard key={p.id} pregunta={p} />
      ))}
    </div>
  )
}

export default NivelFacil
