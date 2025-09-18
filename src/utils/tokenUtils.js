/**
 * Utilidades para manejo de tokens JWT
 */

/**
 * Verifica si un token JWT ha expirado
 * @param {string} token - Token JWT a verificar
 * @returns {boolean} - true si el token ha expirado, false si es válido
 */
export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    // Decodificar el payload del JWT (sin verificar la firma)
    const base64Url = token.split('.')[1];
    if (!base64Url) return true;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload);
    
    // Verificar si el token tiene exp (expiration time)
    if (!payload.exp) return true;

    // Comparar con el tiempo actual (en segundos)
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error al verificar token:', error);
    return true; // Si hay error al decodificar, consideramos el token como expirado
  }
};

/**
 * Limpia el localStorage removiendo token y datos de usuario
 */
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Verifica si el token está presente y no ha expirado
 * Si está expirado, lo remueve del localStorage
 * @returns {boolean} - true si el token es válido, false si está expirado o no existe
 */
export const validateAndCleanToken = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return false;
  }

  if (isTokenExpired(token)) {
    clearAuthData();
    return false;
  }
  return true;
};

