import React from 'react'

const QuestionTimer = ({ timeLeft, progress, hasTimedOut }) => {
  const seconds = Math.ceil(timeLeft / 1000)
  
  // Determinar el color basado en el tiempo restante
  const getTimerColor = () => {
    if (hasTimedOut) return 'bg-red-500'
    if (progress > 50) return 'bg-green-500'
    if (progress > 25) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getTextColor = () => {
    if (hasTimedOut) return 'text-red-600'
    if (progress > 50) return 'text-green-600'
    if (progress > 25) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="flex items-center justify-center mb-4">
      {/* Timer pequeño y discreto */}
      <div className="flex items-center space-x-2 bg-white/90 rounded-full px-3 py-1 shadow-sm border">
        <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
          <span className={`text-xs font-bold ${getTextColor()}`}>
            {seconds}
          </span>
        </div>
        
        {/* Barra de progreso pequeña */}
        <div className="w-16 bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full transition-all duration-100 ${getTimerColor()}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Texto pequeño */}
        <span className={`text-xs ${getTextColor()}`}>
          {hasTimedOut ? '⏰' : '⏱️'}
        </span>
      </div>
    </div>
  )
}

export default QuestionTimer
