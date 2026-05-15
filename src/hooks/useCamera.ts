import { useRef, useState, useCallback } from 'react'

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>
  stream: MediaStream | null
  error: string | null
  isLoading: boolean
  requestCamera: (facingMode?: 'user' | 'environment') => Promise<void>
  stopCamera: () => void
  switchCamera: (facingMode?: 'user' | 'environment') => Promise<void>
}

export const useCamera = (): UseCameraReturn => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const currentFacingMode = useRef<'user' | 'environment'>('user')

  const requestCamera = useCallback(async (facingMode: 'user' | 'environment' = 'user') => {
    setIsLoading(true)
    setError(null)

    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      })

      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        await videoRef.current.play()
      }

      currentFacingMode.current = facingMode
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '无法访问摄像头'
      setError(errorMessage)
      console.error('Camera error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [stream])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [stream])

  const switchCamera = useCallback(async (facingMode?: 'user' | 'environment') => {
    const newFacingMode = facingMode || (currentFacingMode.current === 'user' ? 'environment' : 'user')
    await requestCamera(newFacingMode)
  }, [requestCamera])

  return {
    videoRef,
    stream,
    error,
    isLoading,
    requestCamera,
    stopCamera,
    switchCamera
  }
}
