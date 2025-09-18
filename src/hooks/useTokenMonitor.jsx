import { useEffect, useRef } from 'react'
import { validateAndCleanToken } from '../utils/tokenUtils'

/**
 * Hook para monitorear el token periódicamente
 * Verifica el token cada cierto tiempo y lo limpia si ha expirado
 * @param {number} intervalMinutes - Intervalo en minutos para verificar (default: 5)
 */
export const useTokenMonitor = (intervalMinutes = 5) => {
  const intervalRef = useRef(null)

  useEffect(() => {
    // Verificar inmediatamente al montar
    console.log('🔍 Verificando token inicial...')
    validateAndCleanToken()

    // Configurar verificación periódica
    const intervalMs = intervalMinutes * 60 * 1000
    intervalRef.current = setInterval(() => {
      console.log('🔍 Verificación periódica del token...')
      const isValid = validateAndCleanToken()
      if (!isValid) {
        console.log('⏰ Token expirado detectado en verificación periódica')
        // Opcional: mostrar notificación al usuario
        // toast.info('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.')
      }
    }, intervalMs)

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [intervalMinutes])

  // Función para verificar manualmente
  const checkTokenNow = () => {
    return validateAndCleanToken()
  }

  return { checkTokenNow }
}
