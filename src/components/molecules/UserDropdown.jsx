import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUserId, isUserLoggedIn } from '../../utils/userUtils'

export const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState(null)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Cargar información del usuario desde localStorage
    const loadUser = () => {
      if (isUserLoggedIn()) {
        try {
          const userData = localStorage.getItem('user')
          if (userData) {
            setUser(JSON.parse(userData))
          }
        } catch (error) {
          console.error('Error cargando datos del usuario:', error)
        }
      }
    }

    loadUser()
  }, [])

  useEffect(() => {
    // Cerrar dropdown al hacer clic fuera
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    // Limpiar datos del usuario
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('geodash_game_stats') // Limpiar también las estadísticas
    
    // Redirigir al login
    navigate('/login')
    setIsOpen(false)
  }

  const handleProfile = () => {
    navigate('/profile')
    setIsOpen(false)
  }

  const handleSettings = () => {
    navigate('/settings')
    setIsOpen(false)
  }

  if (!isUserLoggedIn()) {
    return null
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar clickeable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg"
      >
        <span className="text-2xl">
          {user?.name ? user.name.charAt(0).toUpperCase() : '👤'}
        </span>
      </button>

      {/* Menú desplegable */}
      {isOpen && (
        <div className="absolute right-0 top-14 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200/50 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
          {/* Header del usuario */}
          <div className="px-4 py-3 border-b border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-white">
                  {user?.name ? user.name.charAt(0).toUpperCase() : '👤'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name || 'Usuario'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.username || 'usuario@ejemplo.com'}
                </p>
              </div>
            </div>
          </div>

          {/* Opciones del menú */}
          <div className="py-2">
            <button
              onClick={handleProfile}
              className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 flex items-center space-x-3"
            >
              <span className="text-lg">👤</span>
              <span>Mi Perfil</span>
            </button>

            <button
              onClick={handleSettings}
              className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 flex items-center space-x-3"
            >
              <span className="text-lg">⚙️</span>
              <span>Configuración</span>
            </button>

            <button
              onClick={() => navigate('/stats')}
              className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 flex items-center space-x-3"
            >
              <span className="text-lg">📊</span>
              <span>Estadísticas</span>
            </button>

            <div className="border-t border-gray-200/50 my-2"></div>

            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 flex items-center space-x-3"
            >
              <span className="text-lg">🚪</span>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

