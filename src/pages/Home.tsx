import React, { useEffect, useRef } from 'react'
import { Camera, AlertCircle, MousePointer } from 'lucide-react'
import { useCamera } from '../hooks/useCamera'
import { useObjectDetection } from '../hooks/useObjectDetection'
import { useStore } from '../store/useStore'
import { useDetectionController } from '../components/DetectionController'
import VideoPreview from '../components/VideoPreview'
import VideoCanvas from '../components/VideoCanvas'
import ControlPanel from '../components/ControlPanel'
import StatusPanel from '../components/StatusPanel'

const Home: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const {
    stream,
    error: cameraError,
    isLoading: cameraLoading,
    requestCamera,
    switchCamera
  } = useCamera()

  const { loadModel, isModelLoaded } = useObjectDetection()
  const {
    isDetecting,
    setIsDetecting,
    setIsTracking,
    trackedObject,
    error: appError
  } = useStore()

  const { startDetection, stopDetection } = useDetectionController({ videoRef })

  useEffect(() => {
    loadModel()
  }, [loadModel])

  useEffect(() => {
    if (trackedObject) {
      setIsTracking(true)
    }
  }, [trackedObject, setIsTracking])

  const handleStartDetection = async () => {
    if (!stream) {
      await requestCamera()
    }
    setIsDetecting(true)
    startDetection()
  }

  const handleStopDetection = () => {
    setIsDetecting(false)
    setIsTracking(false)
    stopDetection()
  }

  const handleSwitchCamera = () => {
    switchCamera()
  }

  return (
    <div className="min-h-screen gradient-bg p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            VisionTracker
          </h1>
          <p className="text-lg text-gray-200">
            实时物体识别与跟踪系统
          </p>
        </header>

        {cameraError && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
            <div>
              <p className="text-red-300 font-medium">摄像头访问错误</p>
              <p className="text-red-200 text-sm">{cameraError}</p>
            </div>
          </div>
        )}

        {appError && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
            <p className="text-red-300">{appError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Camera className="w-6 h-6" />
                  实时视频
                </h2>
                {isDetecting && (
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <MousePointer className="w-4 h-4" />
                    <span>点击视频中的物体开始跟踪</span>
                  </div>
                )}
              </div>

              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                {!stream && !cameraLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 mb-4">摄像头未启动</p>
                      <button
                        onClick={() => requestCamera()}
                        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                      >
                        启动摄像头
                      </button>
                    </div>
                  </div>
                )}

                {cameraLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
                      <p className="text-gray-400">正在连接摄像头...</p>
                    </div>
                  </div>
                )}

                {stream && (
                  <>
                    <VideoPreview videoRef={videoRef} />
                    <VideoCanvas videoRef={videoRef} />
                  </>
                )}
              </div>

              {isDetecting && trackedObject && (
                <div className="mt-4 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: trackedObject.color }}
                    />
                    <span className="text-blue-300 font-medium">
                      正在跟踪: {trackedObject.class}
                    </span>
                  </div>
                  <p className="text-blue-200 text-sm">
                    置信度: {Math.round(trackedObject.score * 100)}% |
                    位置: ({Math.round(trackedObject.bbox.left)}, {Math.round(trackedObject.bbox.top)}) |
                    轨迹: {trackedObject.trajectory.length} 点
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <ControlPanel
              onStartDetection={handleStartDetection}
              onStopDetection={handleStopDetection}
              onSwitchCamera={handleSwitchCamera}
              isCameraActive={!!stream}
              isModelLoaded={isModelLoaded()}
              isModelLoading={false}
            />

            <StatusPanel isCameraActive={!!stream} />
          </div>
        </div>

        <footer className="text-center text-gray-400 text-sm">
          <p>基于 TensorFlow.js 和 Coco SSD 模型构建</p>
          <p className="mt-1">支持检测 80 种常见物体</p>
        </footer>
      </div>
    </div>
  )
}

export default Home
