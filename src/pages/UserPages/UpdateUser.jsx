import React, { useState, useEffect } from 'react'
import { useUser } from '../../shared/hooks/User/useUser.jsx'
import { DeleteUser } from './DeleteUser.jsx' 
import { Link } from 'react-router-dom';
import { StarsBackground } from '../../components/molecules/StarsBackground.jsx';
import { Input } from '../../components/Input.jsx';

export const UpdateUserPage = () => {
  const [initialData, setInitialData] = useState(null)
  const { getUser, updateUser, userData } = useUser()

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        await getUser(user.uid)
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error)
      }
    }
    loadUserData()
  }, [])

  useEffect(() => {
  if (userData) {
    setFormData({
      name: userData.name || "",
      surname: userData.surname || "",
      email: userData.email || "",
      username: userData.username || ""
    })
  }
}, [userData])

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    username: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    let id = JSON.parse(localStorage.getItem('user')).uid
    updateUser(id, formData)
  }
  
  const user = JSON.parse(localStorage.getItem("user"))
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
        <StarsBackground mode="atmosphere" />
      <h1 className="text-3xl text-center font-bold bg-gradient-to-r from-blue-400 via-cyan-500 to-green-400 bg-clip-text text-transparent drop-shadow-lg z-10">Edit Profile</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 z-10">
        <div>
          <label className="text-xl font-bold text-white text-center mb-10">Email</label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}

            className="w-full px-4 py-2 border rounded-md bg-gray-100"
          />
        </div>

        <div>
          <label className="text-xl font-bold text-white text-center mb-10">Name</label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md bg-gray-100"
            required
          />
        </div>

        <div>
          <label className="text-xl font-bold text-white text-center mb-10">Surname</label>
          <Input
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md bg-gray-100"
            required
          />
        </div>

        <div>
          <label className="text-xl font-bold text-white text-center mb-10">Username</label>
          <Input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md bg-gray-100"
          />
        </div>


         <div className="flex flex-wrap gap-4 justify-center pt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Actualizar
          </button>
          

          
          

          <Link to="/changePass">
            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Cambiar contraseña
            </button>
          </Link>
          <DeleteUser className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded" />
            <Link to="/game">
                <button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Regresar
                </button>
            </Link>
        </div>

      </form>
    </div>
    );
};