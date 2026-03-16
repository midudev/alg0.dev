import { useState, useEffect, useRef, useCallback } from 'react'
import type { Algorithm, Step } from '@lib/types'
import type { Locale } from '@i18n/translations'

export const SPEED_MAP: Record<number, number> = {
  1: 1500,
  2: 800,
  3: 400,
  4: 150,
  5: 50,
}

export function usePlayback(locale: Locale, initialAlgorithm?: Algorithm | null) {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(initialAlgorithm ?? null)
  const [steps, setSteps] = useState<Step[]>(() => initialAlgorithm ? initialAlgorithm.generateSteps(locale) : [])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(2)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const autoplayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearAutoplayTimer = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current)
      autoplayTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (initialAlgorithm && steps.length > 0) {
      autoplayTimerRef.current = setTimeout(() => setIsPlaying(true), 800)
    }
    return clearAutoplayTimer
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const selectAlgorithm = useCallback((algo: Algorithm) => {
    clearAutoplayTimer()
    setIsPlaying(false)
    setSelectedAlgorithm(algo)
    const newSteps = algo.generateSteps(locale)
    setSteps(newSteps)
    setCurrentStep(0)
    autoplayTimerRef.current = setTimeout(() => setIsPlaying(true), 600)
  }, [locale, clearAutoplayTimer])

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

  const clearSelection = useCallback(() => {
    clearAutoplayTimer()
    setIsPlaying(false)
    setSelectedAlgorithm(null)
    setSteps([])
    setCurrentStep(0)
  }, [clearAutoplayTimer])

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
    clearSelection,
    stepForward,
    stepBackward,
    togglePlay,
    currentStepData,
  }
}
