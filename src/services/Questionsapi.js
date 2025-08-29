const API_URL = "http://localhost:5137/api" 

export const getPreguntasConOpciones = async () => {
  const res = await fetch(`${API_URL}/respuestas/preguntas-con-opciones`)
  return res.json()
}

export const validarRespuesta = async (id_pregunta, opcionElegida) => {
  const res = await fetch(`${API_URL}/respuestas/validar-respuesta`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_pregunta, opcionElegida })
  })
  return res.json()
}
