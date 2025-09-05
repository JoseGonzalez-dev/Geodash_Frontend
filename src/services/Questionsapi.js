const API_URL = import.meta.env.VITE_API_BACKEND

export const getPreguntasConOpciones = async () => {
  const res = await fetch(`${API_URL}/answers/preguntas-con-opciones`)
  return res.json()
}

export const validarRespuesta = async (id_pregunta, opcionElegida) => {
  const res = await fetch(`${API_URL}/answers/validar-respuesta`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_pregunta, opcionElegida })
  })
  return res.json()
}
