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
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-slate-900 to-black pt-20 sm:pt-24 lg:pt-28 xl:pt-32 2xl:pt-36 px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto">
        {/* Header del perfil */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-6 xl:p-7 2xl:p-8 mb-6 sm:mb-8 border border-white/20">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-24 lg:h-24 xl:w-28 xl:h-28 2xl:w-32 2xl:h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl sm:text-4xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-white">
              {user?.name ? user.name.charAt(0).toUpperCase() : '👤'}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl 2xl:text-4xl font-bold text-white mb-2">
                {(user?.name || 'Usuario') + (user?.surname ? ` ${user.surname}` : '')}
              </h1>
              <p className="text-blue-200 text-base sm:text-lg lg:text-lg xl:text-xl 2xl:text-xl">
                {user?.username || 'nickname'}
              </p>
              <p className="text-gray-300 text-sm lg:text-base xl:text-base 2xl:text-lg mt-1">
                {user?.email || 'email@domain.com'}
              </p>
              {user?.date && (
                <p className="text-gray-400 text-xs lg:text-sm xl:text-sm 2xl:text-base mt-1">
                  Cuenta creada: {new Date(user.date).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2 sm:py-3 lg:py-3 xl:py-4 2xl:py-4 px-4 sm:px-6 lg:px-6 xl:px-7 2xl:px-8 rounded-lg transition-colors duration-300 border border-white/20 text-sm sm:text-base lg:text-base xl:text-lg 2xl:text-lg"
              onClick={updateProfile}
            >
              Actualizar perfil
            </button>
            <button
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2 sm:py-3 lg:py-3 xl:py-4 2xl:py-4 px-4 sm:px-6 lg:px-6 xl:px-7 2xl:px-8 rounded-lg transition-colors duration-300 border border-white/20 text-sm sm:text-base lg:text-base xl:text-lg 2xl:text-lg"
              onClick={changePassword}
            >
              Cambiar contraseña
            </button>
          </div>
        </div>

        {/* Estadísticas de trofeos */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center justify-center sm:justify-start">
            <span className="text-2xl sm:text-3xl mr-2 sm:mr-3">🏆</span>
            Mis Trofeos
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Explorador */}
            <div className="bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-xl p-4 sm:p-6 border border-green-400/30">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🔍</div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Explorador</h3>
                <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-2">
                  {trophies.easy}
                </div>
                <p className="text-green-200 text-xs sm:text-sm">Nivel Fácil</p>
              </div>
            </div>

            {/* Viajero */}
            <div className="bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-xl p-4 sm:p-6 border border-blue-400/30">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">✈️</div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Viajero</h3>
                <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-2">
                  {trophies.medium}
                </div>
                <p className="text-blue-200 text-xs sm:text-sm">Nivel Medio</p>
              </div>
            </div>

            {/* Geógrafo */}
            <div className="bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-xl p-4 sm:p-6 border border-purple-400/30 sm:col-span-2 lg:col-span-1">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🏆</div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Geógrafo</h3>
                <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-2">
                  {trophies.hard}
                </div>
                <p className="text-purple-200 text-xs sm:text-sm">Nivel Difícil</p>
              </div>
            </div>
          </div>
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-gray-300 text-sm sm:text-base">
              Total de Trofeos: <span className="font-bold text-white text-lg sm:text-xl">{totalTrophies}</span>
            </p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button
            onClick={() => navigate('/game')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg text-sm sm:text-base"
          >
            🎮 Jugar Ahora
          </button>
          
          <button
            onClick={() => navigate('/settings')}
            className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 border border-white/30 text-sm sm:text-base"
          >
            ⚙️ Configuración
          </button>
        </div>
      </div>
    </div>
  )
}
