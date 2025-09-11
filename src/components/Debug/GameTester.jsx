import React, { useState } from 'react'
import { useGame } from '../../hooks/useGame'
import { getCurrentUser, getCurrentUserId, isUserLoggedIn } from '../../utils/userUtils'

export const GameTester = () => {
  const [testResults, setTestResults] = useState([])
  const { sendRequest: createGame, loading, error } = useGame()

  const addResult = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString()
    setTestResults(prev => [...prev, { message, type, timestamp }])
  }

  const testUserData = () => {
    addResult('🔍 Iniciando test de datos de usuario...', 'info')
    
    const isLoggedIn = isUserLoggedIn()
    addResult(`🔐 Usuario logueado: ${isLoggedIn}`, isLoggedIn ? 'success' : 'error')
    
    const user = getCurrentUser()
    addResult(`👤 Usuario obtenido: ${user ? 'Sí' : 'No'}`, user ? 'success' : 'error')
    
    if (user) {
      addResult(`📊 Estructura del usuario: ${JSON.stringify(user, null, 2)}`, 'info')
    }
    
    const userId = getCurrentUserId()
    addResult(`🆔 ID del usuario: ${userId || 'No encontrado'}`, userId ? 'success' : 'error')
    
    const token = localStorage.getItem('token')
    addResult(`🔑 Token: ${token ? 'Existe' : 'No existe'}`, token ? 'success' : 'error')
  }

  const testGameCreation = async () => {
    addResult('🎮 Iniciando test de creación de partida...', 'info')
    
    const userId = getCurrentUserId()
    if (!userId) {
      addResult('❌ No se puede crear partida sin ID de usuario', 'error')
      return
    }

    const gameData = {
      user: userId,
      difficulty: 'Fácil'
    }

    addResult(`📊 Datos a enviar: ${JSON.stringify(gameData, null, 2)}`, 'info')

    try {
      const result = await createGame(gameData)
      addResult(`📦 Resultado completo: ${JSON.stringify(result, null, 2)}`, result.error ? 'error' : 'success')
      
      if (result.error) {
        addResult(`❌ Error: ${result.message}`, 'error')
      } else {
        addResult(`✅ Partida creada exitosamente`, 'success')
      }
    } catch (e) {
      addResult(`💥 Error capturado: ${e.message}`, 'error')
    }
  }

  const clearResults = () => {
    setTestResults([])
  }

  if (process.env.NODE_ENV === 'production') return null

  return (
    <div className="fixed top-4 left-4 bg-white border-2 border-blue-500 rounded-lg p-4 max-w-md max-h-96 overflow-y-auto z-50 shadow-lg">
      <h3 className="font-bold text-blue-600 mb-3">🧪 Game Tester</h3>
      
      <div className="space-y-2 mb-4">
        <button
          onClick={testUserData}
          className="w-full bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
        >
          Test Datos Usuario
        </button>
        
        <button
          onClick={testGameCreation}
          disabled={loading}
          className="w-full bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600 disabled:bg-gray-400"
        >
          {loading ? 'Creando...' : 'Test Crear Partida'}
        </button>
        
        <button
          onClick={clearResults}
          className="w-full bg-gray-500 text-white px-3 py-2 rounded text-sm hover:bg-gray-600"
        >
          Limpiar
        </button>
      </div>

      <div className="space-y-1 text-xs">
        {testResults.map((result, index) => (
          <div
            key={index}
            className={`p-2 rounded ${
              result.type === 'success' ? 'bg-green-100 text-green-800' :
              result.type === 'error' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}
          >
            <span className="font-mono text-xs text-gray-500">{result.timestamp}</span>
            <div className="break-words">{result.message}</div>
          </div>
        ))}
      </div>
    </div>
  )
}