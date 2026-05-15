import React from 'react'

interface VideoPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  isMirrored?: boolean
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ videoRef, isMirrored = true }) => {
  return (
    <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        className={`w-full h-full object-cover ${isMirrored ? 'scale-x-[-1]' : ''}`}
        playsInline
        muted
        autoPlay
      />
    </div>
  )
}

export default VideoPreview
