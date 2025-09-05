import axios from "axios";

const apiClient=axios.create(
    {
        baseURL:`${import.meta.env.VITE_API_BACKEND}/auth`,
        timeout:2000
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
            config.headers.Authorization=token
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
        return Promise.reject(error)
    }
)

export const loginRequest=async(user)=>{
    try{
        return await apiClient.post('login',user)
    }catch(e){
        return{
            error:true,
            e
        }
    }
}

export const registerRequest=async(user)=>{
    try{
        return await apiClient.post('register',user)
    }catch(e){
        return{
            error:true,
            e
        }
    }
}