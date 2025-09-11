export const validateEmailOrUsername = (input) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/; // Ej: josue_12

  return emailRegex.test(input) || usernameRegex.test(input);
};


export const validateName = (name) => {
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,30}$/
    return regex.test(name.trim())
}

export const validateSurname = (surname) => {
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,30}$/
    return regex.test(surname.trim())
}


export const validateEmail = (email)=>{
    const regex = /\S+@\S+\.\S+/
    return regex.test(email)
}

export const validateUsername = (username)=>{
    const regex = /^\S{5,15}$/
    return regex.test(username)
}

export const validatePassword = (password)=>{
    const regex = /^\S{5,20}$/ 
    return regex.test(password)
}

export const validatePhone = (phone) => {
    const regex = /^\+502 \d{8}$/
    return regex.test(phone)
}
export const validatePassConfirm = (password, confirmPassword)=>{
    return password === confirmPassword
}


export const nameValidationMessage = 'Tu nombre debe tener entre 2 y 20 letras. (Sin espacios ni caracteres especiales)'
export const surnameValidationMessage = 'Tu apellido debe tener entre 2 y 20 letras. (Sin espacios ni caracteres especiales)'
export const emailValidationMessage = 'Tu correo no es válido.'
export const usernameValidationMessage = 'El nombre de usuario debe contener entre 3 y 15 caracteres (Sin espacios)'
export const passwordValidationMessage = 'La contraseña debe tener entre 6 y 12 caracteres, sin espacios'
export const passConfirmValidationMessage = 'Las contraseñas no coinciden'
