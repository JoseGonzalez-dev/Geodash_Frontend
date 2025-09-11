import { useState } from "react"
import { toast } from "sonner"
import { createGame } from "../services/api"

export const useGame = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const sendRequest = async (gameData) => {

        setLoading(true)
        setError(null)

        // Validar campos requeridos
        if (!gameData.user || !gameData.difficulty) {
            const errorMsg = 'Usuario y dificultad son requeridos'
            setError(errorMsg)
            toast.error(errorMsg)
            setLoading(false)
            return { error: true, message: errorMsg }
        }

        try {
            const response = await createGame(gameData)

            setLoading(false)

            if (response.error) {
                const backendMessage = response.message || 'Error al crear la partida';
                toast.error(backendMessage);
                setError(backendMessage)
                return { error: true, message: backendMessage }
            }

            // ✅ Manejar respuesta exitosa del backend
            if (response.data?.success) {
                toast.success(response.data.message || 'Partida creada correctamente')
                return response.data
            }

            return response
        } catch (e) {
            setLoading(false)
            const errorMessage = e.response?.data?.message || e.message || 'Error al crear la partida'
            setError(errorMessage)
            toast.error(errorMessage)
            return { error: true, message: errorMessage }
        }
    }
    return {
        loading,
        error,
        sendRequest
    }
}