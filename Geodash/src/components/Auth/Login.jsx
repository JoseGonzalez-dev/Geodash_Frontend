import React, { useState } from "react";
import { validateEmailOrUsername, validatePassword } from "../../../../shared/validators/validators.js"
import { useLogin } from "../../../shared/hooks/Auth/useLogin.jsx"
import { Input } from "../../components/Input.jsx"

export const Login = ({ switchAuthHandler }) => {
    const { login } = useLogin();
    const [formData, setFormData] = useState({
        userLogin: { value: '', isValid: false, showError: false },
        password: { value: '', isValid: false, showError: false }
    });

    const isSubmitButtonDisable = !formData.userLogin.isValid || !formData.password.isValid;

    const onValueChange = (value, field) => {
        setFormData(prevData => ({
            ...prevData,
            [field]: { ...prevData[field], value }
        }));
    };

    const handleValidationOnBlur = (value, field) => {
        let isValid = false;
        switch (field) {
            case 'userLogin':
                isValid = validateEmailOrUsername(value);
                break;
            case 'password':
                isValid = validatePassword(value);
                break;
            default:
                break;
        }
        setFormData(prevData => ({
            ...prevData,
            [field]: { ...prevData[field], isValid, showError: !isValid }
        }));
    };

    const handleLogin = (e) => {
        e.preventDefault();
        login(formData.userLogin.value, formData.password.value);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-900">
            <div className="p-8 bg-blue-600 rounded-lg shadow-xl w-full max-w-md">
                 <h1 className="text-4xl font-bold text-green-400 text-center mb-10">Login</h1>
                    <div className="text-center mb-6">
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label htmlFor="" className="text-xl font-bold text-white text-center mb-10">Username</label>
                            <Input
                            field="userLogin"
                            value={formData.userLogin.value}
                            onChangeHandler={onValueChange}
                            type="text"
                            onBlurHandler={handleValidationOnBlur}
                            showErrorMessage={formData.userLogin.showError}
                        />
                        </div>
                        <div>
                            <label htmlFor="" className="text-xl font-bold text-white text-center mb-10">Password</label>
                          <Input
                            field="password"
                            onChangeHandler={onValueChange}
                            value={formData.password.value}
                            type="password"
                            onBlurHandler={handleValidationOnBlur}
                            showErrorMessage={formData.password.showError}
                        />  
                        </div>
                        


                        <button
                            disabled={isSubmitButtonDisable}
                            className={`w-full py-2 rounded-md text-white transition ${
                                isSubmitButtonDisable
                                    ? 'bg-blue-800 cursor-not-allowed'
                                    : 'bg-blue-700 hover:bg-green-800 text-white font-bold'
                            }`}
                        >
                            Login
                        </button>
                        <button className="w-full bg-blue-700 hover:bg-green-800 text-white font-bold py-2 px-4 mb-6 rounded">
                        Create Account
                    </button>
                    </form>

                    
            </div>
        </div>
    );
};