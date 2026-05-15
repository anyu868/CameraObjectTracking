import React, { useRef, useEffect, useCallback } from 'react'
import { useStore, DetectedObject, TrackedObject } from '../store/useStore'
import { useObjectTracking } from '../hooks/useObjectTracking'

interface VideoCanvasProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
}

const VideoCanvas: React.FC<VideoCanvasProps> = ({ videoRef }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const {
    detectedObjects,
    trackedObject,
    selectedObject,
    showTrajectory,
    isDetecting,
    showFps,
    fps
  } = useStore()

  const { selectTarget } = useObjectTracking()

  const drawDetections = useCallback((
    ctx: CanvasRenderingContext2D,
    objects: DetectedObject[],
    tracked: TrackedObject | null,
    selected: DetectedObject | null
  ) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    objects.forEach((obj) => {
      const { bbox, class: className, score } = obj
      const isSelected = selected && selected.bbox === bbox && selected.class === className

      const color = tracked && bbox === tracked.bbox && className === tracked.class
        ? tracked.color
        : '#3B82F6'

      ctx.strokeStyle = color
      ctx.lineWidth = isSelected ? 4 : 2
      ctx.strokeRect(bbox.left, bbox.top, bbox.width, bbox.height)

      if (isSelected) {
        ctx.shadowColor = color
        ctx.shadowBlur = 10
        ctx.strokeRect(bbox.left, bbox.top, bbox.width, bbox.height)
        ctx.shadowBlur = 0
      }

      const label = `${className} ${Math.round(score * 100)}%`
      const textMetrics = ctx.measureText(label)
      const padding = 8
      const textHeight = 20

      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(
        bbox.left,
        bbox.top - textHeight - padding,
        textMetrics.width + padding * 2,
        textHeight + padding
      )

      ctx.fillStyle = color
      ctx.font = 'bold 14px Arial'
      ctx.fillText(label, bbox.left + padding, bbox.top - padding)
    })
  }, [])

  const drawTrajectory = useCallback((
    ctx: CanvasRenderingContext2D,
    tracked: TrackedObject
  ) => {
    if (!showTrajectory || tracked.trajectory.length < 2) return

    ctx.strokeStyle = tracked.color
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])

    ctx.beginPath()
    tracked.trajectory.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y)
      } else {
        ctx.lineTo(point.x, point.y)
      }
    })
    ctx.stroke()
    ctx.setLineDash([])

    tracked.trajectory.forEach((point, index) => {
      const alpha = index / tracked.trajectory.length
      ctx.beginPath()
      ctx.arc(point.x, point.y, 3 + alpha * 5, 0, Math.PI * 2)

      if (tracked.color.startsWith('#')) {
        const r = parseInt(tracked.color.slice(1, 3), 16)
        const g = parseInt(tracked.color.slice(3, 5), 16)
        const b = parseInt(tracked.color.slice(5, 7), 16)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
      }

      ctx.fill()
    })
  }, [showTrajectory])

  const drawFPS = useCallback((ctx: CanvasRenderingContext2D, currentFPS: number) => {
    if (!showFps) return

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.fillRect(10, 10, 80, 30)

    ctx.fillStyle = '#10B981'
    ctx.font = 'bold 16px Arial'
    ctx.fillText(`FPS: ${currentFPS}`, 20, 30)
  }, [showFps])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const video = videoRef.current
    if (video) {
      canvas.width = video.videoWidth || 640
      canvas.height = video.videoHeight || 480
    }

    if (isDetecting) {
      drawDetections(ctx, detectedObjects, trackedObject, selectedObject)
      if (trackedObject) {
        drawTrajectory(ctx, trackedObject)
      }
      drawFPS(ctx, fps)
    }
  }, [videoRef, detectedObjects, trackedObject, selectedObject, isDetecting, fps, drawDetections, drawTrajectory, drawFPS])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDetecting || detectedObjects.length === 0) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const clickX = (e.clientX - rect.left) * scaleX
    const clickY = (e.clientY - rect.top) * scaleY

    for (const obj of detectedObjects) {
      const { bbox } = obj
      if (
        clickX >= bbox.left &&
        clickX <= bbox.left + bbox.width &&
        clickY >= bbox.top &&
        clickY <= bbox.top + bbox.height
      ) {
        selectTarget(obj)
        break
      }
    }
  }

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full cursor-pointer"
        onClick={handleCanvasClick}
      />
      {isDetecting && trackedObject && (
        <div className="absolute top-4 left-4 glass-effect rounded-lg p-3 max-w-xs">
          <div className="text-white text-sm">
            <div className="font-bold mb-2 flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: trackedObject.color }}
              />
              跟踪中: {trackedObject.class}
            </div>
            <div className="text-xs opacity-80">
              位置: ({Math.round(trackedObject.bbox.left)}, {Math.round(trackedObject.bbox.top)})
            </div>
            <div className="text-xs opacity-80">
              轨迹点: {trackedObject.trajectory.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoCanvas
