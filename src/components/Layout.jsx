import React from 'react'
import { Outlet } from 'react-router-dom'
import { StarsBackground } from './molecules/StarsBackground'
import { Navigation } from './molecules/Navigation'

export const Layout = () => {
  return (
    <div className="relative min-h-screen">
      {/* Fondo de estrellas compartido */}
      <StarsBackground mode='atmosphere'/>

      {/* Navegación global */}
      <Navigation />

      {/* Contenido de las páginas */}
      <div className="relative z-10 transition-all duration-500 ease-in-out">
        <Outlet />
      </div>
    </div>
  )
}
