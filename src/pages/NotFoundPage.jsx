import React from 'react'
import { useNavigate } from 'react-router-dom'
import { StarsBackground } from '../components/molecules/StarsBackground'

export const NotFoundPage = () => {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/')
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <StarsBackground mode="space" />
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Animación de la Tierra */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="text-9xl md:text-[12rem] animate-spin" style={{ animationDuration: '20s' }}>
              🌍
            </div>
            {/* Satélites orbitando */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border border-white/20 rounded-full animate-spin" style={{ animationDuration: '8s' }}>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 text-2xl">🛰️</div>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 border border-white/10 rounded-full animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }}>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 text-xl">🛸</div>
              </div>
            </div>
          </div>
        </div>

        {/* Título principal */}
        <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-500 to-green-400 bg-clip-text text-transparent">
          404
        </h1>
        
        {/* Subtítulo */}
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
          ¡Ups! Página no encontrada
        </h2>
        
        {/* Descripción */}
        <p className="text-lg md:text-xl text-blue-200 mb-8 max-w-2xl mx-auto leading-relaxed">
          Parece que te has perdido en el espacio. La página que buscas no existe en nuestro universo.
        </p>

        {/* Información adicional */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20 max-w-2xl mx-auto">
          <div className="flex items-center justify-center mb-4">
            <span className="text-3xl mr-3">🔍</span>
            <h3 className="text-xl font-bold text-white">¿Qué puedes hacer?</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🏠</span>
              <div>
                <p className="text-white font-semibold">Ir al inicio</p>
                <p className="text-blue-200 text-sm">Regresa a la página principal</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">⬅️</span>
              <div>
                <p className="text-white font-semibold">Volver atrás</p>
                <p className="text-blue-200 text-sm">Regresa a la página anterior</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🎮</span>
              <div>
                <p className="text-white font-semibold">Jugar</p>
                <p className="text-blue-200 text-sm">Explora nuestros juegos</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">📞</span>
              <div>
                <p className="text-white font-semibold">Contacto</p>
                <p className="text-blue-200 text-sm">Reporta el problema</p>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleGoHome}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <span className="text-2xl">🏠</span>
            <span>Ir al Inicio</span>
          </button>
          
          <button
            onClick={handleGoBack}
            className="bg-white/20 hover:bg-white/30 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 border border-white/30 flex items-center space-x-2"
          >
            <span className="text-2xl">⬅️</span>
            <span>Volver Atrás</span>
          </button>
          
          <button
            onClick={() => navigate('/game')}
            className="bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <span className="text-2xl">🎮</span>
            <span>Jugar Ahora</span>
          </button>
        </div>

        {/* Información técnica */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            Error 404 - Página no encontrada
          </p>
          <p className="text-gray-500 text-xs mt-1">
            GeoDash v1.0 - Explorando el universo de la geografía
          </p>
        </div>
      </div>

      {/* Efectos de partículas adicionales */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-40" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse opacity-50" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-30" style={{ animationDelay: '0.5s' }}></div>
      </div>
    </div>
  )
}

