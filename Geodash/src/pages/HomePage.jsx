import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import earthDay from '../assets/textures/earth-day.jpg'
import earthCloud from '../assets/textures/earth-clouds.jpg'

export const HomePage = () => {
  const mountRef = useRef(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Setup básico de la escena
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000011)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    mountRef.current.appendChild(renderer.domElement)

    // Agrega luz a la escena
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
    directionalLight.position.set(5, 3, 5)
    scene.add(directionalLight)

    camera.position.z = 3

    let animationId
    let earth, clouds

    // Manager de carga para esperar por las texturas
    const manager = new THREE.LoadingManager()
    manager.onLoad = () => {
      console.log('✅ Todas las texturas cargadas. Creando objetos 3D...')

      // Crear materiales con las texturas ya cargadas
      const earthMaterial = new THREE.MeshStandardMaterial({
        map: earthTexture
      })
      
      const cloudsMaterial = new THREE.MeshStandardMaterial({
        map: cloudsTexture,
        transparent: true,
        opacity: 0.3,
        // Evita que las nubes se vean oscuras en el lado de la sombra
        side: THREE.DoubleSide
      })

      // Crear la Tierra
      const geometry = new THREE.SphereGeometry(1.5, 65, 65)
      earth = new THREE.Mesh(geometry, earthMaterial)
      scene.add(earth)

      // Crear las nubes
      const cloudsGeometry = new THREE.SphereGeometry(1.52, 64, 64)
      clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial)
      scene.add(clouds)

      // Iniciar el bucle de animación solo después de que todo se haya creado
      animate()
    }

    const textureLoader = new THREE.TextureLoader(manager)
    const earthTexture = textureLoader.load(earthDay)
    const cloudsTexture = textureLoader.load(earthCloud)

    // Bucle de animación (ahora es una función que se llama desde manager.onLoad)
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      if (earth && clouds) {
        earth.rotation.y += 0.003
        clouds.rotation.y += 0.002
      }
      renderer.render(scene, camera)
    }

    // Manejar redimensionamiento
    const handleResize = () => {
      if (!mountRef.current) return
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(window.devicePixelRatio)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      // Limpiar recursos
      scene.children.forEach(child => scene.remove(child))
      renderer.dispose()
    }
  }, [])

  return (
    <div className='relative w-full h-screen overflow-hidden'>
      <div ref={mountRef} className='absolute inset-0' />
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">Geobash</h1>
        <p className="text-xl text-white/80 mb-8 drop-shadow-md">Explora el mundo</p>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg text-xl transition-all duration-300 hover:scale-105 shadow-lg"
          onClick={() => { /* Aquí tu lógica de navegación */ }}
        >
          Jugar
        </button>
      </div>
    </div>
  )
}