import { useState } from 'react'
import { useUser } from '../../shared/hooks/User/useUser'
import { StarsBackground } from '../../components/molecules/StarsBackground'
import { Link } from 'react-router-dom';    

export const ChangePassword = () => {
    const [passwordMessage, setPasswordMessage] = useState('')
    const { changePassword } = useUser()
    const [disabled, setDisabled] = useState(true)
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        changePassword(formData.oldPassword, formData.newPassword)
    }

    const handlePasswordConfirmation = async () => {
        if (formData.newPassword === formData.confirmPassword) {
            setPasswordMessage('')
            setDisabled(false)
        } else {
            setPasswordMessage('La contraseña no coincide')
            setDisabled(true)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <StarsBackground mode='atmosphere' />
            <div className="w-full max-w-md p-8 rounded-md z-10">
                <h1 className="text-3xl text-center font-bold bg-gradient-to-r from-blue-400 via-cyan-500 to-green-400 bg-clip-text text-transparent drop-shadow-lg">Change Password</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xl font-bold text-white text-center mb-10">Contraseña Actual:</label>
                        <input
                            type="password"
                            name="oldPassword"
                            value={formData.oldPassword}
                            onChange={handleChange}
                            className="w-full rounded-md bg-gray-800/90  text-white px-4 py-2 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-xl font-bold text-white text-center mb-10">Nueva Contraseña:</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                            className="w-full rounded-md bg-gray-800/90  text-white px-4 py-2 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-xl font-bold text-white text-center mb-10">Confirmar Nueva Contraseña:</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onBlur={handlePasswordConfirmation}
                            required
                            className="w-full rounded-md bg-gray-800/90  text-white px-4 py-2 focus:outline-none"
                        />
                        {passwordMessage && (
                            <span className="text-sm text-red-500">{passwordMessage}</span>
                        )}
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={disabled}
                            className="bg-blue-700 text-white px-6 py-2 rounded-md hover:bg-sky-500 disabled:opacity-50 transition"
                        >
                            Cambiar Contraseña
                        </button>
                    </div>
                    <div className="flex justify-center">
                        <Link to="/updateUser">
                        <button className="bg-blue-700 text-white px-6 py-2 rounded-md hover:bg-sky-500 disabled:opacity-50 transition">
                            Regresar
                        </button>
                        </Link>
                        
                    </div>
                </form>
            </div>
        </div>
    )

}