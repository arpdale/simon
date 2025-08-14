'use client'

import { useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import MessageInput from '@/components/chat/MessageInput'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Restaurant {
  id: string
  name: string
  description: string
  image: string
}

const categoryTitles: Record<string, string> = {
  'in-room-dining': 'In-Room Dining',
  'nearby-attractions': 'Nearby Attractions'
}

const restaurantData: Restaurant[] = [
  {
    id: 'nobu-malibu',
    name: 'Nobu Malibu',
    description: 'Incredible Japanese fusion with breathtaking oceanfront views. Perfect for special occasions. →',
    image: '/images/nobu-oceanview.jpg'
  },
  {
    id: 'republique',
    name: 'Republique',
    description: 'Housed in a stunning historic building, offering French cuisine in a romantic atmosphere. Their pastries are legendary! →',
    image: '/images/republique-interior.jpg'
  },
  {
    id: 'hiho-cheeseburger',
    name: 'HiHo Cheeseburger',
    description: 'Marina del Rey favorite serving pristine double wagyu cheeseburgers with New Zealand beef, alongside hand-cut fries and McConnell\'s shakes.',
    image: '/images/hiho-burger.jpg'
  },
  {
    id: 'providence',
    name: 'Providence',
    description: 'If you\'re looking for fine dining, this two Michelin-starred seafood restaurant offers an unforgettable experience. →',
    image: '/images/providence-dining.jpg'
  },
  {
    id: 'catch-la',
    name: 'Catch LA',
    description: 'Trendy rooftop spot in West Hollywood with amazing city views and excellent seafood and sushi.',
    image: '/images/catch-la-rooftop.jpg'
  }
]

const carouselImages = [
  { id: 1, src: '/images/nobu-oceanview.jpg', alt: 'Nobu Malibu oceanfront dining' },
  { id: 2, src: '/images/republique-interior.jpg', alt: 'République historic interior' },
]

export default function CategoryChatPage() {
  const params = useParams()
  const router = useRouter()
  const category = params.category as string
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const title = categoryTitles[category] || 'Chat'
  const isInRoomDining = category === 'in-room-dining'

  const handleSendMessage = async (content: string) => {
    // Handle message sending if needed
    console.log('Message sent:', content)
  }

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setCurrentImageIndex((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1))
    } else {
      setCurrentImageIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1))
    }
  }

  return (
    <div className="flex flex-col h-screen max-h-[844px] mx-auto max-w-[390px] w-full">
      {/* Content container with rounded corners and margin from top */}
      <div className="flex-1 bg-white mt-8 md:mt-12 rounded-t-3xl flex flex-col">
        {/* Header */}
        <div className="flex items-center px-4 py-3 border-b border-gray-200">
          <button
            onClick={() => router.push('/')}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 flex items-center justify-center gap-2">
            <img src="/logos/chat-icon-simon.svg" alt="Simon" className="w-8 h-8" />
            <span className="font-semibold text-lg">Simon</span>
          </div>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>

        {/* Category Title */}
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="text-gray-500 text-sm">2. {title}</h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Intro Message */}
          <div className="mb-6">
            <p className="text-gray-900 text-base leading-relaxed">
              Steve, I'm happy to help you!
            </p>
            <p className="text-gray-900 text-base leading-relaxed mt-3">
              The Renaissance Hotel has partnered with some great local restaurants to provide you in-room dining
            </p>
          </div>

          {/* Restaurant List */}
          <div className="space-y-6">
            {restaurantData.map((restaurant) => (
              <div key={restaurant.id} className="space-y-2">
                <h3 className="font-semibold text-lg text-gray-900">{restaurant.name}</h3>
                <p className="text-gray-700 text-base leading-relaxed">{restaurant.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Image Carousel */}
        <div className="mt-8 px-4 pb-4">
          <div className="relative">
            <div className="overflow-hidden rounded-lg">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
              >
                {carouselImages.map((image) => (
                  <div key={image.id} className="w-full flex-shrink-0">
                    <img 
                      src={image.src} 
                      alt={image.alt}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Carousel Navigation */}
            <button
              onClick={() => scrollCarousel('left')}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-md hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-md hover:bg-white transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>

            {/* Carousel Indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

        {/* Message Input */}
        <MessageInput onSendMessage={handleSendMessage} isLoading={false} />
      </div>
    </div>
  )
}