'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import { WidgetData } from '@/lib/types'
import RestaurantWidget from './RestaurantWidget'
import AttractionWidget from './AttractionWidget'
import HotelWidget from './HotelWidget'

interface WidgetContainerProps {
  widgets: WidgetData[]
}

export default function WidgetContainer({ widgets }: WidgetContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  
  if (widgets.length === 0) return null

  // Flatten all items from all widgets into a single array
  const allItems: Array<{ type: string; data: any; index: number }> = []
  
  widgets.forEach((widget) => {
    if (widget.type === 'restaurant' && widget.data.restaurants) {
      widget.data.restaurants.forEach((restaurant: any, idx: number) => {
        allItems.push({ type: 'restaurant', data: restaurant, index: idx })
      })
    } else if (widget.type === 'attraction' && widget.data.attractions) {
      widget.data.attractions.forEach((attraction: any, idx: number) => {
        allItems.push({ type: 'attraction', data: attraction, index: idx })
      })
    } else if (widget.type === 'hotel' && widget.data.amenities) {
      widget.data.amenities.forEach((amenity: any, idx: number) => {
        allItems.push({ type: 'hotel', data: amenity, index: idx })
      })
    }
  })

  const scrollLeft = () => {
    if (scrollRef.current) {
      const cardWidth = 300 // Approximate width of one card including gap
      scrollRef.current.scrollBy({ left: -cardWidth * 2, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      const cardWidth = 300 // Approximate width of one card including gap
      scrollRef.current.scrollBy({ left: cardWidth * 2, behavior: 'smooth' })
    }
  }

  // Show arrows if there are more than 3 items
  const showArrows = allItems.length > 3

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.3 }}
      className="relative"
    >
      {/* Carousel Container */}
      <div className="relative">
        {/* Left Arrow */}
        {showArrows && (
          <button
            onClick={scrollLeft}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-neutral-50 text-neutral-700 rounded-full p-2.5 shadow-lg transition-all duration-200 hover:scale-110 border border-neutral-200"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-4 px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {allItems.map((item, idx) => (
            <motion.div
              key={`${item.type}-${item.index}-${idx}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * idx }}
              className="flex-shrink-0 w-72 snap-start"
            >
              {item.type === 'restaurant' && (
                <RestaurantWidget data={{ restaurants: [item.data] }} isCarousel={true} />
              )}
              {item.type === 'attraction' && (
                <AttractionWidget data={{ attractions: [item.data] }} isCarousel={true} />
              )}
              {item.type === 'hotel' && (
                <HotelWidget data={{ amenities: [item.data] }} isCarousel={true} />
              )}
            </motion.div>
          ))}
        </div>

        {/* Right Arrow */}
        {showArrows && (
          <button
            onClick={scrollRight}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-neutral-50 text-neutral-700 rounded-full p-2.5 shadow-lg transition-all duration-200 hover:scale-110 border border-neutral-200"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Scroll Indicators */}
      {allItems.length > 3 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {Array.from({ length: Math.ceil(allItems.length / 3) }).map((_, index) => (
            <div
              key={index}
              className="w-1.5 h-1.5 rounded-full bg-neutral-300 transition-all duration-200"
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}