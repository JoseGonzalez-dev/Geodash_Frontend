import { useState, useEffect, useRef, useCallback } from 'react'

export const useQuestionTimer = (timeLimit = 20000, onTimeout) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const [isActive, setIsActive] = useState(false)
  const [hasTimedOut, setHasTimedOut] = useState(false)
  const intervalRef = useRef(null)
  const timeoutRef = useRef(null)

  const startTimer = useCallback(() => {
    setTimeLeft(timeLimit)
    setIsActive(true)
    setHasTimedOut(false)
    
    // Limpiar timers anteriores
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    
    // Timer de actualización visual (cada 100ms)
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 100
        if (newTime <= 0) {
          setIsActive(false)
          setHasTimedOut(true)
          if (onTimeout) onTimeout()
          return 0
        }
        return newTime
      })
    }, 100)
  }, [timeLimit, onTimeout])

  const stopTimer = useCallback(() => {
    setIsActive(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }, [])

  const resetTimer = useCallback(() => {
    stopTimer()
    setTimeLeft(timeLimit)
    setHasTimedOut(false)
  }, [stopTimer, timeLimit])

  // Limpiar timers al desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return {
    timeLeft,
    isActive,
    hasTimedOut,
    startTimer,
    stopTimer,
    resetTimer,
    progress: (timeLeft / timeLimit) * 100
  }
}
