import axios from "axios";

const apiClient=axios.create(
    {
        baseURL:`${import.meta.env.VITE_API_BACKEND}/auth`,
        timeout:2000
    }
)

apiClient.interceptors.request.use(
    (config)=>{
        
        const token=localStorage.getItem('token')
        if(token){
            config.headers.Authorization=token
        }
        return config
    }
)

apiClient.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
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