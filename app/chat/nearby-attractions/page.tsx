'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import MessageInput from '@/components/chat/MessageInput'
import SimonHeader from '@/components/SimonHeader'
import { attractionsStore } from '@/lib/attractionsStore'

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

interface NearbyAttractionsResponse {
  textResponse: string
  attractions: Attraction[]
}

export default function NearbyAttractionsPage() {
  const router = useRouter()
  const [response, setResponse] = useState<NearbyAttractionsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentResponse, setCurrentResponse] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Keep scroll position at top
  const scrollToTop = () => {
    const scrollContainer = document.querySelector('.flex-1.overflow-y-auto')
    if (scrollContainer) {
      scrollContainer.scrollTop = 0
    }
  }

  useEffect(() => {
    fetchNearbyAttractions()
  }, [])

  const fetchNearbyAttractions = async () => {
    const query = "I'd like to know about nearby attractions and things to do"
    
    // Check cache first
    const cached = attractionsStore.getCachedQuery(query)
    if (cached) {
      setResponse({ textResponse: cached.textResponse, attractions: cached.attractions })
      setCurrentResponse('')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setCurrentResponse('')

    try {
      const fetchResponse = await fetch('/api/chat/nearby-attractions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: query 
        }),
      })

      if (!fetchResponse.ok) {
        throw new Error('Failed to get response')
      }

      const reader = fetchResponse.body?.getReader()
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
                setResponse(parsedResponse)
                
                // Cache the result
                if (parsedResponse.attractions) {
                  attractionsStore.cacheQuery(query, parsedResponse.textResponse, parsedResponse.attractions)
                }
                
                setCurrentResponse('')
                setIsLoading(false)
                return
              } catch (e) {
                console.error('Failed to parse final response:', e)
              }
            } else {
              try {
                const parsed = JSON.parse(data)
                if (parsed.content) {
                  fullResponse += parsed.content
                  setCurrentResponse(fullResponse)
                }
              } catch (e) {
                // Ignore parsing errors for malformed chunks
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Nearby attractions error:', error)
      setIsLoading(false)
    }
  }

  const handleSendMessage = async (content: string) => {
    console.log('Message sent:', content)
  }

  return (
    <div className="flex flex-col h-screen max-h-[844px] mx-auto max-w-[390px] w-full">
      {/* Content container with rounded corners and margin from top */}
      <div className="flex-1 bg-white mt-8 md:mt-12 rounded-t-3xl flex flex-col min-h-0">
        {/* Header */}
        <SimonHeader />

        {/* Content */}
        <div className="flex-1 overflow-y-auto pb-20">
          <div className="p-4 space-y-4">
            {/* User Query - Chat Bubble */}
            <div className="flex justify-end mb-4">
              <div className="bg-gray-200 flex flex-row gap-2 items-center justify-start px-4 py-2 rounded-[30px] max-w-[280px]">
                <div className="flex-1 font-normal text-black text-lg text-right">
                  Nearby Attractions
                </div>
                <div className="bg-white relative rounded-full w-8 h-8 border border-gray-400 border-opacity-50 flex items-center justify-center">
                  <span className="font-normal text-gray-600 text-sm">S</span>
                </div>
              </div>
            </div>
            {/* Loading Animation */}
            {isLoading && !response && (
              <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 flex flex-col items-center w-full px-4">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center animate-spin-cw-ccw">
                  <img 
                    src="/logos/bowtie-logo-white-bg.svg" 
                    alt="Loading..." 
                    className="w-12 h-12"
                  />
                </div>
                <p className="text-gray-600 text-sm mt-4 text-center whitespace-nowrap">Discovering local attractions...</p>
              </div>
            )}

            {/* AI Response Text */}
            {response?.textResponse && (
              <div className="mb-6">
                <p className="text-gray-900 text-base leading-relaxed">
                  {response.textResponse}
                </p>
              </div>
            )}

            {/* Attraction Cards */}
            {response?.attractions && response.attractions.length > 0 && (
              <div className="overflow-x-auto mb-6 snap-x snap-mandatory scrollbar-hide">
                <div className="flex gap-2 pb-2">
                  {response.attractions.map((attraction, index) => (
                    <div key={index} className="flex-shrink-0 w-[296px] snap-start">
                      <div className="bg-white border border-gray-300 rounded-[10px] p-[5px] flex gap-3.5 items-center">
                        <div className="w-24 h-24 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
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
                        <div className="flex-1 h-24 flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                            <div className="w-[122px]">
                              <h3 className="font-semibold text-xl text-gray-800 truncate">
                                {attraction.name}
                              </h3>
                              <p className="text-gray-600 text-base truncate">
                                {attraction.type}
                              </p>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <span className="text-sm text-gray-600">{attraction.rating}</span>
                              <svg className="w-[18px] h-[18px]" viewBox="0 0 15 15" fill="none">
                                <path d="M7.5 0L9.8175 4.69006L15 5.44677L11.25 9.09543L12.135 14.25L7.5 11.8151L2.865 14.25L3.75 9.09543L0 5.44677L5.1825 4.69006L7.5 0Z" fill="#C28E42"/>
                              </svg>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <button 
                              onClick={() => router.push(`/attraction/${attraction.id}`)}
                              className="bg-black text-white px-3.5 py-1 rounded text-[15px] hover:bg-gray-800 transition-colors"
                            >
                              More Info
                            </button>
                            <span className="text-sm text-gray-600 w-9 text-right">
                              {attraction.priceLevel}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Descriptions */}
            {response?.attractions && response.attractions.length > 0 && (
              <div className="space-y-6">
                {response.attractions.map((attraction, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="font-semibold text-lg text-gray-900">{attraction.name}</h3>
                    <p className="text-gray-700 text-base leading-relaxed">
                      {attraction.description} <span className="text-orange-600">→</span>
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Message Input - Fixed to bottom */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] z-10">
        <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  )
}