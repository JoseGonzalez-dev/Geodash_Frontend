import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export const Navigation = () => {
  const navigate = useNavigate()
  const location = useLocation()

  if (location.pathname === '/') return null // No mostrar en HomePage

  return (
    <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-20">
      <button
        onClick={() => navigate('/')}
        className="bg-gray-700/80 hover:bg-gray-600/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-colors border border-gray-600/50"
      >
        ← Inicio
      </button>
      
      <h1 
        className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-500 to-green-400 bg-clip-text text-transparent"
        style={{ fontFamily: 'Macondo, cursive' }}
      >
        GeoDash
      </h1>
      
      <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
        <span className="text-2xl">👤</span>
      </div>
    </div>
  )
}