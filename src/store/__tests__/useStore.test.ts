import { useStore } from '../useStore'

describe('useStore', () => {
  beforeEach(() => {
    useStore.setState({
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
      error: null
    })
  })

  it('should have correct initial state', () => {
    const state = useStore.getState()

    expect(state.isDetecting).toBe(false)
    expect(state.isTracking).toBe(false)
    expect(state.showTrajectory).toBe(true)
    expect(state.showFps).toBe(true)
    expect(state.modelLoading).toBe(false)
    expect(state.modelLoaded).toBe(false)
    expect(state.fps).toBe(0)
    expect(state.detectedObjects).toEqual([])
    expect(state.trackedObject).toBeNull()
    expect(state.selectedObject).toBeNull()
    expect(state.error).toBeNull()
  })

  it('should update isDetecting', () => {
    const { setIsDetecting } = useStore.getState()

    setIsDetecting(true)
    expect(useStore.getState().isDetecting).toBe(true)

    setIsDetecting(false)
    expect(useStore.getState().isDetecting).toBe(false)
  })

  it('should update isTracking', () => {
    const { setIsTracking } = useStore.getState()

    setIsTracking(true)
    expect(useStore.getState().isTracking).toBe(true)

    setIsTracking(false)
    expect(useStore.getState().isTracking).toBe(false)
  })

  it('should update showTrajectory', () => {
    const { setShowTrajectory } = useStore.getState()

    setShowTrajectory(false)
    expect(useStore.getState().showTrajectory).toBe(false)

    setShowTrajectory(true)
    expect(useStore.getState().showTrajectory).toBe(true)
  })

  it('should update showFps', () => {
    const { setShowFps } = useStore.getState()

    setShowFps(false)
    expect(useStore.getState().showFps).toBe(false)

    setShowFps(true)
    expect(useStore.getState().showFps).toBe(true)
  })

  it('should update modelLoading', () => {
    const { setModelLoading } = useStore.getState()

    setModelLoading(true)
    expect(useStore.getState().modelLoading).toBe(true)

    setModelLoading(false)
    expect(useStore.getState().modelLoading).toBe(false)
  })

  it('should update modelLoaded', () => {
    const { setModelLoaded } = useStore.getState()

    setModelLoaded(true)
    expect(useStore.getState().modelLoaded).toBe(true)

    setModelLoaded(false)
    expect(useStore.getState().modelLoaded).toBe(false)
  })

  it('should update fps', () => {
    const { setFps } = useStore.getState()

    setFps(30)
    expect(useStore.getState().fps).toBe(30)

    setFps(60)
    expect(useStore.getState().fps).toBe(60)
  })

  it('should update detectedObjects', () => {
    const { setDetectedObjects } = useStore.getState()

    const objects = [
      {
        bbox: { left: 10, top: 20, width: 100, height: 150 },
        class: 'person',
        score: 0.95
      }
    ]

    setDetectedObjects(objects)
    expect(useStore.getState().detectedObjects).toEqual(objects)
  })

  it('should update trackedObject', () => {
    const { setTrackedObject } = useStore.getState()

    const trackedObj = {
      id: 'test-id',
      bbox: { left: 10, top: 20, width: 100, height: 150 },
      class: 'person',
      score: 0.95,
      color: '#FF0000',
      trajectory: []
    }

    setTrackedObject(trackedObj)
    expect(useStore.getState().trackedObject).toEqual(trackedObj)
  })

  it('should update selectedObject', () => {
    const { setSelectedObject } = useStore.getState()

    const selectedObj = {
      bbox: { left: 10, top: 20, width: 100, height: 150 },
      class: 'person',
      score: 0.95
    }

    setSelectedObject(selectedObj)
    expect(useStore.getState().selectedObject).toEqual(selectedObj)
  })

  it('should update error', () => {
    const { setError } = useStore.getState()

    setError('Camera access denied')
    expect(useStore.getState().error).toBe('Camera access denied')

    setError(null)
    expect(useStore.getState().error).toBeNull()
  })

  it('should reset tracking state', () => {
    const { setTrackedObject, setSelectedObject, setIsTracking, resetTracking } = useStore.getState()

    setTrackedObject({
      id: 'test-id',
      bbox: { left: 10, top: 20, width: 100, height: 150 },
      class: 'person',
      score: 0.95,
      color: '#FF0000',
      trajectory: []
    })
    setSelectedObject({
      bbox: { left: 10, top: 20, width: 100, height: 150 },
      class: 'person',
      score: 0.95
    })
    setIsTracking(true)

    resetTracking()

    const state = useStore.getState()
    expect(state.trackedObject).toBeNull()
    expect(state.selectedObject).toBeNull()
    expect(state.isTracking).toBe(false)
  })
})
