/**
 * Utilidades para manejo de usuario
 */

/**
 * Obtiene el usuario actual del localStorage de manera segura
 * @returns {Object|null} Usuario o null si no existe
 */
export const getCurrentUser = () => {
  try {
    const userString = localStorage.getItem('user')
    
    if (!userString || userString === 'null') {
      return null
    }
    
    const user = JSON.parse(userString)
    
    return user
  } catch (error) {
    console.error('❌ [userUtils] Error parseando usuario:', error)
    return null
  }
}

/**
 * Obtiene el ID del usuario de manera segura
 * @returns {string|null} ID del usuario o null
 */
export const getCurrentUserId = () => {
  const user = getCurrentUser()
  if (!user) return null
  
  // Intentar diferentes propiedades donde puede estar el ID
  const userId = user._id || user.uid || user.userId
  
  if (!userId) {
    console.error('❌ [userUtils] No se encontró ID en el usuario:', user)
  }
  
  return userId
}

/**
 * Verifica si hay un usuario logueado
 * @returns {boolean}
 */
export const isUserLoggedIn = () => {
  const token = localStorage.getItem('token')
  const user = getCurrentUser()
  
  const isLoggedIn = !!(token && user)
  
  return isLoggedIn
}