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

            {/* Grid cards - Diseño responsive: 1 columna en móvil, 2 en tablet, 3 en desktop+ */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-6 xl:gap-8 2xl:gap-8 max-w-5xl xl:max-w-6xl w-full mt-4 sm:mt-6 lg:mt-8 xl:-mt-16 relative z-10">
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
                        <div className="relative bg-gradient-to-t from-neutral-300 via-indigo-200 to-indigo-400 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-6 xl:p-7 2xl:p-8 h-full xl:h-96 2xl:h-96 flex flex-col border border-gray-600/50 hover:border-gray-400/70 transition-all duration-300">

                            <div className="text-center">
                                <h3 className={`text-lg sm:text-xl lg:text-xl xl:text-2xl 2xl:text-2xl font-bold mb-3 sm:mb-4 lg:mb-5 xl:mb-6 text-white transition-all duration-700 ${card.delay} ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                                    }`}>
                                    {card.title}
                                </h3>
                            </div>

                            <div className="flex-1 flex items-center justify-center">
                                <div className={`flex items-center justify-center transition-all duration-800 ${card.delay} ${isLoaded ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                                    }`}>
                                    <span className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl 2xl:text-4xl mr-2 sm:mr-3 lg:mr-4 animate-pulse">🏆</span>
                                    <span className="text-xl sm:text-2xl lg:text-2xl xl:text-3xl 2xl:text-3xl font-bold text-yellow-400">{card.score}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleStartGame(card.id)}
                                className={`${card.buttonColor} text-black hover:text-white px-4 sm:px-6 lg:px-6 xl:px-7 2xl:px-8 py-2 sm:py-3 lg:py-3 xl:py-4 2xl:py-4 rounded-lg text-sm sm:text-base lg:text-base xl:text-lg 2xl:text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                    } ${card.delay}`}
                            >
                                Empezar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Streak indicator */}
            <div className={`absolute bottom-6 sm:bottom-12 lg:bottom-14 xl:bottom-16 2xl:bottom-18 left-1/2 transform -translate-x-1/2 w-[95%] sm:w-auto max-w-md lg:max-w-lg xl:max-w-xl transition-all duration-1200 delay-800 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                {isAuthenticated ? (
                    <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl px-3 sm:px-4 lg:px-5 xl:px-6 2xl:px-7 py-3 sm:py-4 lg:py-4 xl:py-5 2xl:py-6 border border-gray-600/50 hover:border-orange-400/50 transition-all duration-300 text-center sm:text-left max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
                        {loading ? (
                            <div className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3">
                                <span className="text-xl sm:text-2xl animate-spin flex-shrink-0">⏳</span>
                                <span className="text-white font-semibold text-sm sm:text-base lg:text-base xl:text-lg 2xl:text-lg leading-tight">Cargando racha...</span>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col sm:flex-row items-center sm:space-x-3 space-y-2 sm:space-y-0">
                                <span className="text-2xl flex-shrink-0">❌</span>
                                <span className="text-red-400 font-semibold text-sm sm:text-base lg:text-base xl:text-lg 2xl:text-lg text-center sm:text-left leading-tight">Error al cargar racha</span>
                                <button
                                    onClick={fetchMyStreak}
                                    className="text-xs sm:text-sm bg-red-500/20 px-2 py-1 rounded hover:bg-red-500/40 transition-colors flex-shrink-0"
                                >
                                    Reintentar
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3 xl:h-4">
                                    <span className="text-xl sm:text-2xl lg:text-2xl animate-bounce flex-shrink-0">🔥</span>
                                    <span className="text-white font-semibold text-sm sm:text-base lg:text-base xl:text-lg 2xl:text-lg leading-tight">
                                        Racha: {getCurrentStreak()} días
                                    </span>
                                </div>

                                <div className="w-full sm:w-40 lg:w-44 xl:w-48 2xl:w-52 h-2 sm:h-3 bg-gray-600 rounded-full overflow-hidden mx-auto sm:mx-0">
                                    <div
                                        className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-2000 delay-1000"
                                        style={{
                                            width: `${Math.min((getCurrentStreak() * 10), 100)}%`
                                        }}
                                    />
                                </div>

                                {getBestStreak() && (
                                    <div className="text-xs sm:text-sm text-gray-400 text-center sm:text-left leading-tight">
                                        Mejor racha: {getBestStreak()} días
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={() => setShowAuthModal(true)}
                        className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-xl px-3 sm:px-4 lg:px-5 xl:px-6 2xl:px-7 py-3 sm:py-4 lg:py-4 xl:py-5 2xl:py-6 border-2 border-orange-400/50 hover:border-orange-400 transition-all duration-300 hover:scale-105 group w-full max-w-md lg:max-w-lg xl:max-w-xl mx-auto"
                    >
                        <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                            <span className="text-xl sm:text-2xl lg:text-2xl animate-pulse flex-shrink-0">🔥</span>
                            <div className="text-center flex-1 min-w-0">
                                <div className="text-orange-400 font-bold text-sm sm:text-base lg:text-lg xl:text-lg 2xl:text-xl group-hover:text-orange-300 leading-tight">
                                    ¡Inicia tu racha!
                                </div>
                                <div className="text-gray-300 text-xs sm:text-sm lg:text-sm xl:text-sm 2xl:text-base group-hover:text-white leading-tight">
                                    Regístrate para competir
                                </div>
                            </div>
                            <span className="text-orange-400 group-hover:text-orange-300 animate-bounce hidden sm:inline flex-shrink-0">→</span>
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
