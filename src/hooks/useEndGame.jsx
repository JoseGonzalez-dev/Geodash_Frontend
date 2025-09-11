import { useState } from "react"
import { toast } from "sonner"
import { endGame } from "../services/api"

export const useEndGame = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const sendRequest = async (gameId, gameData) => {
        setLoading(true)
        setError(null)

        if (!gameId) {
            const errorMsg = 'ID del juego es requerido'
            setError(errorMsg)
            toast.error(errorMsg)
            setLoading(false)
            return { error: true, message: errorMsg }
        }

        const requiredFields = ['endDate', 'totalScore', 'correctAnswers', 'totalResponseTimeMs']
        const hasValidData = requiredFields.some(field => gameData[field] !== undefined)
        
        if (!hasValidData) {
            const errorMsg = 'Al menos un campo de actualización es requerido'
            setError(errorMsg)
            toast.error(errorMsg)
            setLoading(false)
            return { error: true, message: errorMsg }
        }

        try {
            const response = await endGame(gameId, gameData)

            setLoading(false)

            if (response.error) {
                const backendMessage = response.message || 'Error al finalizar la partida'
                toast.error(backendMessage)
                setError(backendMessage)
                return { error: true, message: backendMessage }
            }

            if (response.data?.success) {
                const message = response.data.message || 'Partida finalizada correctamente'
                toast.success(message)
                
                if (response.data.streak) {
                    const streakInfo = response.data.streak
                    toast.success(`🔥 Racha actual: ${streakInfo.currentStreak} días`, {
                        duration: 4000
                    })
                }
                
                return {
                    success: true,
                    game: response.data.data,
                    streak: response.data.streak,
                    message: message
                }
            }

            return response
        } catch (e) {
            setLoading(false)
            const errorMessage = e.response?.data?.message || e.message || 'Error al finalizar la partida'
            setError(errorMessage)
            toast.error(errorMessage)
            return { error: true, message: errorMessage }
        }
    }

    return {
        loading,
        error,
        sendRequest,
        endGame: sendRequest 
    }
}