'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Message } from '@/lib/types'
import MessageInput from '@/components/chat/MessageInput'
import RestaurantCard from '@/components/cards/RestaurantCard'
import AttractionCard from '@/components/cards/AttractionCard'
import SlidePanel from '@/components/SlidePanel'
import { ChevronLeft } from 'lucide-react'

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

const categoryTitles: Record<string, string> = {
  'in-room-dining': 'In-Room Dining',
  'nearby-attractions': 'Nearby Attractions'
}

const restaurantData: Restaurant[] = [
  {
    id: 'nobu-malibu',
    name: 'Nobu Malibu',
    cuisine: 'Japanese-Peruvian Fusion',
    description: 'Incredible Japanese fusion with breathtaking oceanfront views. Perfect for special occasions.',
    image: '/images/nobu-malibu.jpg',
    rating: 4.8,
    priceRange: '$$$$',
    distance: '25 min',
    features: ['Oceanfront dining', 'Celebrity hotspot', 'Sushi bar'],
    dishes: ['Yellowtail Sashimi with Jalapeño', 'Black Cod Miso', "Nobu's most famous dish"],
    atmosphere: ['Wagyu Beef Tacos', 'Mediterranean-style Live Sweet Shrimp and local Catch of the Day'],
    orderUrl: '/order/nobu-malibu'
  },
  {
    id: 'republique',
    name: 'République',
    cuisine: 'French',
    description: 'Housed in a stunning historic building, offering French cuisine in a romantic atmosphere. Their pastries are legendary!',
    image: '/images/republique.jpg',
    rating: 4.7,
    priceRange: '$$$',
    distance: '15 min',
    features: ['Historic building', 'Bakery', 'Brunch spot'],
    dishes: [],
    atmosphere: [],
    orderUrl: '/order/republique'
  },
  {
    id: 'elephante',
    name: 'Elephante',
    cuisine: 'Mediterranean',
    description: 'A beautiful rooftop restaurant in Santa Monica with Mediterranean cuisine and ocean views. Great for sunset dining.',
    image: '/images/elephante.jpg',
    rating: 4.6,
    priceRange: '$$$',
    distance: '20 min',
    features: ['Rooftop dining', 'Ocean views', 'Sunset spot'],
    dishes: [],
    atmosphere: [],
    orderUrl: '/order/elephante'
  },
  {
    id: 'providence',
    name: 'Providence',
    cuisine: 'Seafood',
    description: "If you're looking for fine dining, this two Michelin-starred seafood restaurant offers an unforgettable experience.",
    image: '/images/providence.jpg',
    rating: 4.9,
    priceRange: '$$$$',
    distance: '18 min',
    features: ['2 Michelin stars', 'Tasting menu', 'Wine pairing'],
    dishes: [],
    atmosphere: [],
    orderUrl: '/order/providence'
  }
]

const attractionData: Attraction[] = [
  {
    id: 'manhattan-beach',
    name: 'Manhattan Beach',
    type: 'Beach',
    description: 'Just 15 minutes away, offers quintessential California vibes with its gorgeous pier, surf scene, and charming downtown filled with local shops and eateries.',
    image: '/images/manhattan-beach.jpg',
    rating: 4.7,
    distance: '15 min',
    features: ['Surfing', 'Beach volleyball', 'Pier walk'],
    directionsUrl: '/directions/manhattan-beach'
  },
  {
    id: 'getty-center',
    name: 'The Getty Center',
    type: 'Museum',
    description: 'sits like a crown above LA, where stunning architecture meets world-class art. Its gardens provide spectacular city views, and admission is free – just pay for parking.',
    image: '/images/getty-center.jpg',
    rating: 4.8,
    distance: '25 min',
    features: ['Free admission', 'Gardens', 'City views', 'Architecture'],
    directionsUrl: '/directions/getty-center'
  },
  {
    id: 'marina-del-rey',
    name: 'Marina del Rey',
    type: 'Harbor',
    description: 'provides a peaceful escape with its luxury harbor views, waterfront dining, and relaxing walking paths – all just 15 minutes from our hotel.',
    image: '/images/marina-del-rey.jpg',
    rating: 4.5,
    distance: '15 min',
    features: ['Waterfront dining', 'Boat tours', 'Walking paths'],
    directionsUrl: '/directions/marina-del-rey'
  }
]

export default function CategoryChatPage() {
  const params = useParams()
  const router = useRouter()
  const category = params.category as string
  const [selectedItem, setSelectedItem] = useState<Restaurant | Attraction | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const title = categoryTitles[category] || 'Chat'
  const isInRoomDining = category === 'in-room-dining'
  const isNearbyAttractions = category === 'nearby-attractions'

  const introMessage = isInRoomDining 
    ? "Steve, I'm happy to help you!\n\nThe Renaissance Hotel has partnered with some great local restaurants to provide you in-room dining"
    : "Steve, I'm happy to help you!\n\nThe Renaissance Hotel has partnered with some great local attractions to provide you information"

  const handleItemClick = (item: Restaurant | Attraction) => {
    setSelectedItem(item)
    setIsPanelOpen(true)
  }

  const handleSendMessage = async (content: string) => {
    // Handle message sending if needed
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 px-4 py-3 flex items-center">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 flex items-center justify-center gap-3">
          <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
            <img src="/logos/logo-black-bg.svg" alt="Simon" className="w-8 h-8" />
          </div>
          <span className="font-medium text-lg">Simon</span>
        </div>
        <div className="w-9" /> {/* Spacer for centering */}
      </div>

      {/* Category Badge */}
      <div className="bg-white/90 backdrop-blur-sm px-4 py-2 flex justify-center border-b border-gray-200">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
          {title}
        </span>
      </div>

      {/* Chat Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 bg-white/50 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Intro Message */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-gray-700 whitespace-pre-line">{introMessage}</p>
          </div>

          {/* Restaurant/Attraction Cards */}
          {isInRoomDining && (
            <div className="space-y-3">
              {restaurantData.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onClick={() => handleItemClick(restaurant)}
                />
              ))}
            </div>
          )}

          {isNearbyAttractions && (
            <div className="space-y-3">
              {attractionData.map((attraction) => (
                <AttractionCard
                  key={attraction.id}
                  attraction={attraction}
                  onClick={() => handleItemClick(attraction)}
                />
              ))}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <MessageInput onSendMessage={handleSendMessage} isLoading={false} />

      {/* Sliding Panel */}
      <SlidePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        item={selectedItem}
      />
    </div>
  )
}