import { useCallback } from 'react'
import * as cocoSsd from '@tensorflow-models/coco-ssd'
import { useStore, DetectedObject } from '../store/useStore'

let model: cocoSsd.ObjectDetection | null = null

interface UseObjectDetectionReturn {
  loadModel: () => Promise<void>
  detectObjects: (video: HTMLVideoElement) => Promise<DetectedObject[]>
  isModelLoaded: () => boolean
}

export const useObjectDetection = (): UseObjectDetectionReturn => {
  const { setModelLoading, setModelLoaded, setError } = useStore()

  const loadModel = useCallback(async () => {
    setModelLoading(true)
    setError(null)

    try {
      if (!model) {
        console.log('Loading TensorFlow.js model...')
        model = await cocoSsd.load()
        console.log('Model loaded successfully')
      }
      setModelLoaded(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '模型加载失败'
      setError(errorMessage)
      console.error('Model loading error:', err)
    } finally {
      setModelLoading(false)
    }
  }, [setModelLoading, setModelLoaded, setError])

  const detectObjects = useCallback(async (video: HTMLVideoElement): Promise<DetectedObject[]> => {
    if (!model) {
      console.warn('Model not loaded yet')
      return []
    }

    try {
      const predictions = await model.detect(video)

      const detectedObjects: DetectedObject[] = predictions.map((pred) => ({
        bbox: {
          left: pred.bbox[0],
          top: pred.bbox[1],
          width: pred.bbox[2],
          height: pred.bbox[3],
        },
        class: pred.class,
        score: pred.score,
      }))

      return detectedObjects
    } catch (err) {
      console.error('Detection error:', err)
      return []
    }
  }, [])

  const isModelLoaded = useCallback(() => {
    return model !== null
  }, [])

  return {
    loadModel,
    detectObjects,
    isModelLoaded
  }
}
