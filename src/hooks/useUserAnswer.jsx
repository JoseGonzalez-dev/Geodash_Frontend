import { useState } from "react"
import { toast } from "sonner"
import { sendUserAnswers, sendGuestAnswer } from "../services/api"

export const useUserAnswer = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const sendRequest = async (answerData) => {
        
        setLoading(true)
        setError(null)

        if (!answerData.game || !answerData.question || !answerData.selectedOption) {
            const errorMsg = 'Partida, pregunta y opción seleccionada son requeridos'
            setError(errorMsg)
            toast.error(errorMsg)
            setLoading(false)
            return { error: true, message: errorMsg }
        }


        try {
            const response = await sendUserAnswers(answerData)
            
            setLoading(false)

            if (response.error) {
                const backendMessage = response.message || 'Error al registrar la respuesta';
                toast.error(backendMessage);
                setError(backendMessage)
                return { error: true, message: backendMessage }
            }

            if (response.data?.success) {
                return response.data
            }

            return response
        } catch (e) {
            
            setLoading(false)
            const errorMessage = e.response?.data?.message || e.message || 'Error al registrar la respuesta'
            setError(errorMessage)
            toast.error(errorMessage)
            return { error: true, message: errorMessage }
        }
    }
    const sendGuestRequest = async (guestAnswerData) => {
        setLoading(true)
        setError(null)

        // Validar campos requeridos para invitados
        if (!guestAnswerData.guestGameId || !guestAnswerData.question || !guestAnswerData.selectedOption) {
            const errorMsg = 'ID de partida de invitado, pregunta y opción seleccionada son requeridos'
            setError(errorMsg)
            toast.error(errorMsg)
            setLoading(false)
            return { error: true, message: errorMsg }
        }

        try {
            const response = await sendGuestAnswer(guestAnswerData)
            setLoading(false)

            if (response.error) {
                const backendMessage = response.message || 'Error al registrar respuesta de invitado';
                toast.error(backendMessage);
                setError(backendMessage)
                return { error: true, message: backendMessage }
            }

            // ✅ Manejar respuesta exitosa del backend
            if (response.data?.success) {
                toast.success(response.data.message || 'Respuesta registrada correctamente')
                
                // Mostrar mensaje de upgrade si es necesario
                if (response.data.upgradePrompt) {
                    toast.info(response.data.upgradePrompt)
                }
                
                return response.data
            }

            return response
        } catch (e) {
            setLoading(false)
            const errorMessage = e.response?.data?.message || e.message || 'Error al registrar respuesta de invitado'
            setError(errorMessage)
            toast.error(errorMessage)
            return { error: true, message: errorMessage }
        }
    }

    return {
        loading,
        error,
        sendRequest,        // Para usuarios registrados
        sendGuestRequest    // Para usuarios invitados
    }
}