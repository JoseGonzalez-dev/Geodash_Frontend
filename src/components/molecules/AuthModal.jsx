import React from 'react'

export const AuthModal = ({ isOpen, onClose, onLogin, onRegister }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-gray-900 via-blue-900/50 to-purple-900/50 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full mx-4 border border-gray-600/50 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🚀</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            ¡Únete a la aventura!
          </h2>
          <p className="text-gray-300 text-sm">
            Regístrate o inicia sesión para guardar tu progreso y competir en las rachas globales
          </p>
        </div>

        {/* Benefits */}
        <div className="mb-8 space-y-3">
          <div className="flex items-center space-x-3 text-sm text-gray-200">
            <span className="text-green-400">✓</span>
            <span>Guarda tu progreso automáticamente</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-200">
            <span className="text-green-400">✓</span>
            <span>Compite en rachas globales</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-200">
            <span className="text-green-400">✓</span>
            <span>Desbloquea logros y estadísticas</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-200">
            <span className="text-green-400">✓</span>
            <span>Accede desde cualquier dispositivo</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <button
            onClick={onRegister}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Crear cuenta gratis
          </button>
          
          <button
            onClick={onLogin}
            className="w-full bg-gray-700/50 hover:bg-gray-600/50 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 border border-gray-600/50 hover:border-gray-500/50"
          >
            Ya tengo cuenta
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 text-sm transition-colors duration-200"
          >
            Continuar sin cuenta
          </button>
        </div>
      </div>
    </div>
  )
}