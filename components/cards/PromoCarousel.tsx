'use client'

import { useState, useRef, useEffect } from 'react'
import PromoCard from './PromoCard'
import { useRouter } from 'next/navigation'

interface PromoData {
  id: string
  title: string
  description: string
  buttonText: string
  imageUrl: string
  link: string
}

const promoData: PromoData[] = [
  {
    id: 'dining',
    title: 'Hungry?',
    description: 'Get 20% off your first in-room dining order',
    buttonText: 'See Menu',
    imageUrl: '/images/promo-food.png',
    link: '/chat/category/in-room-dining'
  },
  {
    id: 'transport',
    title: 'Airport Transfer',
    description: 'Complimentary shuttle service to LAX every 30 minutes',
    buttonText: 'Schedule Ride',
    imageUrl: '/images/promo-shuttle.png',
    link: '/chat/category/transportation'
  },
  {
    id: 'spa',
    title: 'Relax & Unwind',
    description: 'Book a spa treatment and receive a complimentary upgrade',
    buttonText: 'View Services',
    imageUrl: '/images/promo-spa.png',
    link: '/chat/category/spa-services'
  }
]

export default function PromoCarousel() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const isDragging = useRef(false)

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(promoData.length - 1, prev + 1))
  }

  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
  }

  // Touch and mouse handlers for swipe
  const handleStart = (clientX: number) => {
    touchStartX.current = clientX
    touchEndX.current = clientX
    isDragging.current = false
  }

  const handleMove = (clientX: number) => {
    touchEndX.current = clientX
    const diff = Math.abs(touchStartX.current - clientX)
    if (diff > 10) {
      isDragging.current = true
    }
  }

  const handleEnd = () => {
    const swipeThreshold = 30
    const diff = touchStartX.current - touchEndX.current

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left - go to next
        handleNext()
      } else {
        // Swiped right - go to previous
        handlePrevious()
      }
    }
    isDragging.current = false
  }

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    handleStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    handleEnd()
  }

  // Mouse event handlers for desktop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) { // Only if mouse button is pressed
      handleMove(e.clientX)
    }
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault()
    handleEnd()
  }

  return (
    <div className="relative w-full">
      {/* Carousel Container */}
      <div 
        ref={carouselRef}
        className="relative overflow-hidden rounded-xl touch-pan-y select-none cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {promoData.map((promo) => (
            <div key={promo.id} className="w-full flex-shrink-0 px-1">
              <PromoCard
                title={promo.title}
                description={promo.description}
                buttonText={promo.buttonText}
                imageUrl={promo.imageUrl}
                onButtonClick={() => router.push(promo.link)}
              />
            </div>
          ))}
        </div>
      </div>


      {/* Dots Indicator */}
      <div className="flex justify-center gap-1.5 mt-3">
        {promoData.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-gray-800' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to promo ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}