
import { useState } from "react"
import { getMyStreak } from "../routes/services/api"

export const useStreaks = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [streak, setStreak] = useState([])
    const fetchMyStreak = async() => {
        setLoading(true)
        setError(null)
        const response = await getMyStreak()
        if (response.error) {
            setError(response.message)
        } else {
            setStreak(response.data)
        }
        setLoading(false)
    }
    return {
        loading,
        error,
        streak,
        fetchMyStreak
    }
}