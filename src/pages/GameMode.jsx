import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthModal } from '../components/molecules/AuthModal'
import { useStreaks } from '../hooks/useStreaks'

export const GameMode = () => {
    const navigate = useNavigate()
    const [isLoaded, setIsLoaded] = useState(false)
    const [showAuthModal, setShowAuthModal] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false) // Cambiar a false para probar auth
    const { loading, error, streak, fetchMyStreak } = useStreaks()

    const gameCards = [
        {
            id: 'explorer',
            title: '🔍 Explorador',
            score: '0/10',
            color: 'from-green-400 to-green-600',
            buttonColor: 'bg-green-200 hover:bg-green-600',
            delay: 'delay-200'
        },
        {
            id: 'traveler',
            title: '✈️ Viajero',
            score: '0/10',
            color: 'from-blue-400 to-blue-600',
            buttonColor: 'bg-yellow-200 hover:bg-yellow-600',
            delay: 'delay-400'
        },
        {
            id: 'geographer',
            title: '🏆 Geógrafo',
            score: '0/10',
            color: 'from-purple-400 to-purple-600',
            buttonColor: 'bg-red-400 hover:bg-red-600',
            delay: 'delay-600'
        }
    ]

    useEffect(() => {
        // Verificar si el usuario está autenticado
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')
        if (token && user) {
            setIsAuthenticated(true)
        }

        // Activar animaciones después de un pequeño delay
        const timer = setTimeout(() => {
            setIsLoaded(true)
        }, 100)
        return () => clearTimeout(timer)
    }, [])

    const handleStartGame = (gameId) => {
        if (!isAuthenticated) {
            setShowAuthModal(true)
        } else {
            // Mapear cada card a su nivel correspondiente
            const routeMap = {
                'explorer': '/game/facil',     // 🔍 Explorador -> Fácil
                'traveler': '/game/medio',     // ✈️ Viajero -> Medio  
                'geographer': '/game/dificil'  // 🏆 Geógrafo -> Difícil
            }

            const route = routeMap[gameId]
            if (route) {
                navigate(route)
            }
        }
    }

    const handleLogin = () => {
        // Navegar a la página de login existente
        navigate('/login')
        setShowAuthModal(false)
    }

    const handleRegister = () => {
        // Navegar a la página de registro existente
        navigate('/register')
        setShowAuthModal(false)
    }

    // Función para obtener el streak actual de manera segura
    const getCurrentStreak = () => {
        if (!streak) return 0
        
        // Según la respuesta de la API, los posibles nombres son:
        return streak.currentStreak || 
               streak.consecutiveDays || 
               streak.current || 
               streak.days || 
               streak.count || 
               streak.length || 
               0
    }

    // Función para obtener el mejor streak de manera segura
    const getBestStreak = () => {
        if (!streak) return null
        
        return streak.longestStreak || 
               streak.maxStreak || 
               streak.best || 
               null
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-white p-8 relative overflow-hidden">
            {/* Fondo animado que simula aterrizar en la Tierra */}
            <div className={`absolute inset-0 bg-gradient-to-b from-blue-900/20 via-blue-800/10 to-green-900/20 transition-all duration-2000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}></div>

            {/* Cards de juego */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full mt-0 relative z-10">
                {gameCards.map((card) => (
                    <div
                        key={card.id}
                        className={`relative group transform transition-all duration-1000 ease-out ${card.delay} ${isLoaded
                            ? 'translate-y-0 opacity-100 scale-100'
                            : 'translate-y-20 opacity-0 scale-95'
                            }`}
                    >
                        {/* Efecto glow */}
                        <div className={`absolute -inset-1 bg-gradient-to-r ${card.color} rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300`}></div>

                        {/* Card principal */}
                        <div className="relative bg-gradient-to-t from-neutral-300 via-indigo-200 to-indigo-400 backdrop-blur-sm rounded-xl p-8 h-114 flex flex-col border border-gray-600/50 hover:border-gray-400/70 transition-all duration-300">
                            {/* Título arriba */}
                            <div className="text-center">
                                <h3 className={`text-2xl font-bold mb-4 text-white transition-all duration-700 ${card.delay} ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                                    }`}>
                                    {card.title}
                                </h3>
                            </div>

                            {/* Score centrado */}
                            <div className="flex-1 flex items-center justify-center">
                                <div className={`flex items-center justify-center transition-all duration-800 ${card.delay} ${isLoaded ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                                    }`}>
                                    <span className="text-4xl mr-4 animate-pulse">🏆</span>
                                    <span className="text-3xl font-bold text-yellow-400">{card.score}</span>
                                </div>
                            </div>

                            {/* Botón Empezar abajo */}
                            <button
                                onClick={() => handleStartGame(card.id)}
                                className={`${card.buttonColor} text-black hover:text-white px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                    } ${card.delay}`}
                            >
                                Empezar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Streak indicator */}
            <div className={`absolute bottom-20 left-1/2 transform -translate-x-1/2 transition-all duration-1200 delay-800 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                {isAuthenticated ? (
                    <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl px-6 py-4 border border-gray-600/50 hover:border-orange-400/50 transition-all duration-300">
                        {loading ? (
                            <div className="flex items-center space-x-3">
                                <span className="text-2xl animate-spin">⏳</span>
                                <span className="text-white font-semibold">Cargando racha...</span>
                            </div>
                        ) : error ? (
                            <div className="flex items-center space-x-3">
                                <span className="text-2xl">❌</span>
                                <span className="text-red-400 font-semibold">Error al cargar racha</span>
                                <button
                                    onClick={fetchMyStreak}
                                    className="ml-2 text-xs bg-red-500/20 px-2 py-1 rounded hover:bg-red-500/40 transition-colors"
                                >
                                    Reintentar
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl animate-bounce">🔥</span>
                                    <span className="text-white font-semibold">
                                        Racha: {getCurrentStreak()} días
                                    </span>
                                </div>

                                {/* Progress bar basada en datos reales */}
                                <div className="w-48 h-2 bg-gray-600 rounded-full mt-2 overflow-hidden">
                                    <div
                                        className={`h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-2000 delay-1000`}
                                        style={{
                                            width: `${Math.min((getCurrentStreak() * 10), 100)}%`
                                        }}
                                    />
                                </div>

                                {/* Mostrar mejor racha si está disponible */}
                                {getBestStreak() && (
                                    <div className="text-xs text-gray-400 mt-1 text-center">
                                        Mejor racha: {getBestStreak()} días
                                    </div>
                                )}

                            </>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={() => setShowAuthModal(true)}
                        className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-xl px-8 py-4 border-2 border-orange-400/50 hover:border-orange-400 transition-all duration-300 hover:scale-105 group"
                    >
                        <div className="flex items-center space-x-3">
                            <span className="text-3xl animate-pulse">🔥</span>
                            <div className="text-left">
                                <div className="text-orange-400 font-bold text-lg group-hover:text-orange-300">
                                    ¡Inicia tu racha!
                                </div>
                                <div className="text-gray-300 text-sm group-hover:text-white">
                                    Regístrate para competir globalmente
                                </div>
                            </div>
                            <span className="text-orange-400 group-hover:text-orange-300 animate-bounce">→</span>
                        </div>
                    </button>
                )}
            </div>

            {/* Modal de autenticación */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onLogin={handleLogin}
                onRegister={handleRegister}
            />
        </div>
    )
}