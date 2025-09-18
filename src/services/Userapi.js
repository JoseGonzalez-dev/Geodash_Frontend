import axios from "axios";
import { isTokenExpired, clearAuthData } from "../utils/tokenUtils";

const apiClient = axios.create(
    {
        baseURL: `${import.meta.env.VITE_API_BACKEND}/user/`,
        timeout: 10000
    }
)

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            // Verificar si el token ha expirado antes de enviar la petición
            if(isTokenExpired(token)){
                clearAuthData()
                // No agregar el token expirado a la petición
                return config
            }
            config.headers.Authorization = token
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

export const updateUserRequest = async (id, data) => {
    try {
        return await apiClient.put(`update-employe/${id}`, data)
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const getUserRequest = async (id) => {
    try {
        return await apiClient.get(`get-employe/${id}`)
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const changePasswordRequest = async (oldPass, newPass) => {
    try {
        return await apiClient.put(`update-password`, { oldPassword: oldPass, newPassword: newPass })
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const getUsersRequest = async () => {
    try {
        return await apiClient.get('get-employes')
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const addEmployeeRequest = async (employe) => {
    try {
        return await apiClient.post('employe-register', employe)
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const deleteProfileRequest = async (id) => {
    try {
        return await apiClient.delete(`delete-employe/${id}`)
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const usernameExistRequest = async (username) => {
    try {
        return await apiClient.post(`username-exist`, { username: username })
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const emailExistRequest = async (email) => {
    try {
        return await apiClient.post(`email-exist`, { email: email })
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}