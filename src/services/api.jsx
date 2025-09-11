import axios from "axios"
const API_URL = import.meta.env.VITE_API_BACKEND

const apiClient = axios.create(
    {
        baseURL: API_URL,
        withCredentials: true,
        timeout: 2000
    }
)

//Racha
export const getMyStreak = async () => {
    try {
        return await apiClient.get('/v1/geobash/streak/my-streak')
    } catch (e) {
        return {
            error: true,
            message: e.message
        }
    }
}