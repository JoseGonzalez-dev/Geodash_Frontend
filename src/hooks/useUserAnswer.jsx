import { useState } from "react"
import { toast } from "sonner"
import { sendUserAnswers, sendGuestAnswer } from "../services/api"

export const useUserAnswer = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const sendRequest = async (answerData) => {
        console.log('💾 [useUserAnswer] Iniciando guardado de respuesta...')
        console.log('📊 [useUserAnswer] Datos recibidos:', answerData)
        
        setLoading(true)
        setError(null)

        // Validar campos requeridos según el controlador
        if (!answerData.game || !answerData.question || !answerData.selectedOption) {
            const errorMsg = 'Partida, pregunta y opción seleccionada son requeridos'
            console.error('❌ [useUserAnswer] Validación fallida:', {
                game: answerData.game,
                question: answerData.question,
                selectedOption: answerData.selectedOption
            })
            setError(errorMsg)
            toast.error(errorMsg)
            setLoading(false)
            return { error: true, message: errorMsg }
        }

        console.log('✅ [useUserAnswer] Validación exitosa, enviando al backend...')

        try {
            console.log('🔄 [useUserAnswer] Llamando sendUserAnswers con:', answerData)
            const response = await sendUserAnswers(answerData)
            console.log('📦 [useUserAnswer] Respuesta completa del backend:', response)
            
            setLoading(false)

            if (response.error) {
                const backendMessage = response.message || 'Error al registrar la respuesta';
                console.error('❌ [useUserAnswer] Error en respuesta:', response)
                toast.error(backendMessage);
                setError(backendMessage)
                return { error: true, message: backendMessage }
            }

            // ✅ Manejar respuesta exitosa del backend
            if (response.data?.success) {
                console.log('🎉 [useUserAnswer] Respuesta guardada exitosamente:', response.data)
                toast.success(response.data.message || 'Respuesta registrada correctamente')
                return response.data
            }

            console.log('⚠️ [useUserAnswer] Respuesta inesperada:', response)
            return response
        } catch (e) {
            console.error('💥 [useUserAnswer] Error capturado:', e)
            console.error('💥 [useUserAnswer] Error response:', e.response)
            console.error('💥 [useUserAnswer] Error data:', e.response?.data)
            
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