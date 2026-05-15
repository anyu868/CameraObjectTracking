import { useCallback } from 'react'

interface UseScreenshotReturn {
  takeScreenshot: (canvasRef: React.RefObject<HTMLCanvasElement | null>) => void
}

export const useScreenshot = (): UseScreenshotReturn => {
  const takeScreenshot = useCallback((canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dataUrl = canvas.toDataURL('image/png')
    
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `VisionTracker_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }, [])

  return {
    takeScreenshot
  }
}
