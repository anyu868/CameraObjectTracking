import React from 'react'
import { Video, Camera, Download, Square } from 'lucide-react'
import { useRecorder } from '../hooks/useRecorder'
import { useScreenshot } from '../hooks/useScreenshot'

interface MediaControlsProps {
  stream: MediaStream | null
  videoRef: React.RefObject<HTMLVideoElement | null>
  canvasRef: React.RefObject<HTMLCanvasElement | null>
}

const MediaControls: React.FC<MediaControlsProps> = ({ stream, videoRef, canvasRef }) => {
  const { isRecording, recordingTime, startRecording, stopRecording, downloadRecording } = useRecorder(stream)
  const { takeScreenshot } = useScreenshot()

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleScreenshot = () => {
    takeScreenshot(canvasRef)
  }

  return (
    <div className="glass-effect rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Video className="w-5 h-5 text-purple-400" />
        <h3 className="text-white font-bold text-lg">媒体控制</h3>
      </div>

      <div className="space-y-3">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={!stream}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
              : 'bg-purple-500 hover:bg-purple-600 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isRecording ? (
            <>
              <Square className="w-5 h-5" />
              停止录制
            </>
          ) : (
            <>
              <Video className="w-5 h-5" />
              开始录制
            </>
          )}
        </button>

        {isRecording && (
          <div className="flex items-center justify-center gap-2 py-2 bg-red-500/20 rounded-lg">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-300 text-sm font-mono">
              {formatTime(recordingTime)}
            </span>
          </div>
        )}

        <button
          onClick={handleScreenshot}
          disabled={!stream}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium bg-green-500 hover:bg-green-600 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Camera className="w-5 h-5" />
          截图保存
        </button>

        {recordingTime > 0 && !isRecording && (
          <button
            onClick={downloadRecording}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium bg-blue-500 hover:bg-blue-600 text-white transition-all"
          >
            <Download className="w-5 h-5" />
            下载视频
          </button>
        )}
      </div>
    </div>
  )
}

export default MediaControls
