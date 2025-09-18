import axios from "axios"
import { isTokenExpired, clearAuthData } from "../utils/tokenUtils"
const API_URL = import.meta.env.VITE_API_BACKEND

const apiClient = axios.create(
    {
        baseURL: API_URL,
        timeout: 2000
    }
)

apiClient.interceptors.request.use(
    (config)=>{
        
        const token=localStorage.getItem('token')
        if(token){
            // Verificar si el token ha expirado antes de enviar la petición
            if(isTokenExpired(token)){
                clearAuthData()
                // No agregar el token expirado a la petición
                return config
            }
            config.headers.Authorization=`Bearer ${token}`
        }
        return config
    }
)

apiClient.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        
        // Si el token expiró (401 Unauthorized), limpiar localStorage y redirigir
        if (error.response?.status === 401) {
            clearAuthData()
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

//Profile
export const getUserProfile = async () => {
    try {
        const response = await apiClient.get('/user/my-profile')
        return response
    } catch (e) {
        return {
            error: true,
            message: e.message,
            e: e
        }
    }
}