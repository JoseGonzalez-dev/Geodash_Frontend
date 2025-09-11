export const useGameStats = () => {
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

    return { calculateStats }
}