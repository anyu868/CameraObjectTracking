import { useObjectTracking } from '../useObjectTracking'
import { renderHook, act } from '@testing-library/react'
import { useStore, DetectedObject, TrackedObject } from '../../store/useStore'

const mockSetTrackedObject = jest.fn()
const mockSetSelectedObject = jest.fn()

jest.mock('../../store/useStore', () => ({
  useStore: jest.fn()
}))

describe('useObjectTracking', () => {
  const mockDetectedObject: DetectedObject = {
    bbox: { left: 10, top: 20, width: 100, height: 150 },
    class: 'person',
    score: 0.95
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useStore as unknown as jest.Mock).mockReturnValue({
      trackedObject: null,
      setTrackedObject: mockSetTrackedObject,
      setSelectedObject: mockSetSelectedObject
    })
  })

  describe('selectTarget', () => {
    it('should select a target object', () => {
      const { result } = renderHook(() => useObjectTracking())

      act(() => {
        result.current.selectTarget(mockDetectedObject)
      })

      expect(mockSetTrackedObject).toHaveBeenCalled()
      const trackedObj = mockSetTrackedObject.mock.calls[0][0] as TrackedObject
      expect(trackedObj.class).toBe('person')
      expect(trackedObj.score).toBe(0.95)
      expect(trackedObj.bbox).toEqual({ left: 10, top: 20, width: 100, height: 150 })
      expect(trackedObj.id).toBeDefined()
      expect(trackedObj.color).toBeDefined()
      expect(trackedObj.trajectory).toHaveLength(1)
    })

    it('should add trajectory point with center coordinates', () => {
      const { result } = renderHook(() => useObjectTracking())

      act(() => {
        result.current.selectTarget(mockDetectedObject)
      })

      const trackedObj = mockSetTrackedObject.mock.calls[0][0] as TrackedObject
      const trajectoryPoint = trackedObj.trajectory[0]
      expect(trajectoryPoint.x).toBe(10 + 100 / 2)
      expect(trajectoryPoint.y).toBe(20 + 150 / 2)
      expect(trajectoryPoint.timestamp).toBeDefined()
    })

    it('should set selected object in store', () => {
      const { result } = renderHook(() => useObjectTracking())

      act(() => {
        result.current.selectTarget(mockDetectedObject)
      })

      expect(mockSetSelectedObject).toHaveBeenCalledWith(mockDetectedObject)
    })
  })

  describe('resetTracking', () => {
    it('should reset tracking state', () => {
      const { result } = renderHook(() => useObjectTracking())

      act(() => {
        result.current.resetTracking()
      })

      expect(mockSetTrackedObject).toHaveBeenCalledWith(null)
      expect(mockSetSelectedObject).toHaveBeenCalledWith(null)
    })
  })

  describe('updateTrack', () => {
    it('should return null when no tracked object exists', () => {
      const { result } = renderHook(() => useObjectTracking())

      const detectedObjects: DetectedObject[] = [mockDetectedObject]
      const result_ = result.current.updateTrack(detectedObjects, 1000)

      expect(result_).toBeNull()
    })

    it('should return null when detected objects array is empty', () => {
      ;(useStore as unknown as jest.Mock).mockReturnValue({
        trackedObject: {
          ...mockDetectedObject,
          id: 'test-id',
          color: '#FF0000',
          trajectory: []
        },
        setTrackedObject: mockSetTrackedObject,
        setSelectedObject: mockSetSelectedObject
      })

      const { result } = renderHook(() => useObjectTracking())

      const result_ = result.current.updateTrack([], 1000)

      expect(result_).toBeNull()
    })

    it('should match object by class and IOU', () => {
      ;(useStore as unknown as jest.Mock).mockReturnValue({
        trackedObject: {
          ...mockDetectedObject,
          id: 'test-id',
          color: '#FF0000',
          trajectory: []
        },
        setTrackedObject: mockSetTrackedObject,
        setSelectedObject: mockSetSelectedObject
      })

      const { result } = renderHook(() => useObjectTracking())

      const newDetectedObject: DetectedObject = {
        bbox: { left: 15, top: 25, width: 100, height: 150 },
        class: 'person',
        score: 0.9
      }

      act(() => {
        result.current.updateTrack([newDetectedObject], 1000)
      })

      expect(mockSetTrackedObject).toHaveBeenCalled()
    })

    it('should not match different class objects', () => {
      ;(useStore as unknown as jest.Mock).mockReturnValue({
        trackedObject: {
          ...mockDetectedObject,
          id: 'test-id',
          color: '#FF0000',
          trajectory: []
        },
        setTrackedObject: mockSetTrackedObject,
        setSelectedObject: mockSetSelectedObject
      })

      const { result } = renderHook(() => useObjectTracking())

      const carObject: DetectedObject = {
        bbox: { left: 15, top: 25, width: 200, height: 200 },
        class: 'car',
        score: 0.8
      }

      act(() => {
        result.current.updateTrack([carObject], 1000)
      })

      expect(mockSetTrackedObject).not.toHaveBeenCalled()
    })
  })
})
