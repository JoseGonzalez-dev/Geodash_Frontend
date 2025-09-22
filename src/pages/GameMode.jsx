import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthModal } from '../components/molecules/AuthModal'
import { useStreaks } from '../hooks/useStreaks'
import { useGameStats } from "../hooks/useGameStats"
import { useTokenMonitor } from '../hooks/useTokenMonitor'
import { useAuthState } from '../hooks/useAuthState'

export const GameMode = () => {
    const navigate = useNavigate()
    const [isLoaded, setIsLoaded] = useState(false)
    const [showAuthModal, setShowAuthModal] = useState(false)
    const { loading, error, streak, fetchMyStreak } = useStreaks()
    const { getTrophies } = useGameStats()
    const [trophies, setTrophies] = useState({ explorer: '0/10', traveler: '0/10', geographer: '0/10' })
    
    useTokenMonitor(2)
    const { isAuthenticated } = useAuthState()

    const gameCards = [
        {
            id: 'explorer',
            title: '🔍 Explorador',
            score: trophies.explorer,
            color: 'from-green-400 to-green-600',
            buttonColor: 'bg-green-200 hover:bg-green-600',
            delay: 'delay-200'
        },
        {
            id: 'traveler',
            title: '✈️ Viajero',
            score: trophies.traveler,
            color: 'from-blue-400 to-blue-600',
            buttonColor: 'bg-yellow-200 hover:bg-yellow-600',
            delay: 'delay-400'
        },
        {
            id: 'geographer',
            title: '🏆 Geógrafo',
            score: trophies.geographer,
            color: 'from-purple-400 to-purple-600',
            buttonColor: 'bg-red-400 hover:bg-red-600',
            delay: 'delay-600'
        }
    ]

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoaded(true)
        }, 100)
        setTrophies(getTrophies())
        return () => clearTimeout(timer)
    }, [])

    const handleStartGame = (gameId) => {
        if (!isAuthenticated) {
            setShowAuthModal(true)
        } else {
            const routeMap = {
                'explorer': '/game/facil',
                'traveler': '/game/medio',
                'geographer': '/game/dificil'
            }
            const route = routeMap[gameId]
            if (route) navigate(route)
        }
    }

    const handleLogin = () => {
        navigate('/login')
        setShowAuthModal(false)
    }

    const handleRegister = () => {
        navigate('/register')
        setShowAuthModal(false)
    }

    const getCurrentStreak = () => {
        if (!streak) return 0
        return streak.currentStreak || streak.consecutiveDays || streak.current || streak.days || streak.count || streak.length || 0
    }

    const getBestStreak = () => {
        if (!streak) return null
        return streak.longestStreak || streak.maxStreak || streak.best || null
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-white px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            
            {/* Fondo */}
            <div className={`absolute inset-0 bg-gradient-to-b from-blue-900/20 via-blue-800/10 to-green-900/20 transition-all duration-2000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}></div>

            {/* Grid cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl w-full mt-4 sm:mt-8 relative z-10">
                {gameCards.map((card) => (
                    <div
                        key={card.id}
                        className={`relative group transform transition-all duration-1000 ease-out ${card.delay} ${isLoaded
                            ? 'translate-y-0 opacity-100 scale-100'
                            : 'translate-y-20 opacity-0 scale-95'
                            }`}
                    >
                        {/* Glow */}
                        <div className={`absolute -inset-1 bg-gradient-to-r ${card.color} rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300`}></div>

                        {/* Card */}
                        <div className="relative bg-gradient-to-t from-neutral-300 via-indigo-200 to-indigo-400 backdrop-blur-sm rounded-xl p-6 sm:p-8 h-full flex flex-col border border-gray-600/50 hover:border-gray-400/70 transition-all duration-300">
                            
                            <div className="text-center">
                                <h3 className={`text-xl sm:text-2xl font-bold mb-4 text-white transition-all duration-700 ${card.delay} ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                                    }`}>
                                    {card.title}
                                </h3>
                            </div>

                            <div className="flex-1 flex items-center justify-center">
                                <div className={`flex items-center justify-center transition-all duration-800 ${card.delay} ${isLoaded ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                                    }`}>
                                    <span className="text-3xl sm:text-4xl mr-2 sm:mr-4 animate-pulse">🏆</span>
                                    <span className="text-2xl sm:text-3xl font-bold text-yellow-400">{card.score}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleStartGame(card.id)}
                                className={`${card.buttonColor} text-black hover:text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-base sm:text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                    } ${card.delay}`}
                            >
                                Empezar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Streak indicator */}
            <div className={`absolute bottom-12 sm:bottom-20 left-1/2 transform -translate-x-1/2 w-[90%] sm:w-auto transition-all duration-1200 delay-800 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                {isAuthenticated ? (
                    <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl px-4 sm:px-6 py-3 sm:py-4 border border-gray-600/50 hover:border-orange-400/50 transition-all duration-300 text-center sm:text-left">
                        {loading ? (
                            <div className="flex items-center justify-center sm:justify-start space-x-3">
                                <span className="text-xl sm:text-2xl animate-spin">⏳</span>
                                <span className="text-white font-semibold text-sm sm:text-base">Cargando racha...</span>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col sm:flex-row items-center sm:space-x-3 space-y-2 sm:space-y-0">
                                <span className="text-2xl">❌</span>
                                <span className="text-red-400 font-semibold text-sm sm:text-base">Error al cargar racha</span>
                                <button
                                    onClick={fetchMyStreak}
                                    className="text-xs bg-red-500/20 px-2 py-1 rounded hover:bg-red-500/40 transition-colors"
                                >
                                    Reintentar
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-center sm:justify-start space-x-3">
                                    <span className="text-2xl animate-bounce">🔥</span>
                                    <span className="text-white font-semibold text-sm sm:text-base">
                                        Racha: {getCurrentStreak()} días
                                    </span>
                                </div>

                                <div className="w-full sm:w-48 h-2 bg-gray-600 rounded-full mt-2 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-2000 delay-1000"
                                        style={{
                                            width: `${Math.min((getCurrentStreak() * 10), 100)}%`
                                        }}
                                    />
                                </div>

                                {getBestStreak() && (
                                    <div className="text-xs text-gray-400 mt-1">
                                        Mejor racha: {getBestStreak()} días
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={() => setShowAuthModal(true)}
                        className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-xl px-4 sm:px-8 py-3 sm:py-4 border-2 border-orange-400/50 hover:border-orange-400 transition-all duration-300 hover:scale-105 group w-full sm:w-auto"
                    >
                        <div className="flex items-center justify-center sm:justify-start space-x-3">
                            <span className="text-2xl sm:text-3xl animate-pulse">🔥</span>
                            <div className="text-left">
                                <div className="text-orange-400 font-bold text-base sm:text-lg group-hover:text-orange-300">
                                    ¡Inicia tu racha!
                                </div>
                                <div className="text-gray-300 text-xs sm:text-sm group-hover:text-white">
                                    Regístrate para competir globalmente
                                </div>
                            </div>
                            <span className="text-orange-400 group-hover:text-orange-300 animate-bounce hidden sm:inline">→</span>
                        </div>
                    </button>
                )}
            </div>

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onLogin={handleLogin}
                onRegister={handleRegister}
            />
        </div>
    )
}
