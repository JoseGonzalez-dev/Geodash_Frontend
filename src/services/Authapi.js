import axios from "axios";

const apiClient=axios.create(
    {
        baseURL:'http://localhost:6002/api/v1/geobash/',
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
        return await apiClient.post('auth/login',user)
    }catch(e){
        return{
            error:true,
            e
        }
    }
}

export const registerRequest=async(user)=>{
    try{
        return await apiClient.post('auth/register',user)
    }catch(e){
        return{
            error:true,
            e
        }
    }
}