import { useState, useEffect, useRef, useCallback } from 'react'
import type { Algorithm, Step } from '@lib/types'
import type { Locale } from '@i18n/translations'

const SPEED_MAP: Record<number, number> = {
  1: 1500,
  2: 800,
  3: 400,
  4: 150,
  5: 50,
}

export function usePlayback(locale: Locale) {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(null)
  const [steps, setSteps] = useState<Step[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(3)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const selectAlgorithm = useCallback((algo: Algorithm) => {
    setIsPlaying(false)
    setSelectedAlgorithm(algo)
    const newSteps = algo.generateSteps(locale)
    setSteps(newSteps)
    setCurrentStep(0)
  }, [locale])

  const stepForward = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }, [steps.length])

  const stepBackward = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }, [])

  const togglePlay = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev >= steps.length - 1) {
        setIsPlaying(true)
        return 0
      }
      setIsPlaying((p) => !p)
      return prev
    })
  }, [steps.length])

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (isPlaying && steps.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, SPEED_MAP[speed] || 400)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, speed, steps.length])

  const currentStepData = steps[currentStep] || null

  return {
    selectedAlgorithm,
    steps,
    currentStep,
    setCurrentStep,
    isPlaying,
    speed,
    setSpeed,
    selectAlgorithm,
    stepForward,
    stepBackward,
    togglePlay,
    currentStepData,
  }
}
