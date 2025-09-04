import React, { useState } from 'react'
import { Input } from '../Input'
import {  emailValidationMessage, nameValidationMessage, passConfirmValidationMessage, passwordValidationMessage, 
  surnameValidationMessage, usernameValidationMessage, 
    validateEmail, 
    validateName, 
    validatePassConfirm, 
    validatePassword, 
    validateSurname,
    validateUsername} from '../../shared/validators/validators'
import { useRegister } from '../../shared/hooks/Auth/useRegister'
import { useUser } from '../../shared/hooks/User/useUser'
import { StarsBackground } from '../molecules/StarsBackground'

export const Register = ({ switchAuthHandler }) => {
    const form = {
        name: {
            value: '',
            isValid: false,
            showError: false
        },
        surname: {
            value: '',
            isValid: false,
            showError: false
        },
        email: {
            value: '',
            isValid: false,
            showError: false
        },
        username: {
            value: '',
            isValid: false,
            showError: false
        },
        password: {
            value: '',
            isValid: false,
            showError: false
        },
        confirmPassword: {
            value: '',
            isValid: false,
            showError: false
        }
    }
    const {emailExist,emailMessage,usernameExist,usernameMessage}=useUser()
    const [formData, setFormData] = useState(form)
    const { register } = useRegister()
    const isSubmitButtonDisable = !formData.email.isValid ||
                                  !formData.surname.isValid ||
                                  !formData.username.isValid ||
                                  !formData.password.isValid 
                                  !formData.confirmPassword.isValid 

    const handleSubmit = (event) => {
    event.preventDefault()
    
    const data = new FormData()
    data.append('name', formData.name.value)
    data.append('surname', formData.surname.value)
    data.append('email', formData.email.value)
    data.append('username', formData.username.value)
    data.append('password', formData.password.value)
    data.append('confirmPassword', formData.confirmPassword.value)
    register(data)
}


    const handleValidationOnBlur=(value,field)=>{
        let isValid=false
        switch(field){
            case 'name':
                isValid=validateName(value)
                break;
            case 'surname':
                isValid=validateSurname(value)
                break;
            case 'email':
                isValid=validateEmail(value)
                emailExist(value)
                break;
            case 'username':
                isValid = validateUsername(value)
                usernameExist(value)
                break
            case 'password':
                isValid = validatePassword(value)
                break
            case 'confirmPassword':
                isValid = validatePassConfirm(formData.password.value, value)
                break;
            default:
                break;
        }
        setFormData((prevData)=>(
        {
                ...prevData,
                [field]:{
                    ...prevData[field],
                    isValid,
                    showError:!isValid
                }
        }
        ))
    }

    const handleValueChange = (value, field) => {
    setFormData((prevData) => ({
        ...prevData,
        [field]: {
            ...prevData[field],
            value
        }
    }))
}

    return (
            <div className="w-full flex items-center justify-center bg-blue-800">
                <StarsBackground mode="space" />
                <div className="max-w-md w-full py-12 rounded-md z-10">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl text-center font-bold bg-gradient-to-r from-blue-400 via-cyan-500 to-green-400 bg-clip-text text-transparent drop-shadow-lg">Register</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
                        <div>
                            <label className="text-xl font-bold text-white text-center mb-10">Email</label>
                            <Input 
                                field='email'
                                value={formData.email.value}
                                onChangeHandler={handleValueChange}
                                placeholder={formData.email.value}
                                type='email'
                                onBlurHandler={handleValidationOnBlur}
                                showErrorMessage={formData.email.showError}
                                validationMessage={emailValidationMessage}
                                
                            />
                        </div>
                        <div className="flex gap-4 mb-4">
                            <div className='flex flex-col'>
                                <label className="text-xl font-bold text-white text-center mb-4">Name</label>
                            <Input
                                field='name'
                                value={formData.name.value}
                                onChangeHandler={handleValueChange}
                                placeholder={formData.name.value}
                                type='text'
                                onBlurHandler={handleValidationOnBlur}
                                showErrorMessage={formData.name.showError}
                                validationMessage={nameValidationMessage}
                            />
                            </div>
                            <div className='flex flex-col'>
                              <label className="text-xl font-bold text-white text-center mb-4">Surname</label>
                            <Input
                                field='surname'
                                value={formData.surname.value}
                                onChangeHandler={handleValueChange}
                                placeholder={formData.surname.value}
                                type='text'
                                onBlurHandler={handleValidationOnBlur}
                                showErrorMessage={formData.surname.showError}
                                validationMessage={surnameValidationMessage}
                                className="flex-1 p-2 box-border border border-gray-300 rounded"
                            />   
                            </div>
                        </div>
                        <div>
                            <label className="text-xl font-bold text-white text-center mb-10">Username</label>
                            <Input 
                                field='username'
                                value={formData.username.value}
                                onChangeHandler={handleValueChange}
                                placeholder={formData.username.value}
                                type='username'
                                onBlurHandler={handleValidationOnBlur}
                                showErrorMessage={formData.username.showError}
                                validationMessage={usernameValidationMessage}
                                
                            />
                        </div>
                        <div>
                            <label className="text-xl font-bold text-white text-center mb-10">Password</label>
                            <Input 
                                field='password'
                                onChangeHandler={handleValueChange}
                                value={formData.password.value} 
                                type='password'
                                onBlurHandler={handleValidationOnBlur}
                                showErrorMessage={formData.password.showError}
                                validationMessage={passwordValidationMessage}
                            />
                        </div>
                        <div>
                            <label className="text-xl font-bold text-white text-center mb-10">Password Confirmation</label>
                            <Input 
                                field='confirmPassword'
                                onChangeHandler={handleValueChange}
                                value={formData.confirmPassword.value} 
                                type='password'
                                onBlurHandler={handleValidationOnBlur}
                                showErrorMessage={formData.confirmPassword.showError}
                                validationMessage={passConfirmValidationMessage}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitButtonDisable}
                            className={`w-full py-2 rounded-md text-white font-bold transition ${
                                isSubmitButtonDisable
                                    ? 'bg-blue-800 cursor-not-allowed'
                                    : 'bg-blue-700 hover:bg-green-800 text-white font-bold'
                            }`}
                        >
                            Registrar
                        </button>
                        <button className="w-full bg-blue-800 hover:bg-green-800 text-white font-bold py-2 px-4 mb-6 rounded">
                            Iniciar Sesión
                        </button>
                    </form>

                    
                </div>
            </div>
    )
}