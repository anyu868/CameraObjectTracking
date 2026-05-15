import { useCallback, useRef } from 'react'
import { useStore, DetectedObject, TrackedObject, BoundingBox } from '../store/useStore'

interface UseObjectTrackingReturn {
  selectTarget: (detectedObject: DetectedObject) => void
  updateTrack: (detectedObjects: DetectedObject[], timestamp: number) => TrackedObject | null
  resetTracking: () => void
}

const generateObjectId = (): string => {
  return `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

const generateObjectColor = (): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

const calculateIOU = (box1: BoundingBox, box2: BoundingBox): number => {
  const x1 = Math.max(box1.left, box2.left)
  const y1 = Math.max(box1.top, box2.top)
  const x2 = Math.min(box1.left + box1.width, box2.left + box2.width)
  const y2 = Math.min(box1.top + box1.height, box2.top + box2.height)

  if (x2 < x1 || y2 < y1) return 0

  const intersection = (x2 - x1) * (y2 - y1)
  const union = box1.width * box1.height + box2.width * box2.height - intersection

  return intersection / union
}

const calculateCenterDistance = (box1: BoundingBox, box2: BoundingBox): number => {
  const center1 = {
    x: box1.left + box1.width / 2,
    y: box1.top + box1.height / 2
  }
  const center2 = {
    x: box2.left + box2.width / 2,
    y: box2.top + box2.height / 2
  }

  return Math.sqrt(Math.pow(center1.x - center2.x, 2) + Math.pow(center1.y - center2.y, 2))
}

export const useObjectTracking = (): UseObjectTrackingReturn => {
  const {
    trackedObject,
    setTrackedObject,
    setSelectedObject
  } = useStore()

  const lastMatchedObject = useRef<TrackedObject | null>(null)

  const selectTarget = useCallback((detectedObject: DetectedObject) => {
    const newTrackedObject: TrackedObject = {
      ...detectedObject,
      id: generateObjectId(),
      color: generateObjectColor(),
      trajectory: [
        {
          x: detectedObject.bbox.left + detectedObject.bbox.width / 2,
          y: detectedObject.bbox.top + detectedObject.bbox.height / 2,
          timestamp: Date.now()
        }
      ]
    }

    setTrackedObject(newTrackedObject)
    setSelectedObject(detectedObject)
    lastMatchedObject.current = newTrackedObject
  }, [setTrackedObject, setSelectedObject])

  const updateTrack = useCallback((detectedObjects: DetectedObject[], timestamp: number): TrackedObject | null => {
    if (!trackedObject) {
      return null
    }

    let bestMatch: DetectedObject | null = null
    let bestScore = -1

    for (const obj of detectedObjects) {
      if (obj.class !== trackedObject.class) continue

      const iou = calculateIOU(trackedObject.bbox, obj.bbox)
      const distance = calculateCenterDistance(trackedObject.bbox, obj.bbox)

      const iouScore = iou * 0.7
      const distanceScore = Math.max(0, 1 - distance / 500) * 0.3
      const score = iouScore + distanceScore

      if (score > bestScore) {
        bestScore = score
        bestMatch = obj
      }
    }

    if (bestMatch && bestScore > 0.3) {
      const updatedTrackedObject: TrackedObject = {
        ...trackedObject,
        bbox: bestMatch.bbox,
        score: bestMatch.score,
        trajectory: [
          ...trackedObject.trajectory,
          {
            x: bestMatch.bbox.left + bestMatch.bbox.width / 2,
            y: bestMatch.bbox.top + bestMatch.bbox.height / 2,
            timestamp
          }
        ].slice(-50)
      }

      setTrackedObject(updatedTrackedObject)
      lastMatchedObject.current = updatedTrackedObject
      return updatedTrackedObject
    }

    return lastMatchedObject.current
  }, [trackedObject, setTrackedObject])

  const resetTracking = useCallback(() => {
    setTrackedObject(null)
    setSelectedObject(null)
    lastMatchedObject.current = null
  }, [setTrackedObject, setSelectedObject])

  return {
    selectTarget,
    updateTrack,
    resetTracking
  }
}
