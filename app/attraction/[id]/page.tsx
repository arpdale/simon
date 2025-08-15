'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import SimonHeader from '@/components/SimonHeader'
import { X, Star } from 'lucide-react'

interface Attraction {
  id: string
  name: string
  type: string
  rating: number
  priceLevel: string
  description: string
  detailedDescription?: string
  setting?: string
  mustTry?: string
  experience?: string
  imageUrl: string
  website?: string
  address?: string
  phone?: string
}

export default function AttractionDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const attractionId = params.id as string
  const [attraction, setAttraction] = useState<Attraction | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAttractionDetails()
  }, [attractionId])

  const fetchAttractionDetails = async () => {
    try {
      // Fetch from the nearby attractions API and find the matching attraction
      const response = await fetch('/api/chat/nearby-attractions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: "Get attraction details" 
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get attraction details')
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      let fullResponse = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              try {
                const parsedResponse = JSON.parse(fullResponse)
                const foundAttraction = parsedResponse.attractions.find((a: Attraction) => a.id === attractionId)
                setAttraction(foundAttraction || null)
                setIsLoading(false)
                return
              } catch (e) {
                console.error('Failed to parse response:', e)
                setIsLoading(false)
              }
            } else {
              try {
                const parsed = JSON.parse(data)
                if (parsed.content) {
                  fullResponse += parsed.content
                }
              } catch (e) {
                // Ignore parsing errors
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Attraction details error:', error)
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen max-h-[844px] mx-auto max-w-[390px] w-full">
        <div className="flex-1 bg-white mt-8 md:mt-12 rounded-t-3xl flex flex-col min-h-0">
          <SimonHeader />
          <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 flex flex-col items-center w-full px-4">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center animate-spin-cw-ccw">
              <img 
                src="/logos/bowtie-logo-white-bg.svg" 
                alt="Loading..." 
                className="w-12 h-12"
              />
            </div>
            <p className="text-gray-600 text-sm mt-4 text-center whitespace-nowrap">Loading details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!attraction) {
    return (
      <div className="flex flex-col h-screen max-h-[844px] mx-auto max-w-[390px] w-full">
        <div className="flex-1 bg-white mt-8 md:mt-12 rounded-t-3xl flex flex-col min-h-0">
          <SimonHeader />
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center">
              <p className="text-gray-600 text-lg">Attraction not found</p>
              <button 
                onClick={() => router.back()}
                className="mt-4 text-blue-600 hover:underline"
              >
                Go back
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen max-h-[844px] mx-auto max-w-[390px] w-full">
      {/* Content container with rounded corners and margin from top */}
      <div className="flex-1 bg-white mt-8 md:mt-12 rounded-t-3xl flex flex-col min-h-0">
        {/* Header with close button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h1 className="font-semibold text-xl text-gray-900 truncate flex-1">
            {attraction.name}
          </h1>
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pb-20">
          {/* Attraction Image */}
          <div className="w-full h-48 bg-gray-100">
            <img
              src={attraction.imageUrl}
              alt={attraction.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = '/images/promo-card-image.jpg'
              }}
            />
          </div>

          {/* Attraction Info */}
          <div className="p-4 space-y-4">
            {/* Type and Rating */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-medium text-gray-900">{attraction.type}</span>
                <span className="text-gray-600 ml-2">• {attraction.priceLevel}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-gray-900">{attraction.rating}</span>
              </div>
            </div>

            {/* Detailed Description */}
            {attraction.detailedDescription && (
              <div>
                <p className="text-gray-700 text-base leading-relaxed">
                  {attraction.detailedDescription}
                </p>
              </div>
            )}

            {/* The Setting */}
            {attraction.setting && (
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">The Setting</h3>
                <p className="text-gray-700 text-base leading-relaxed">
                  {attraction.setting}
                </p>
              </div>
            )}

            {/* Must-Try */}
            {attraction.mustTry && (
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Must-Try</h3>
                <p className="text-gray-700 text-base leading-relaxed">
                  {attraction.mustTry}
                </p>
              </div>
            )}

            {/* The Experience */}
            {attraction.experience && (
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">The Experience</h3>
                <p className="text-gray-700 text-base leading-relaxed">
                  {attraction.experience}
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Fixed Action Buttons */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-white border-t border-gray-200 p-4">
          <div className="flex gap-3">
            <button className="flex-1 bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition-colors">
              Reserve a Table
            </button>
            <button className="flex-1 border border-gray-300 text-gray-900 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors">
              Get Directions
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}