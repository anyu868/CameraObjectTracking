import { useEffect, useRef, useCallback } from 'react'
import { useStore } from '../store/useStore'
import { useObjectDetection } from '../hooks/useObjectDetection'
import { useFPS } from '../hooks/useFPS'
import { useObjectTracking } from '../hooks/useObjectTracking'

interface DetectionControllerProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
}

export const useDetectionController = ({ videoRef }: DetectionControllerProps) => {
  const { isDetecting, setDetectedObjects, isTracking } = useStore()
  const { detectObjects } = useObjectDetection()
  const { calculateFPS } = useFPS()
  const { updateTrack } = useObjectTracking()

  const animationFrameRef = useRef<number>()
  const isRunningRef = useRef(false)

  const runDetection = useCallback(async (timestamp: number) => {
    if (!isRunningRef.current || !videoRef.current) {
      return
    }

    calculateFPS(timestamp)

    const video = videoRef.current
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      const detectedObjects = await detectObjects(video)
      setDetectedObjects(detectedObjects)

      if (isTracking) {
        updateTrack(detectedObjects, timestamp)
      }
    }

    animationFrameRef.current = requestAnimationFrame(runDetection)
  }, [videoRef, detectObjects, setDetectedObjects, calculateFPS, isTracking, updateTrack])

  const startDetection = useCallback(() => {
    if (isRunningRef.current) return

    isRunningRef.current = true
    animationFrameRef.current = requestAnimationFrame(runDetection)
  }, [runDetection])

  const stopDetection = useCallback(() => {
    isRunningRef.current = false

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = undefined
    }
  }, [])

  useEffect(() => {
    if (isDetecting) {
      startDetection()
    } else {
      stopDetection()
    }

    return () => {
      stopDetection()
    }
  }, [isDetecting, startDetection, stopDetection])

  return {
    startDetection,
    stopDetection
  }
}
