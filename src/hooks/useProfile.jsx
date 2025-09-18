import { useEffect, useState } from "react"
import { toast } from "sonner"
import { getUserProfile } from "../services/api"

export const useProfile = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [profile, setProfile] = useState([])

    const fetchUserProfile = async() => {
        setLoading(true)
        setError(null)
        try {
            const response = await getUserProfile()
            if (response.error) {
                const backendErrors = response.e?.response?.data?.errors
                const backendMessage = response.e?.response?.data?.msg
                if (backendErrors && Array.isArray(backendErrors)) {
                    backendErrors.forEach(err => toast.error(err.msg))
                } else if (backendMessage) {
                    toast.error(backendMessage)
                } else {
                    toast.error('Error desconocido al intentar obtener el perfil')
                }
                setError(backendMessage || 'Error al obtener el perfil')
                return false
            } else {
                setProfile(response.data.data || [])
                setLoading(false)
                return true
            }
        } catch (error) {
            setLoading(false)
            setError(error)
            console.error("Error fetching profile:", error)
            toast.error('Hubo un problema al conectar con el servidor')
            return false
        }
    }
    useEffect(() => {
        fetchUserProfile()
    }, [])
    
    return {
        loading,
        error,
        profile,
        fetchUserProfile
    }
}