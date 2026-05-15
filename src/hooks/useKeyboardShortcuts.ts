import { useEffect } from 'react'

interface UseKeyboardShortcutsProps {
  onStartDetection: () => void
  onStopDetection: () => void
  onScreenshot: () => void
  onResetTracking: () => void
  isDetecting: boolean
}

export const useKeyboardShortcuts = ({
  onStartDetection,
  onStopDetection,
  onScreenshot,
  onResetTracking,
  isDetecting
}: UseKeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault()
          if (isDetecting) {
            onStopDetection()
          } else {
            onStartDetection()
          }
          break
        case 's':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            onScreenshot()
          }
          break
        case 'r':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            onResetTracking()
          }
          break
        case 'escape':
          if (isDetecting) {
            onStopDetection()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onStartDetection, onStopDetection, onScreenshot, onResetTracking, isDetecting])
}
