import React, { useState } from 'react'
import { validarRespuesta } from '../api'

const PreguntaCard = ({ pregunta }) => {
  const [seleccion, setSeleccion] = useState('')
  const [resultado, setResultado] = useState(null)

  const handleValidar = async () => {
    if (!seleccion) return
    const res = await validarRespuesta(pregunta.id, seleccion)
    setResultado(res.correcta)
  }

  return (
    <div className="pregunta-card">
      <h3>{pregunta.texto}</h3>
      {pregunta.opciones.map((op, i) => (
        <div key={i}>
          <input 
            type="radio" 
            name={pregunta.id} 
            value={op} 
            onChange={(e) => setSeleccion(e.target.value)} 
          />
          <label>{op}</label>
        </div>
      ))}
      <button onClick={handleValidar}>Validar</button>
      {resultado !== null && (
        <p>{resultado ? '✅ Correcta' : '❌ Incorrecta'}</p>
      )}
    </div>
  )
}

export default PreguntaCard
