import { useState } from "react"
import { registerRequest } from "../../../services/Authapi.js"
import { toast} from 'sonner'
import { useNavigate } from "react-router-dom"


export const useRegister=()=>{
    const [isLoading,setIsLoading]=useState(false)
    const [error,setError]=useState(false)
    const navigate=useNavigate()

    const register=async(user)=>{
        setIsLoading(true)
        const response=await registerRequest(user)
        setIsLoading(false)
        
        if(response.error){
            setError(true)
            if(response?.e?.response?.data?.errors){
                const arrayErrors=response?.e?.response?.data?.errors
                for(const error of arrayErrors){
                    return  toast.error(error.msg)
                }
            }
            return toast.error(
                response?.e?.response?.data?.msg ||
                response?.e?.data?.msg ||
                'Error al intentar registrarte. Intenta de nuevo'
            )
        }
        setError(false)
        toast.success('Registro exitoso, ya puedes iniciar sesión')
        navigate('/login')
    }
    return{
        register,
        isLoading,
        error,
        setError
    }
}