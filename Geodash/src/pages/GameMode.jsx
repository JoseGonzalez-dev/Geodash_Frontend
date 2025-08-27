import React from 'react'
import { useNavigate } from 'react-router-dom'

export const GameMode = () => {
  const navigate = useNavigate()

  const gameCards = [
    {
      id: 'explorer',
      title: '🔍 Explorador',
      score: '0/10',
      color: 'from-green-400 to-green-600',
      buttonColor: 'bg-green-200 hover:bg-green-600'
    },
    {
      id: 'traveler',
      title: '✈️ Viajero',
      score: '0/10',
      color: 'from-blue-400 to-blue-600',
      buttonColor: 'bg-yellow-200 hover:bg-yellow-600'
    },
    {
      id: 'geographer',
      title: '🏆 Geógrafo',
      score: '0/10',
      color: 'from-purple-400 to-purple-600',
      buttonColor: 'bg-red-200 hover:bg-red-600'
    }
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white p-8">


      {/* Cards de juego */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full mt-0">
        {gameCards.map((card) => (
          <div key={card.id} className="relative group">
            {/* Efecto glow */}
            <div className={`absolute -inset-1 bg-gradient-to-r ${card.color} rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300`}></div>
            
            {/* Card principal */}
            <div className="relative bg-gray-800/90 backdrop-blur-sm rounded-xl p-8 h-80 flex flex-col justify-between border border-gray-600/50">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4 text-white">
                  {card.title}
                </h3>
                
                {/* Score */}
                <div className="flex items-center justify-center mb-6">
                  <span className="text-3xl mr-2">🏆</span>
                  <span className="text-2xl font-bold text-yellow-400">{card.score}</span>
                </div>
              </div>
              
              {/* Botón Empezar */}
              <button className={`${card.buttonColor} text-black hover:text-white px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg`}>
                Empezar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Streak indicator */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl px-6 py-4 border border-gray-600/50">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🔥</span>
            <span className="text-white font-semibold">Estas en racha!</span>
          </div>
          {/* Progress bar */}
          <div className="w-48 h-2 bg-gray-600 rounded-full mt-2">
            <div className="w-1/3 h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"></div>
          </div>
        </div>
      </div>


    </div>
  )
}
