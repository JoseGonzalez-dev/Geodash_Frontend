import React from 'react'
import { getCurrentUserId, isUserLoggedIn } from '../../utils/userUtils'

export const GameDebugger = ({ gameId, currentQuestion, user }) => {
  if (process.env.NODE_ENV === 'production') return null

  const userId = getCurrentUserId()
  const isLoggedIn = isUserLoggedIn()

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-sm z-50 border border-yellow-400">
      <h4 className="font-bold text-yellow-400 mb-2">🐛 DEBUG INFO</h4>
      <div className="space-y-1">
        <div><strong>🎮 GameID:</strong> <span className={gameId ? 'text-green-400' : 'text-red-400'}>{gameId || '❌ No definido'}</span></div>
        <div><strong>👤 Usuario ID:</strong> <span className={userId ? 'text-green-400' : 'text-red-400'}>{userId || '❌ No encontrado'}</span></div>
        <div><strong>🔐 Logueado:</strong> <span className={isLoggedIn ? 'text-green-400' : 'text-red-400'}>{isLoggedIn ? '✅ Sí' : '❌ No'}</span></div>
        <div><strong>❓ Pregunta ID:</strong> <span className={currentQuestion?._id || currentQuestion?.id ? 'text-green-400' : 'text-red-400'}>{currentQuestion?._id || currentQuestion?.id || '❌ No definida'}</span></div>
        <div><strong>📝 Pregunta:</strong> {currentQuestion?.texto?.substring(0, 30) || '❌ No definida'}...</div>
        <div><strong>💾 LS User:</strong> <span className={localStorage.getItem('user') && localStorage.getItem('user') !== 'null' ? 'text-green-400' : 'text-red-400'}>{localStorage.getItem('user') && localStorage.getItem('user') !== 'null' ? '✅ Existe' : '❌ No existe'}</span></div>
        <div><strong>🔑 LS Token:</strong> <span className={localStorage.getItem('token') ? 'text-green-400' : 'text-red-400'}>{localStorage.getItem('token') ? '✅ Existe' : '❌ No existe'}</span></div>
        {user && (
          <div className="mt-2 pt-2 border-t border-gray-600">
            <div><strong>📊 User Object:</strong></div>
            <div className="text-xs text-gray-300 break-all">{JSON.stringify(user, null, 1).substring(0, 100)}...</div>
          </div>
        )}
      </div>
    </div>
  )
}