import React, { useState } from 'react'
import { Login } from '../components/Auth/Login'
import { Register } from '../components/Auth/Register'

export const AuthPage = () => {
    const [isLogin,setIsLogin]=useState(true)

    const handleAuthPage=()=>{
        setIsLogin(prev=>!prev)
    }
  return (
    <div>
      {isLogin?(
        <Login switchAuthHandler={handleAuthPage}/>
      ):(
        <Register switchAuthHandler={handleAuthPage}/>
      )}
    </div>
  )
}

