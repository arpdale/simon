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
    <div className="space-y-4">
      <div className="font-display text-base font-medium text-neutral-800 flex items-center">
        <span className="mr-3 text-lg">🍽️</span>
        Curated Dining
      </div>
      
      <div className="space-y-3">
        {data.restaurants.map((restaurant, index) => (
          <motion.div
            key={restaurant.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="widget-card cursor-pointer hover:shadow-lg hover:border-primary-300 transition-all duration-300 group"
            onClick={() => setSelectedRestaurant(restaurant)}
          >
            <div className="flex space-x-4">
              <img
                src={restaurant.photos[0]}
                alt={restaurant.name}
                className="w-18 h-18 rounded-xl object-cover flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-base font-medium text-neutral-900 tracking-wide mb-1">
                  {restaurant.name}
                </h3>
                <p className="text-sm text-neutral-600 mb-2 font-medium">
                  {restaurant.cuisine} • {restaurant.priceRange} • {restaurant.distance}
                </p>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center">
                    <span className="text-accent-500 text-base">★</span>
                    <span className="text-sm text-neutral-700 ml-1 font-medium">{restaurant.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-neutral-700 line-clamp-2 leading-relaxed">
                  {restaurant.description}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-4">
              <button className="flex-1 luxury-button text-sm py-2 px-4">
                Reserve Table
              </button>
              <button className="flex-1 border border-neutral-300 text-neutral-700 text-sm py-2 px-4 font-medium hover:border-neutral-400 hover:bg-neutral-50 transition-all duration-200">
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
              className="bg-neutral-50 rounded-t-2xl max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="font-display text-2xl font-medium text-neutral-900 tracking-wide">
                    {selectedRestaurant.name}
                  </h2>
                  <button
                    onClick={() => setSelectedRestaurant(null)}
                    className="text-neutral-400 hover:text-neutral-600 text-xl w-8 h-8 flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
                
                <img
                  src={selectedRestaurant.photos[0]}
                  alt={selectedRestaurant.name}
                  className="w-full h-56 rounded-2xl object-cover mb-6 shadow-lg"
                />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 font-medium">
                      {selectedRestaurant.cuisine} • {selectedRestaurant.priceRange}
                    </span>
                    <div className="flex items-center">
                      <span className="text-accent-500 text-lg">★</span>
                      <span className="text-neutral-700 ml-1 font-medium">
                        {selectedRestaurant.rating}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-neutral-700 leading-relaxed">
                    {selectedRestaurant.description}
                  </p>
                  
                  <div className="text-neutral-600 font-medium flex items-center">
                    <span className="mr-2">📍</span>
                    {selectedRestaurant.distance} from hotel
                  </div>
                  
                  <div className="flex space-x-4 pt-6">
                    <button className="flex-1 luxury-button py-3 text-base">
                      Make Reservation
                    </button>
                    <button className="flex-1 border border-neutral-300 text-neutral-700 py-3 font-medium hover:border-neutral-400 hover:bg-white transition-all duration-200">
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