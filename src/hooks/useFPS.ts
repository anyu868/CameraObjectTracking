import { useRef, useCallback } from 'react'
import { useStore } from '../store/useStore'

interface UseFPSReturn {
  calculateFPS: (timestamp: number) => number
}

export const useFPS = (): UseFPSReturn => {
  const { setFps } = useStore()
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())
  const fps = useRef(0)

  const calculateFPS = useCallback((timestamp: number): number => {
    frameCount.current++

    if (timestamp - lastTime.current >= 1000) {
      fps.current = frameCount.current
      setFps(frameCount.current)
      frameCount.current = 0
      lastTime.current = timestamp
    }

    return fps.current
  }, [setFps])

  return {
    calculateFPS
  }
}
