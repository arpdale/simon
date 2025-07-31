'use client'

import { useEffect } from 'react'
import { X, MapPin, Star } from 'lucide-react'

interface Restaurant {
  id: string
  name: string
  cuisine: string
  description: string
  image: string
  rating: number
  priceRange: string
  distance: string
  features: string[]
  dishes: string[]
  atmosphere: string[]
  orderUrl?: string
}

interface Attraction {
  id: string
  name: string
  type: string
  description: string
  image: string
  rating: number
  distance: string
  features: string[]
  directionsUrl: string
}

interface SlidePanelProps {
  isOpen: boolean
  onClose: () => void
  item: Restaurant | Attraction | null
}

export default function SlidePanel({ isOpen, onClose, item }: SlidePanelProps) {
  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!item) return null

  const isRestaurant = 'cuisine' in item
  const restaurant = isRestaurant ? item as Restaurant : null
  const attraction = !isRestaurant ? item as Attraction : null

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 transform transition-transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } overflow-y-auto`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
          <h2 className="font-semibold text-lg">{item.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Hero Image */}
          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={item.image || '/placeholder.jpg'}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Basic Info */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              {isRestaurant ? restaurant?.cuisine : attraction?.type}
            </p>
            
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-medium">{item.rating}</span>
              </span>
              {restaurant?.priceRange && (
                <span className="text-gray-600">{restaurant.priceRange}</span>
              )}
              <span className="flex items-center gap-1 text-gray-600">
                <MapPin className="w-4 h-4" />
                {item.distance}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-gray-700">{item.description}</p>
          </div>

          {/* Features */}
          {item.features && item.features.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Features</h3>
              <ul className="list-disc list-inside space-y-1">
                {item.features.map((feature, index) => (
                  <li key={index} className="text-gray-700">{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Restaurant-specific sections */}
          {restaurant && (
            <>
              {restaurant.dishes && restaurant.dishes.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Signature Dishes</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {restaurant.dishes.map((dish, index) => (
                      <li key={index} className="text-gray-700">{dish}</li>
                    ))}
                  </ul>
                </div>
              )}

              {restaurant.atmosphere && restaurant.atmosphere.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Notable Features</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {restaurant.atmosphere.map((item, index) => (
                      <li key={index} className="text-gray-700">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {/* CTA Button */}
          <div className="pt-4">
            {restaurant && restaurant.orderUrl && (
              <button className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                Order from Menu
              </button>
            )}
            {attraction && attraction.directionsUrl && (
              <button className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                Get Directions
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}