import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isUserLoggedIn } from '../utils/userUtils'
import { useProfile } from '../hooks/useProfile'

export const ProfilePage = () => {
  const navigate = useNavigate()
  const { loading, profile } = useProfile()

  useEffect(() => {
    if (!isUserLoggedIn()) {
      navigate('/login')
    }
  }, [navigate])

  const user = profile?.user
  const trophies = profile?.trophies || { easy: 0, medium: 0, hard: 0 }
  const totalTrophies = Math.max((trophies.easy || 0) + (trophies.medium || 0) + (trophies.hard || 0), 1)

  const changePassword = () => {
    navigate('/changePass')
  }

  const updateProfile = () => {
    navigate('/updateUser')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 via-slate-900 to-black">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🌍</div>
          <p className="text-xl text-white">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-slate-900 to-black p-8 pt-25">
      <div className="max-w-4xl mx-auto">
        {/* Header del perfil */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/20">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl font-bold text-white">
              {user?.name ? user.name.charAt(0).toUpperCase() : '👤'}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {(user?.name || 'Usuario') + (user?.surname ? ` ${user.surname}` : '')}
              </h1>
              <p className="text-blue-200 text-lg">
                {user?.username || 'nickname'}
              </p>
              <p className="text-gray-300 text-sm mt-1">
                {user?.email || 'email@domain.com'}
              </p>
              {user?.date && (
                <p className="text-gray-400 text-xs mt-1">
                  Cuenta creada: {new Date(user.date).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          <div className="mt-6 flex space-x-4">
            <button
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-5 rounded-lg transition-colors duration-300 border border-white/20"
              onClick={updateProfile}
            >
              Actualizar perfil
            </button>
            <button
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-5 rounded-lg transition-colors duration-300 border border-white/20"
              onClick={changePassword}
            >
              Cambiar contraseña
            </button>
          </div>
        </div>

        {/* Estadísticas de trofeos */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="text-3xl mr-3">🏆</span>
            Mis Trofeos
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Explorador */}
            <div className="bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-xl p-6 border border-green-400/30">
              <div className="text-center">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="text-xl font-bold text-white mb-2">Explorador</h3>
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {trophies.easy}
                </div>
                <p className="text-green-200 text-sm">Nivel Fácil</p>
              </div>
            </div>

            {/* Viajero */}
            <div className="bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-xl p-6 border border-blue-400/30">
              <div className="text-center">
                <div className="text-4xl mb-3">✈️</div>
                <h3 className="text-xl font-bold text-white mb-2">Viajero</h3>
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {trophies.medium}
                </div>
                <p className="text-blue-200 text-sm">Nivel Medio</p>
              </div>
            </div>

            {/* Geógrafo */}
            <div className="bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-xl p-6 border border-purple-400/30">
              <div className="text-center">
                <div className="text-4xl mb-3">🏆</div>
                <h3 className="text-xl font-bold text-white mb-2">Geógrafo</h3>
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {trophies.hard}
                </div>
                <p className="text-purple-200 text-sm">Nivel Difícil</p>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Total de Trofeos: <span className="font-bold text-white">{totalTrophies}</span>
            </p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => navigate('/game')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            🎮 Jugar Ahora
          </button>
          
          <button
            onClick={() => navigate('/settings')}
            className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 border border-white/30"
          >
            ⚙️ Configuración
          </button>
        </div>
      </div>
    </div>
  )
}
