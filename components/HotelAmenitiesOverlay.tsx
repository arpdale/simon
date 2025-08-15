'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface HotelAmenitiesOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export default function HotelAmenitiesOverlay({ isOpen, onClose }: HotelAmenitiesOverlayProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure smooth animation
      setTimeout(() => setIsAnimating(true), 50)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => {
      onClose()
    }, 300) // Match animation duration
  }

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col h-screen max-h-[844px] mx-auto max-w-[390px] w-full">
      {/* Full background image with Renaissance branding */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('/images/renaissance-hotel-background.jpg')`,
          backgroundColor: '#2C1810' // Fallback dark color
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        
        {/* Renaissance Hotels branding */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 text-center text-white">
          <div className="text-6xl font-light mb-2">R</div>
          <div className="text-xl font-light tracking-[0.2em]">RENAISSANCE</div>
          <div className="text-sm font-light tracking-[0.1em] opacity-80">HOTELS</div>
        </div>

        {/* Hotel amenities content */}
        <div className="absolute bottom-32 left-0 right-0 px-6 text-white">
          <div className="space-y-6">
            <h2 className="text-2xl font-light text-center mb-8">Hotel Amenities</h2>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <span>24/7 Fitness Center</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <span>Business Center</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <span>Concierge Services</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <span>Free WiFi</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <span>Airport Shuttle</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <span>Meeting Rooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <span>Valet Parking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <span>Room Service</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated white container that slides down */}
      <div 
        className={`
          relative bg-white transition-all duration-500 ease-out rounded-t-3xl cursor-pointer
          ${isAnimating ? 'transform translate-y-[calc(100vh-120px)]' : 'transform translate-y-0'}
        `}
        style={{ 
          height: '100%',
          minHeight: isAnimating ? '120px' : '100%'
        }}
        onClick={handleBackgroundClick}
      >
        {/* Handle bar for visual feedback */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-300 rounded-full"></div>
        
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Content when not fully expanded */}
        {!isAnimating && (
          <div className="p-6 pt-12">
            <div className="text-center">
              <h3 className="text-xl font-medium text-gray-900 mb-2">Welcome to Renaissance</h3>
              <p className="text-gray-600">Tap the handle above to return to Simon</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}