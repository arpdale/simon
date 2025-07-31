import { ChevronRight } from 'lucide-react'

interface Restaurant {
  id: string
  name: string
  cuisine: string
  description: string
  rating?: number
  priceRange?: string
  distance?: string
}

interface RestaurantCardProps {
  restaurant: Restaurant
  onClick: () => void
}

export default function RestaurantCard({ restaurant, onClick }: RestaurantCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
            {restaurant.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{restaurant.cuisine}</p>
          <p className="text-gray-700 mt-2 line-clamp-2">{restaurant.description}</p>
          
          {/* Metadata */}
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
            {restaurant.rating && (
              <span className="flex items-center gap-1">
                <span>⭐</span>
                <span>{restaurant.rating}</span>
              </span>
            )}
            {restaurant.priceRange && <span>{restaurant.priceRange}</span>}
            {restaurant.distance && <span>{restaurant.distance}</span>}
          </div>
        </div>
        
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors ml-4 flex-shrink-0 mt-1" />
      </div>
    </div>
  )
}