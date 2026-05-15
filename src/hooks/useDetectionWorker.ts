import { useCallback, useRef, useEffect } from 'react'
import { useStore, DetectedObject } from '../store/useStore'

interface WorkerMessage {
  type: 'MODEL_LOADED' | 'DETECTION_RESULT' | 'ERROR'
  payload?: DetectedObject[] | string
}

interface UseDetectionWorkerReturn {
  loadModel: () => void
  detect: (imageData: ImageData) => void
  isWorkerReady: boolean
}

export const useDetectionWorker = (): UseDetectionWorkerReturn => {
  const workerRef = useRef<Worker | null>(null)
  const { setModelLoading, setModelLoaded, setDetectedObjects, setError } = useStore()

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/detectionWorker.ts', import.meta.url),
      { type: 'module' }
    )

    workerRef.current.onmessage = (event: MessageEvent<WorkerMessage>) => {
      const { type, payload } = event.data

      switch (type) {
        case 'MODEL_LOADED':
          setModelLoaded(true)
          setModelLoading(false)
          break
        case 'DETECTION_RESULT':
          setDetectedObjects(payload as DetectedObject[])
          break
        case 'ERROR':
          setError(payload as string)
          break
      }
    }

    workerRef.current.onerror = (error) => {
      console.error('Worker error:', error)
      setError('检测服务出现错误')
    }

    return () => {
      workerRef.current?.terminate()
    }
  }, [setModelLoading, setModelLoaded, setDetectedObjects, setError])

  const loadModel = useCallback(() => {
    if (!workerRef.current) return
    setModelLoading(true)
    setError(null)
    workerRef.current.postMessage({ type: 'LOAD_MODEL' })
  }, [setModelLoading, setError])

  const detect = useCallback((imageData: ImageData) => {
    if (!workerRef.current) return
    workerRef.current.postMessage({ type: 'DETECT', payload: imageData })
  }, [])

  return {
    loadModel,
    detect,
    isWorkerReady: workerRef.current !== null
  }
}
