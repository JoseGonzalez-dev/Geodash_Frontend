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

        console.log('🚀 Iniciando petición de login:', user)
        console.log('📡 URL de la API:', `${import.meta.env.VITE_API_BACKEND}/auth/login`)
        
        const response=await loginRequest(user)
        console.log('📥 Respuesta del login:', response)
        setIsLoading(false)
        
        
        if(response.error){
            toast.error(
                response?.e?.response?.data?.message||
                'Error al intentar inciar sesión. Intente de nuevo'
            )
            return
        }
        
        localStorage.setItem('user',JSON.stringify(response?.data?.loggedUser))
        localStorage.setItem('token', response?.data?.token);
        
        toast.success('Login exitoso')
        navigate('/game-mode')
    }
    return{
        login,
        isLoading
    }
}