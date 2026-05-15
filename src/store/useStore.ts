import { create } from 'zustand'

export interface BoundingBox {
  left: number
  top: number
  width: number
  height: number
}

export interface DetectedObject {
  bbox: BoundingBox
  class: string
  score: number
}

export interface TrackedObject extends DetectedObject {
  id: string
  color: string
  trajectory: Array<{ x: number; y: number; timestamp: number }>
}

interface AppState {
  isDetecting: boolean
  isTracking: boolean
  showTrajectory: boolean
  showFps: boolean
  modelLoading: boolean
  modelLoaded: boolean
  fps: number
  detectedObjects: DetectedObject[]
  trackedObject: TrackedObject | null
  selectedObject: DetectedObject | null
  error: string | null

  setIsDetecting: (value: boolean) => void
  setIsTracking: (value: boolean) => void
  setShowTrajectory: (value: boolean) => void
  setShowFps: (value: boolean) => void
  setModelLoading: (value: boolean) => void
  setModelLoaded: (value: boolean) => void
  setFps: (value: number) => void
  setDetectedObjects: (objects: DetectedObject[]) => void
  setTrackedObject: (obj: TrackedObject | null) => void
  setSelectedObject: (obj: DetectedObject | null) => void
  setError: (error: string | null) => void
  resetTracking: () => void
}

export const useStore = create<AppState>((set) => ({
  isDetecting: false,
  isTracking: false,
  showTrajectory: true,
  showFps: true,
  modelLoading: false,
  modelLoaded: false,
  fps: 0,
  detectedObjects: [],
  trackedObject: null,
  selectedObject: null,
  error: null,

  setIsDetecting: (value) => set({ isDetecting: value }),
  setIsTracking: (value) => set({ isTracking: value }),
  setShowTrajectory: (value) => set({ showTrajectory: value }),
  setShowFps: (value) => set({ showFps: value }),
  setModelLoading: (value) => set({ modelLoading: value }),
  setModelLoaded: (value) => set({ modelLoaded: value }),
  setFps: (value) => set({ fps: value }),
  setDetectedObjects: (objects) => set({ detectedObjects: objects }),
  setTrackedObject: (obj) => set({ trackedObject: obj }),
  setSelectedObject: (obj) => set({ selectedObject: obj }),
  setError: (error) => set({ error }),
  resetTracking: () => set({ trackedObject: null, selectedObject: null, isTracking: false }),
}))
