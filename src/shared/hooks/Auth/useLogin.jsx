import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginRequest } from "../../../services/Authapi.js"
import toast from "react-hot-toast"


export const useLogin=()=>{
    const [isLoading,setIsLoading]=useState(false)
    const navigate=useNavigate()

    const login=async(userLogin,password)=>{
        setIsLoading(true)
        const user={
            userLogin,
            password
        }

        const response=await loginRequest(user)
        setIsLoading
        
        
        if(response.error){
            return toast.error(
                response?.e?.response?.data?.message||
                'Error al intentar inciar sesión. Intente de nuevo'
            )
        }
        localStorage.setItem('user',JSON.stringify(response?.data?.loggedUser))
        localStorage.setItem('token', response?.data?.token);

        navigate('/login')
    }
    return{
        login,
        isLoading
    }
}