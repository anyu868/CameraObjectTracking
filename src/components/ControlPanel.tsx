import React from 'react'
import { Camera, RefreshCw, Play, Pause, Trash2 } from 'lucide-react'
import { useStore } from '../store/useStore'

interface ControlPanelProps {
  onStartDetection: () => void
  onStopDetection: () => void
  onSwitchCamera: () => void
  isCameraActive: boolean
  isModelLoaded: boolean
  isModelLoading: boolean
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onStartDetection,
  onStopDetection,
  onSwitchCamera,
  isCameraActive,
  isModelLoaded,
  isModelLoading
}) => {
  const {
    isDetecting,
    showTrajectory,
    showFps,
    setShowTrajectory,
    setShowFps,
    trackedObject,
    resetTracking
  } = useStore()

  const handleToggleDetection = () => {
    if (isDetecting) {
      onStopDetection()
    } else {
      onStartDetection()
    }
  }

  return (
    <div className="glass-effect rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Camera className="w-5 h-5 text-blue-400" />
        <h3 className="text-white font-bold text-lg">控制面板</h3>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleToggleDetection}
          disabled={!isCameraActive || isModelLoading}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
            isDetecting
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isDetecting ? (
            <>
              <Pause className="w-5 h-5" />
              停止检测
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              开始检测
            </>
          )}
        </button>

        <button
          onClick={onSwitchCamera}
          disabled={!isCameraActive || isDetecting}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium bg-purple-500 hover:bg-purple-600 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className="w-5 h-5" />
          切换摄像头
        </button>

        {trackedObject && (
          <button
            onClick={resetTracking}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium bg-orange-500 hover:bg-orange-600 text-white transition-all"
          >
            <Trash2 className="w-5 h-5" />
            重置跟踪
          </button>
        )}
      </div>

      <div className="border-t border-white/20 pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-sm">显示轨迹</span>
          <button
            onClick={() => setShowTrajectory(!showTrajectory)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              showTrajectory ? 'bg-blue-500' : 'bg-gray-600'
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                showTrajectory ? 'translate-x-6' : ''
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-sm">显示FPS</span>
          <button
            onClick={() => setShowFps(!showFps)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              showFps ? 'bg-blue-500' : 'bg-gray-600'
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                showFps ? 'translate-x-6' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {!isModelLoaded && !isModelLoading && (
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3">
          <p className="text-yellow-300 text-xs">
            模型未加载,请等待加载完成
          </p>
        </div>
      )}

      {isModelLoading && (
        <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
            <p className="text-blue-300 text-xs">正在加载AI模型...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ControlPanel
