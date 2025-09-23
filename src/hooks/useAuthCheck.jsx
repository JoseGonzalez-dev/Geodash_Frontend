import { useEffect } from 'react'
import { validateAndCleanToken } from '../utils/tokenUtils'

/**
 * Hook para verificar la validez del token de autenticación
 * Se ejecuta automáticamente al montar el componente
 * @param {boolean} redirectOnExpired - Si debe redirigir a /auth cuando el token expira (default: false)
 * @returns {boolean} - true si el token es válido, false si está expirado o no existe
 */
export const useAuthCheck = (redirectOnExpired = false) => {
  useEffect(() => {
    const isValid = validateAndCleanToken()
    
    if (!isValid && redirectOnExpired) {
      window.location.href = '/auth'
    }
    
    // No retornar nada - useEffect no debe retornar valores
  }, [])

  // Retornar el estado actual del token
  return validateAndCleanToken()
}
