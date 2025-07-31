'use client'

import { X } from 'lucide-react'

interface VoiceRecordingOverlayProps {
  onStop: () => void
}

export default function VoiceRecordingOverlay({ onStop }: VoiceRecordingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="max-w-sm w-full mx-auto text-center space-y-12 p-8">
        {/* Close button */}
        <button
          onClick={onStop}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto hover:bg-gray-200 transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
        
        {/* Audio wave animation */}
        <div className="flex items-center justify-center gap-1.5">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="w-1 h-8 bg-gray-400 rounded-full origin-center"
              style={{
                animation: `audioWave 1.2s ease-in-out ${i * 0.15}s infinite`
              }}
            />
          ))}
        </div>
        
        {/* Stop button */}
        <button
          onClick={onStop}
          className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center mx-auto hover:bg-gray-800 transition-colors"
          aria-label="Stop recording"
        >
          <div className="w-4 h-4 bg-white rounded-sm" />
        </button>
      </div>
    </div>
  )
}