import type * as cocoSsd from '@tensorflow-models/coco-ssd'

type ModelType = cocoSsd.ObjectDetection

interface Prediction {
  bbox: [number, number, number, number]
  class: string
  score: number
}

interface DetectedObject {
  bbox: {
    left: number
    top: number
    width: number
    height: number
  }
  class: string
  score: number
}

let model: ModelType | null = null

const loadModel = async (): Promise<void> => {
  try {
    const cocoSsdModule = await import('@tensorflow-models/coco-ssd')
    model = await cocoSsdModule.load()
    self.postMessage({ type: 'MODEL_LOADED' })
  } catch (error) {
    self.postMessage({
      type: 'ERROR',
      payload: error instanceof Error ? error.message : '模型加载失败'
    })
  }
}

const detectObjects = async (imageData: ImageData): Promise<void> => {
  if (!model) {
    self.postMessage({ type: 'ERROR', payload: '模型未加载' })
    return
  }

  try {
    const predictions: Prediction[] = await model.detect(imageData)
    const detectedObjects: DetectedObject[] = predictions.map((pred: Prediction) => ({
      bbox: {
        left: pred.bbox[0],
        top: pred.bbox[1],
        width: pred.bbox[2],
        height: pred.bbox[3],
      },
      class: pred.class,
      score: pred.score,
    }))

    self.postMessage({
      type: 'DETECTION_RESULT',
      payload: detectedObjects
    })
  } catch (error) {
    self.postMessage({
      type: 'ERROR',
      payload: error instanceof Error ? error.message : '检测失败'
    })
  }
}

self.onmessage = async (event: MessageEvent) => {
  const { type, payload } = event.data

  switch (type) {
    case 'LOAD_MODEL':
      await loadModel()
      break
    case 'DETECT':
      detectObjects(payload)
      break
    default:
      self.postMessage({ type: 'ERROR', payload: '未知消息类型' })
  }
}
