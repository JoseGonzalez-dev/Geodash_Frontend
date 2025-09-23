
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { getMyStreak } from "../services/api"
import { validateAndCleanToken } from "../utils/tokenUtils"

export const useStreaks = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [streak, setStreak] = useState([])

    const fetchMyStreak = async() => {
        // Verificar token antes de hacer la petición
        const isTokenValid = validateAndCleanToken()
        if (!isTokenValid) {
            setError('Token expirado')
            setLoading(false)
            return false
        }

        setLoading(true)
        setError(null)
        try {
            const response = await getMyStreak()
            if (response.error) {
                const backendErrors = response.e?.response?.data?.errors
                const backendMessage = response.e?.response?.data?.msg
                if (backendErrors && Array.isArray(backendErrors)) {
                    backendErrors.forEach(err => toast.error(err.msg))
                } else if (backendMessage) {
                    toast.error(backendMessage)
                } else {
                    toast.error('Error desconocido al intentar obtener la racha')
                }
                setError(backendMessage || 'Error al obtener la racha')
                return false
            } else {
                setStreak(response.data.data || [])
                setLoading(false)
                return true
            }
        } catch (error) {
            setLoading(false)
            setError(error)
            console.error("Error fetching streak:", error)
            toast.error('Hubo un problema al conectar con el servidor')
            return false
        }
    }

    useEffect(() => {
        fetchMyStreak()
    }, [])
    
    return {
        loading,
        error,
        streak,
        fetchMyStreak
    }
}