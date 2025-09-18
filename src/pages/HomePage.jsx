//AI correción de errores en las animaciones y con Three.js
import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import earthDay from '../assets/textures/earth-day.jpg'
import earthCloud from '../assets/textures/earth-clouds.jpg'
import { StarsBackground } from '../components/molecules/StarsBackground'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTokenMonitor } from '../hooks/useTokenMonitor'

export const HomePage = () => {
  const mountRef = useRef(null)
  const sceneRef = useRef(null) // ✅ Referencia a la escena
  const cameraRef = useRef(null) // ✅ Referencia a la cámara
  const rendererRef = useRef(null) // ✅ Referencia al renderer
  const animationIdRef = useRef(null) // ✅ ID de animación
  const navigate = useNavigate()
  const location = useLocation()
  const [showUI, setShowUI] = useState(true)

  // Monitorear token periódicamente (cada 2 minutos)
  useTokenMonitor(2)

  useEffect(() => {
    if (!mountRef.current) return

    // ✅ Limpiar completamente antes de crear nueva escena
    if (sceneRef.current) {
      sceneRef.current.clear()
    }
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current)
    }

    // Setup básico de la escena
    const scene = new THREE.Scene()
    scene.background = null
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    cameraRef.current = camera
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    rendererRef.current = renderer
    
    // ✅ Limpiar canvas anterior si existe
    if (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild)
    }
    mountRef.current.appendChild(renderer.domElement)

    // Luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
    directionalLight.position.set(5, 3, 5)
    scene.add(directionalLight)

    // ✅ RESET COMPLETO de posición inicial
    camera.position.set(0, 0, 3)
    camera.lookAt(0, 0, 0)

    let earth, clouds, atmosphere
    let isZooming = false
    let zoomStartTime = 0
    const zoomDuration = 3000

    // Manager de carga
    const manager = new THREE.LoadingManager()
    manager.onLoad = () => {

      // Materiales
      const earthMaterial = new THREE.MeshStandardMaterial({
        map: earthTexture
      })
      const cloudsMaterial = new THREE.MeshStandardMaterial({
        map: cloudsTexture,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
      })

      // Geometrías
      const earthGeometry = new THREE.SphereGeometry(1.5, 65, 65)
      const cloudsGeometry = new THREE.SphereGeometry(1.52, 64, 64)
      const atmosphereGeometry = new THREE.SphereGeometry(1.55, 32, 32)

      // Crear objetos
      earth = new THREE.Mesh(earthGeometry, earthMaterial)
      clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial)
      atmosphere = new THREE.Mesh(atmosphereGeometry, new THREE.MeshBasicMaterial({
        color: 0x87CEEB,
        transparent: true,
        opacity: 0, // ✅ Opacidad inicial = 0
        side: THREE.BackSide
      }))

      scene.add(earth)
      scene.add(clouds)
      scene.add(atmosphere)

      animate()
    }

    // ✅ Forzar carga de texturas con timestamp único
    const textureLoader = new THREE.TextureLoader(manager)
    const timestamp = Date.now()
    const earthTexture = textureLoader.load(earthDay + '?v=' + timestamp)
    const cloudsTexture = textureLoader.load(earthCloud + '?v=' + timestamp)

    // ✅ Función de zoom mejorada
    const startZoomAnimation = () => {
      // ✅ Reset completo del estado
      camera.position.set(0, 0, 3)
      isZooming = true
      zoomStartTime = Date.now()
      
      if (atmosphere) {
        atmosphere.material.opacity = 0
      }
      
      // ✅ Reset del renderer background
      renderer.setClearColor(new THREE.Color(0x000011), 0)
    }

    // Animación
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)

      if (isZooming && atmosphere && camera) {
        const elapsed = Date.now() - zoomStartTime
        const progress = Math.min(elapsed / zoomDuration, 1)
        const easeInOut = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
        const smoothProgress = easeInOut(progress)

        // ✅ Movimiento de cámara más suave
        camera.position.z = 3 - smoothProgress * 2.8
        atmosphere.material.opacity = smoothProgress * 0.3

        renderer.setClearColor(
          new THREE.Color().lerpColors(
            new THREE.Color(0x000011),
            new THREE.Color(0x6495ED).multiplyScalar(0.3),
            smoothProgress
          )
        )

        if (progress >= 1) {
          isZooming = false
        }
      }

      if (earth && clouds && !isZooming) {
        earth.rotation.y += 0.003
        clouds.rotation.y += 0.002
      }

      if (renderer && scene && camera) {
        renderer.render(scene, camera)
      }
    }

    // ✅ Exponer función de zoom globalmente
    window.startZoomAnimation = startZoomAnimation

    // Redimensionar
    const handleResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      
      window.removeEventListener('resize', handleResize)
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
        animationIdRef.current = null
      }

      if (renderer && renderer.domElement?.parentElement === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement)
      }

      // ✅ Cleanup completo de objetos
      ;[earth, clouds, atmosphere].forEach(obj => {
        if (obj) {
          scene.remove(obj)
          if (obj.geometry) obj.geometry.dispose()
          if (obj.material) {
            if (obj.material.map) obj.material.map.dispose()
            obj.material.dispose()
          }
        }
      })

      if (renderer) {
        renderer.dispose()
        rendererRef.current = null
      }
      
      if (scene) {
        scene.clear()
        sceneRef.current = null
      }
      
      cameraRef.current = null

      // ✅ Limpiar función global
      delete window.startZoomAnimation
    }
  }, [location.pathname]) // ✅ Re-ejecutar cuando cambia la ruta

  const handlePlayClick = () => {
    setShowUI(false)
    
    // ✅ Usar función global con delay para asegurar que esté disponible
    setTimeout(() => {
      if (window.startZoomAnimation) {
        window.startZoomAnimation()
        setTimeout(() => navigate('/game'), 3500)
      } else {
        // ✅ Fallback: navegar inmediatamente
        navigate('/game')
      }
    }, 100)
  }

  return (
    <div key={location.pathname} className='relative w-full h-screen overflow-hidden'>
      {showUI && <StarsBackground mode="space" />}

      <div ref={mountRef} className='absolute inset-0' />


      {showUI && (
        <>
          <div className="absolute top-8 left-0 right-0 z-10 flex justify-center">
            <h1
              className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-cyan-500 to-green-400 bg-clip-text text-transparent drop-shadow-lg"
              style={{ fontFamily: 'Macondo, cursive' }}
            >
              GeoDash
            </h1>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            <p
              className="text-2xl font-semibold text-cyan-400 bg-clip-text mb-8 drop-shadow-lg"
              style={{ fontFamily: 'Macondo, cursive', textShadow: '0 0 5px #00BFFF' }}
            >
              ¿Conoces el planeta?
            </p>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-cyan-500 to-green-400 rounded-lg blur opacity-75 group-hover:opacity-100 animate-pulse"></div>
              <div className="relative p-1 bg-gradient-to-r from-blue-400 via-cyan-500 to-green-400 rounded-lg">
                <button
                  className="relative bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-lg text-2xl transition-all duration-300 hover:scale-95 shadow-lg w-full"
                  onClick={handlePlayClick}
                >
                  Jugar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}