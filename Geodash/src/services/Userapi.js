import axios from "axios";

const apiClient=axios.create(
    {
        baseURL:'http://localhost:2636/v1/',
        timeout:10000
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

export const updateUserRequest = async(id,data)=>{
    try {
        return await apiClient.put(`user/update-employe/${id}`,data)
    } catch (e) {
        return{
            error:true,
            e
        }
    }
}

export const getUserRequest = async(id)=>{
    try {
        return await apiClient.get(`user/get-employe/${id}`)
    } catch (e) {
        return{
            error:true,
            e
        }
    }
}

export const changePasswordRequest = async(oldPass,newPass)=>{
    try {
        return await apiClient.put(`user/update-password`,{oldPassword:oldPass,newPassword:newPass})
    } catch (e) {
        return{
            error:true,
            e
        }
    }
}

export const getUsersRequest = async()=>{
    try {
        return await apiClient.get('user/get-employes')
    } catch (e) {
        return{
            error:true,
            e
        }
    }
}

export const addEmployeeRequest = async(employe)=>{
    try {
        return await apiClient.post('user/employe-register',employe)
    } catch (e) {
        return{
            error:true,
            e
        }
    }
}

export const deleteProfileRequest = async(id)=>{
    try {
        return await apiClient.delete(`user/delete-employe/${id}`)
    } catch (e) {
        return{
            error:true,
            e
        }
    }
}

export const usernameExistRequest = async(username)=>{
    try {
        return await apiClient.post(`user/username-exist`,{username:username})
    } catch (e) {
        return{
            error:true,
            e
        }
    }
}

export const emailExistRequest = async(email)=>{
    try {
        return await apiClient.post(`user/email-exist`,{email:email})
    } catch (e) {
        return{
            error:true,
            e
        }
    }
}