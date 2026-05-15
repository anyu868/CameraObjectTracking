import React from 'react'
import { Camera, CameraOff, Brain, Activity } from 'lucide-react'
import { useStore } from '../store/useStore'

interface StatusPanelProps {
  isCameraActive: boolean
}

const StatusPanel: React.FC<StatusPanelProps> = ({ isCameraActive }) => {
  const {
    isDetecting,
    fps,
    detectedObjects,
    trackedObject,
    showFps,
    showTrajectory
  } = useStore()

  return (
    <div className="glass-effect rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-green-400" />
        <h3 className="text-white font-bold text-lg">状态监控</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
          <div className="flex items-center gap-2">
            {isCameraActive ? (
              <Camera className="w-4 h-4 text-green-400" />
            ) : (
              <CameraOff className="w-4 h-4 text-red-400" />
            )}
            <span className="text-gray-300 text-sm">摄像头</span>
          </div>
          <span className={`text-sm font-medium ${
            isCameraActive ? 'text-green-400' : 'text-red-400'
          }`}>
            {isCameraActive ? '已连接' : '未连接'}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-gray-300 text-sm">检测状态</span>
          </div>
          <span className={`text-sm font-medium ${
            isDetecting ? 'text-green-400' : 'text-gray-400'
          }`}>
            {isDetecting ? '运行中' : '已停止'}
          </span>
        </div>

        {showFps && (
          <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
            <span className="text-gray-300 text-sm">帧率 (FPS)</span>
            <span className={`text-sm font-medium ${
              fps >= 20 ? 'text-green-400' : fps >= 10 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {fps}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
          <span className="text-gray-300 text-sm">检测物体数</span>
          <span className="text-sm font-medium text-blue-400">
            {detectedObjects.length}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
          <span className="text-gray-300 text-sm">跟踪状态</span>
          <span className={`text-sm font-medium ${
            trackedObject ? 'text-green-400' : 'text-gray-400'
          }`}>
            {trackedObject ? `跟踪中 (${trackedObject.class})` : '未跟踪'}
          </span>
        </div>

        {trackedObject && showTrajectory && (
          <div className="p-3 bg-gray-800/50 rounded-lg">
            <div className="text-xs text-gray-400 mb-2">跟踪轨迹</div>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: trackedObject.color }}
              />
              <span className="text-sm text-gray-300">
                {trackedObject.trajectory.length} 个轨迹点
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StatusPanel
