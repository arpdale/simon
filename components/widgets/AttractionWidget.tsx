'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Attraction {
  name: string
  category: string
  rating: number
  distance: string
  hours: string
  description: string
  photos: string[]
}

interface AttractionWidgetProps {
  data: {
    attractions: Attraction[]
  }
}

export default function AttractionWidget({ data }: AttractionWidgetProps) {
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null)

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'beach': return '🏖️'
      case 'museum': return '🏛️'
      case 'winery': return '🍷'
      case 'hiking': return '🥾'
      case 'shopping': return '🛍️'
      default: return '📍'
    }
  }

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-700 flex items-center">
        <span className="mr-2">🗺️</span>
        Local Attractions
      </div>
      
      <div className="space-y-2">
        {data.attractions.map((attraction, index) => (
          <motion.div
            key={attraction.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="widget-card cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedAttraction(attraction)}
          >
            <div className="flex space-x-3">
              <img
                src={attraction.photos[0]}
                alt={attraction.name}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm">
                  {attraction.name}
                </h3>
                <p className="text-xs text-gray-600 mb-1">
                  {getCategoryIcon(attraction.category)} {attraction.category} • {attraction.distance}
                </p>
                <div className="flex items-center space-x-2 mb-1">
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-sm">⭐</span>
                    <span className="text-xs text-gray-600 ml-1">{attraction.rating}</span>
                  </div>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-600">{attraction.hours}</span>
                </div>
                <p className="text-xs text-gray-700 line-clamp-2">
                  {attraction.description}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-2 mt-3">
              <button className="flex-1 bg-primary-500 text-white text-xs py-2 px-3 rounded-lg font-medium">
                Get Directions
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 text-xs py-2 px-3 rounded-lg font-medium">
                Learn More
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedAttraction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50"
            onClick={() => setSelectedAttraction(null)}
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
                    {selectedAttraction.name}
                  </h2>
                  <button
                    onClick={() => setSelectedAttraction(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <img
                  src={selectedAttraction.photos[0]}
                  alt={selectedAttraction.name}
                  className="w-full h-48 rounded-lg object-cover mb-4"
                />
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {getCategoryIcon(selectedAttraction.category)} {selectedAttraction.category}
                    </span>
                    <div className="flex items-center">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-sm text-gray-600 ml-1">
                        {selectedAttraction.rating}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Hours</div>
                    <div className="text-sm text-gray-900">{selectedAttraction.hours}</div>
                  </div>
                  
                  <p className="text-sm text-gray-700">
                    {selectedAttraction.description}
                  </p>
                  
                  <div className="text-sm text-gray-600">
                    📍 {selectedAttraction.distance} from hotel
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button className="flex-1 bg-primary-500 text-white py-3 rounded-lg font-semibold">
                      Get Directions
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold">
                      Save for Later
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