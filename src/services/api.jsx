import axios from "axios"
const API_URL = import.meta.env.VITE_API_BACKEND

const apiClient = axios.create(
    {
        baseURL: API_URL,
        timeout: 2000
    }
)

apiClient.interceptors.request.use(
    (config)=>{
        console.log('🔄 Petición HTTP:', {
            method: config.method?.toUpperCase(),
            url: config.baseURL + config.url,
            data: config.data
        })
        
        const token=localStorage.getItem('token')
        if(token){
            config.headers.Authorization=`Bearer ${token}`
        }
        return config
    }
)

apiClient.interceptors.response.use(
    (response) => {
        console.log('✅ Respuesta exitosa:', {
            status: response.status,
            data: response.data
        })
        return response
    },
    (error) => {
        console.log('❌ Error en petición:', {
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
            data: error.response?.data
        })
        
        // Si el token expiró (401 Unauthorized), limpiar localStorage y redirigir
        if (error.response?.status === 401) {
            console.log('🔑 Token expirado, redirigiendo a login...')
            localStorage.removeItem('token')
            localStorage.removeItem('user') // por si guardas info del usuario
            window.location.href = '/login'
        }
        
        return Promise.reject(error)
    }
)

//Racha
export const getMyStreak = async () => {
    try {
        return await apiClient.get('/streak/my-streak')
    } catch (e) {
        return {
            error: true,
            message: e.message
        }
    }
}

//Game-Mode
export const createGame = async (data) => {
    try {
        const response = await apiClient.post('/game/', data)
        console.log('✅ [API] createGame respuesta exitosa:', response);
        return response
        
    } catch (e) {
        return {
            error: true,
            message: e.message,
            e: e
        }
    }
}

export const endGame = async (gameId, data) => {
    try {
        const response = await apiClient.put(`/game/${gameId}`, {
            endDate: data.endDate,
            totalScore: data.totalScore,
            correctAnswers: data.correctAnswers,
            totalResponseTimeMs: data.totalResponseTimeMs
        })
        return response
    } catch (e) {
        return {
            error: true,
            message: e.message,
            e: e
        }
    }
}

//User Answers
export const sendUserAnswers = async (data) => {
    try {
        const response = await apiClient.post('/user_Answer/create', data)
        return response
    } catch (e) {
        return {
            error: true,
            message: e.message,
            e: e
        }
    }
}

export const sendGuestAnswer = async (data) => {
    try {
        const response = await apiClient.post('/user_Answer/guest', data)
        return response
    } catch (e) {
        return {
            error: true,
            message: e.message,
            e: e
        }
    }
}