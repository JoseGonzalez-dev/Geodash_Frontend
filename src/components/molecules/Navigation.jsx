import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export const Navigation = () => {
  const navigate = useNavigate()
  const location = useLocation()

  if (location.pathname === '/') return null // No mostrar en HomePage

  const {text, path} = (() => {
    let text = '← Inicio'
    let path = '/'

    if (location.pathname.startsWith('/game/') && location.pathname !== '/game') {
      text = '← Regresar'
      path = '/game'
    }

    return { text, path }
  })()


  return (
    <div className="absolute top-4 sm:top-6 md:top-8 lg:top-8 xl:top-10 2xl:top-12 left-4 sm:left-6 md:left-8 lg:left-8 xl:left-10 2xl:left-12 right-4 sm:right-6 md:right-8 lg:right-8 xl:right-10 2xl:right-12 flex justify-between items-center z-20">
      <button
        onClick={() => navigate(path)}
        className="bg-gray-700/80 hover:bg-gray-600/80 backdrop-blur-sm text-white px-3 py-2 sm:px-4 sm:py-2 md:px-5 md:py-3 lg:px-5 lg:py-3 xl:px-6 xl:py-3 2xl:px-6 2xl:py-3 rounded-lg transition-colors border border-gray-600/50 text-sm sm:text-base lg:text-base xl:text-base 2xl:text-lg"
      >
        <span className="md:hidden">←</span>
        <span className="hidden md:inline">{text}</span>
      </button>
      
      <h1 
        className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl 2xl:text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-500 to-green-400 bg-clip-text text-transparent text-center flex-1 mx-4"
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