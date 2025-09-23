import axios from "axios";
import { isTokenExpired, clearAuthData } from "../utils/tokenUtils";

const apiClient = axios.create(
    {
        baseURL: 'http://localhost:6002/api/v1/geobash/',
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
        return await apiClient.put(`user/update/${id}`, data)
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const getUserRequest = async (id) => {
    try {
        return await apiClient.get(`user/user/${id}`)
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const changePasswordRequest = async (oldPass, newPass) => {
    try {
        return await apiClient.put(`user/updatePassword`, { oldPassword: oldPass, newPassword: newPass })
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const getUsersRequest = async () => {
    try {
        return await apiClient.get('user/get-employes')
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const addEmployeeRequest = async (employe) => {
    try {
        return await apiClient.post('auth/register', employe)
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const deleteProfileRequest = async (id) => {
    try {
        return await apiClient.delete(`user/delete/${id}`)
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const usernameExistRequest = async (username) => {
    try {
        return await apiClient.post(`user/username-exist`, { username: username })
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const emailExistRequest = async (email) => {
    try {
        return await apiClient.post(`user/email-exist`, { email: email })
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}