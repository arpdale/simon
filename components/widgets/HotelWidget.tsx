'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Amenity {
  id: string
  name: string
  description: string
  hours: string
  bookable: boolean
  category: string
  icon: string
}

interface HotelWidgetProps {
  data: {
    amenities: Amenity[]
  }
  isCarousel?: boolean
}

export default function HotelWidget({ data, isCarousel = false }: HotelWidgetProps) {
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null)
  const [bookingStep, setBookingStep] = useState<'select' | 'booking'>('select')

  const handleBookAmenity = (amenity: Amenity) => {
    if (amenity.bookable) {
      setSelectedAmenity(amenity)
      setBookingStep('booking')
    }
  }

  return (
    <div className="space-y-3">
      {!isCarousel && (
        <div className="text-sm font-medium text-gray-700 flex items-center">
          <span className="mr-2">🏨</span>
          Hotel Amenities
        </div>
      )}
      
      <div className={isCarousel ? "" : "space-y-2"}>
        {data.amenities.map((amenity, index) => (
          <motion.div
            key={amenity.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`widget-card ${isCarousel ? 'h-full' : ''}`}
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{amenity.icon}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm">
                  {amenity.name}
                </h3>
                <p className="text-xs text-gray-600 mb-1">
                  {amenity.hours}
                </p>
                <p className="text-xs text-gray-700">
                  {amenity.description}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-2 mt-3">
              {amenity.bookable ? (
                <button 
                  onClick={() => handleBookAmenity(amenity)}
                  className="flex-1 bg-primary-500 text-white text-xs py-2 px-3 rounded-lg font-medium"
                >
                  Book Now
                </button>
              ) : (
                <button className="flex-1 border border-gray-300 text-gray-700 text-xs py-2 px-3 rounded-lg font-medium">
                  Learn More
                </button>
              )}
              <button className="flex-1 border border-gray-300 text-gray-700 text-xs py-2 px-3 rounded-lg font-medium">
                Get Info
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedAmenity && bookingStep === 'booking' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50"
            onClick={() => {
              setSelectedAmenity(null)
              setBookingStep('select')
            }}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white rounded-t-xl max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-bold text-gray-900">
                    Book {selectedAmenity.name}
                  </h2>
                  <button
                    onClick={() => {
                      setSelectedAmenity(null)
                      setBookingStep('select')
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xl">{selectedAmenity.icon}</span>
                      <span className="font-medium">{selectedAmenity.name}</span>
                    </div>
                    <p className="text-sm text-gray-700">{selectedAmenity.description}</p>
                    <p className="text-xs text-gray-600 mt-1">Hours: {selectedAmenity.hours}</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Time
                      </label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                        <option>9:00 AM</option>
                        <option>10:00 AM</option>
                        <option>11:00 AM</option>
                        <option>12:00 PM</option>
                        <option>1:00 PM</option>
                        <option>2:00 PM</option>
                        <option>3:00 PM</option>
                        <option>4:00 PM</option>
                        <option>5:00 PM</option>
                      </select>
                    </div>

                    {selectedAmenity.category === 'wellness' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Number of Guests
                        </label>
                        <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                          <option>1 Guest</option>
                          <option>2 Guests (Couples Treatment)</option>
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Special Requests
                      </label>
                      <textarea
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        rows={3}
                        placeholder="Any special requests or notes..."
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button className="flex-1 bg-primary-500 text-white py-3 rounded-lg font-semibold">
                      Confirm Booking
                    </button>
                    <button 
                      onClick={() => setBookingStep('select')}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold"
                    >
                      Back
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}