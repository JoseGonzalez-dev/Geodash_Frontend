import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginRequest } from "../../../services/Authapi.js"
import { toast} from 'sonner'


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
        navigate('/game')
    }
    return{
        login,
        isLoading
    }
}