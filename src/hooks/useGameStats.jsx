export const useGameStats = () => {
    const STORAGE_KEY = 'geodash_game_stats'

    const readStorage = () => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            return raw ? JSON.parse(raw) : {}
        } catch (e) {
            console.error('❌ [useGameStats] Error leyendo almacenamiento local:', e);
        }
    }

    const writeStorage = (data) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        } catch (e) {
            // ignore
            console.error('❌ [useGameStats] Error escribiendo en almacenamiento local:', e);
        }
    }

    const calculateStats = (answers) => {
        if (!answers || answers.length === 0) {
            return {
                totalScore: 0,
                correctAnswers: 0,
                totalResponseTimeMs: 0,
                averageResponseTime: 0,
                accuracy: 0
            }
        }

        const correctAnswers = answers.filter(answer => answer.isCorrect).length
        const totalResponseTimeMs = answers.reduce((sum, answer) => sum + (answer.responseTimeMs || 0), 0)
        const averageResponseTime = totalResponseTimeMs / answers.length
        const accuracy = (correctAnswers / answers.length) * 100
        
        // Sistema de puntuación: 100 puntos base + bonus por velocidad
        const totalScore = answers.reduce((score, answer) => {
            if (answer.isCorrect) {
                let pointsForAnswer = 100
                
                // Bonus por respuesta rápida (menos de 5 segundos)
                if (answer.responseTimeMs < 5000) {
                    pointsForAnswer += 50
                }
                // Bonus extra por respuesta muy rápida (menos de 3 segundos)
                if (answer.responseTimeMs < 3000) {
                    pointsForAnswer += 25
                }
                
                return score + pointsForAnswer
            }
            return score
        }, 0)

        return {
            totalScore,
            correctAnswers,
            totalResponseTimeMs,
            averageResponseTime: Math.round(averageResponseTime),
            accuracy: Math.round(accuracy * 100) / 100,
            totalQuestions: answers.length
        }
    }

    // difficultyId should be one of: 'explorer' | 'traveler' | 'geographer'
    const saveResult = (difficultyId, result) => {
        if (!difficultyId || !result) return
        const data = readStorage()
        const prev = data[difficultyId] || {}
        const newEntry = {
            last: {
                correctAnswers: result.correctAnswers || 0,
                totalQuestions: result.totalQuestions || 10,
                totalScore: result.totalScore || 0,
                averageResponseTime: result.averageResponseTime || 0,
                savedAt: new Date().toISOString()
            },
            best: {
                correctAnswers: Math.max(prev.best?.correctAnswers || 0, result.correctAnswers || 0),
                totalQuestions: result.totalQuestions || prev.best?.totalQuestions || 10,
                totalScore: Math.max(prev.best?.totalScore || 0, result.totalScore || 0),
            }
        }
        data[difficultyId] = newEntry
        writeStorage(data)
    }

    const getTrophies = () => {
        const data = readStorage()
        const getScoreText = (dId) => {
            const last = data[dId]?.last
            if (!last) return '0/10'
            const totalQ = last.totalQuestions || 10
            return `${last.correctAnswers || 0}/${totalQ}`
        }
        return {
            explorer: getScoreText('explorer'),
            traveler: getScoreText('traveler'),
            geographer: getScoreText('geographer')
        }
    }

    return { calculateStats, saveResult, getTrophies }
}