import { useState } from "react";
import { addEmployeeRequest, changePasswordRequest, deleteProfileRequest, emailExistRequest, getUserRequest, getUsersRequest, updateUserRequest, usernameExistRequest } from "../../../src/services/Userapi.js"
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useUser=()=>{
    const [isLoading,setIsLoading]=useState(false)
    const [userData,setUserData]=useState(null)
    const [users,setUsers]=useState([])
    const [usernameMessage,setUserNameMessage]=useState('')
    const [emailMessage,setEmailMessage]=useState('')
    const navigate = useNavigate()
    const updateUser = async(id,data)=>{
        setIsLoading(true)
        const response = await updateUserRequest(id,data)
        console.log(response.e);
        
        
        if(response.error){
            return toast.error(
                response?.e?.response?.data?.message||
                'Error actualizando el perfil. Intente de nuevo'
            )
        }
        toast.success('Perfil actualizado exitosamente')
    }
    const getUser = async(id)=>{
        setIsLoading(true)
        const response = await getUserRequest(id)
        if(response.error){
            return toast.error(
                response?.e?.response?.data?.message||
                'Error cargando los datos del Usuario. Intente de nuevo'
            )
        }
        setUserData(response.data.message)
        setIsLoading(false)
    }
    const changePassword = async(oldPass,newPass)=>{
        setIsLoading(true)
        const response = await changePasswordRequest(oldPass,newPass)
        if(response.error){
            return toast.error(
                response?.e?.response?.data?.message||
                'Error Cambiando la Contraseña. Intente de nuevo'
            )
        }
        setIsLoading(false)
        toast.success('Contraseña actualizada exitosamente')
    }
    const getUsers = async()=>{
        setIsLoading(true)
        const response = await getUsersRequest()
        if(response.error){
            return toast.error(
                response?.e?.response?.data?.message||
                'Error Listando los Usuarios. Intente de nuevo'
            )
        }
        setUsers(response.data.message)
        setIsLoading(false)
    }
    const addEmployee = async(employee)=>{
        setIsLoading(true)
        const response = await addEmployeeRequest(employee)
        if(response.error){
            return toast.error(
                response?.e?.response?.data?.message||
                'Error Agregando el Empleado. Intente de nuevo'
            )
        }
        toast.success('Empleado creado exitosamente')
        setIsLoading(false)
    }

    const deleteProfile = async()=>{
        setIsLoading(true)
        let user = JSON.parse(localStorage.getItem('user'))
        const response = await deleteProfileRequest(user.uid)
        console.log(response.e);
        if(response.error){
            return toast.error(
                response?.e?.response?.data?.message||
                'Error Al Eliminar el Perfil. Intente de nuevo'
            )
        }
        localStorage.removeItem('token')
        localStorage.setItem('user',JSON.stringify(null))
        setIsLoading(false)
        navigate('/auth')
    }

    const usernameExist = async(username)=>{
        setIsLoading(true)
        const response = await usernameExistRequest(username)
        if(response.error){
            setUserNameMessage('El usuario escrito ya existe')
            return toast.error(
                response?.e?.response?.data?.message||
                'Error al verificar si el usuario ya existe. Intente de nuevo'
            )
        }else if(response.data.message === 'El Usuario no existe'){
            setUserNameMessage('')
        }
            
    }

    const emailExist = async(email)=>{
        setIsLoading(true)
        const response = await emailExistRequest(email)
        if(response.error){
            setEmailMessage('El email escrito ya existe')
            return toast.error(
                response?.e?.response?.data?.message||
                'Error al verificar si el email ya existe. Intente de nuevo'
            )
        }else if(response.data.message === 'El Email no existe'){
            setEmailMessage('')
        }
            
    }

    return{
        updateUser,
        isLoading,
        getUser,
        userData,
        changePassword,
        getUsers,
        users,
        setUsers,
        addEmployee,
        deleteProfile,
        usernameExist,
        usernameMessage,
        emailExist,
        emailMessage
    }
}