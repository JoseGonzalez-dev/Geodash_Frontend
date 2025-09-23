import { useState, useEffect } from 'react'
import { validateAndCleanToken } from '../utils/tokenUtils'

/**
 * Hook para manejar el estado de autenticación
 * Se actualiza automáticamente cuando el token cambia o expira
 */
export const useAuthState = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const checkAuth = () => {
    const isValid = validateAndCleanToken()
    setIsAuthenticated(isValid)
    return isValid
  }

  useEffect(() => {
    // Verificar inicialmente
    checkAuth()

    // Verificar cada 30 segundos
    const interval = setInterval(checkAuth, 30000)

    return () => clearInterval(interval)
  }, [])

  return { isAuthenticated, checkAuth }
}
