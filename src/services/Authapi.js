import axios from "axios";

const apiClient=axios.create(
    {
        baseURL:'http://localhost:2636/v1/',
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