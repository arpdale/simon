'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Restaurant {
  name: string
  cuisine: string
  rating: number
  priceRange: string
  distance: string
  description: string
  photos: string[]
}

interface RestaurantWidgetProps {
  data: {
    restaurants: Restaurant[]
  }
}

export default function RestaurantWidget({ data }: RestaurantWidgetProps) {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-700 flex items-center">
        <span className="mr-2">🍽️</span>
        Restaurant Recommendations
      </div>
      
      <div className="space-y-2">
        {data.restaurants.map((restaurant, index) => (
          <motion.div
            key={restaurant.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="widget-card cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedRestaurant(restaurant)}
          >
            <div className="flex space-x-3">
              <img
                src={restaurant.photos[0]}
                alt={restaurant.name}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm">
                  {restaurant.name}
                </h3>
                <p className="text-xs text-gray-600 mb-1">
                  {restaurant.cuisine} • {restaurant.priceRange} • {restaurant.distance}
                </p>
                <div className="flex items-center space-x-2 mb-1">
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-sm">⭐</span>
                    <span className="text-xs text-gray-600 ml-1">{restaurant.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-700 line-clamp-2">
                  {restaurant.description}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-2 mt-3">
              <button className="flex-1 bg-primary-500 text-white text-xs py-2 px-3 rounded-lg font-medium">
                Book Table
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 text-xs py-2 px-3 rounded-lg font-medium">
                View Menu
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedRestaurant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50"
            onClick={() => setSelectedRestaurant(null)}
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
                    {selectedRestaurant.name}
                  </h2>
                  <button
                    onClick={() => setSelectedRestaurant(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <img
                  src={selectedRestaurant.photos[0]}
                  alt={selectedRestaurant.name}
                  className="w-full h-48 rounded-lg object-cover mb-4"
                />
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {selectedRestaurant.cuisine} • {selectedRestaurant.priceRange}
                    </span>
                    <div className="flex items-center">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-sm text-gray-600 ml-1">
                        {selectedRestaurant.rating}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700">
                    {selectedRestaurant.description}
                  </p>
                  
                  <div className="text-sm text-gray-600">
                    📍 {selectedRestaurant.distance} from hotel
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button className="flex-1 bg-primary-500 text-white py-3 rounded-lg font-semibold">
                      Make Reservation
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold">
                      Call Restaurant
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