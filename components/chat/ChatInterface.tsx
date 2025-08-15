'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Message } from '@/lib/types'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'
import TypingIndicator from './TypingIndicator'
import QuickSuggestions from './QuickSuggestions'
import WelcomeMessage from './WelcomeMessage'
import WidgetContainer from '../widgets/WidgetContainer'
import { detectAndParseWidgets } from '@/lib/widget-utils'
import PromoCarousel from '../cards/PromoCarousel'

export default function ChatInterface() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentResponse, setCurrentResponse] = useState('')
  const [showWindowShade, setShowWindowShade] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, currentResponse, isLoading])

  // Initialize without welcome message to show quick suggestions
  // useEffect(() => {
  //   const welcomeMessage: Message = {
  //     id: 'welcome',
  //     role: 'assistant',
  //     content: "Hey there! 👋 I'm Simon, your personal concierge for the Renaissance Los Angeles Airport Hotel. I know all the best spots around Los Angeles and Santa Monica. What can I help you discover today?",
  //     timestamp: new Date(),
  //   }
  //   setMessages([welcomeMessage])
  // }, [])

  const handleSendMessage = async (content: string) => {
    // Check for specific navigation intents
    const lowerContent = content.toLowerCase()
    if (lowerContent.includes('in-room dining') || lowerContent.includes('room service') || lowerContent.includes('dining options')) {
      router.push('/chat/category/in-room-dining')
      return
    }
    if (lowerContent.includes('nearby attractions') || lowerContent.includes('what to do') || lowerContent.includes('attractions')) {
      router.push('/chat/nearby-attractions')
      return
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setCurrentResponse('')

    try {
      // Prepare conversation history
      const conversationHistory = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: conversationHistory }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      let assistantContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              // Parse widgets from final content
              const { cleanContent, widgets } = detectAndParseWidgets(assistantContent)
              
              // Finalize the assistant message
              const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: cleanContent,
                timestamp: new Date(),
                widgets: widgets.length > 0 ? widgets : undefined,
              }
              setMessages(prev => [...prev, assistantMessage])
              setCurrentResponse('')
              setIsLoading(false)
              return
            }

            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                assistantContent += parsed.content
                setCurrentResponse(assistantContent)
              }
            } catch (e) {
              // Ignore parsing errors for malformed chunks
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Please try again!",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
      setIsLoading(false)
      setCurrentResponse('')
    }
  }

  return (
    <div className="relative flex flex-col h-screen max-h-[844px] mx-auto max-w-[390px] w-full overflow-hidden">
      {/* Hotel Background (always present, behind everything) */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/ren-lax-mobile.png')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#66666699] to-[#000000]" />
        
        {/* Hotel Amenities Content (visible when shade is down) */}
        <div className={`absolute inset-0 flex flex-col justify-center items-center text-white p-8 transition-opacity duration-500 ${
          showWindowShade ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="text-center space-y-8 max-w-sm">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-wide">Renaissance</h1>
              <h2 className="text-xl font-light">Los Angeles Airport</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Hotel Amenities</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <p>• 24/7 Fitness Center</p>
                    <p>• Business Center</p>
                    <p>• Free WiFi</p>
                    <p>• Concierge Service</p>
                  </div>
                  <div className="space-y-2">
                    <p>• Airport Shuttle</p>
                    <p>• Valet Parking</p>
                    <p>• Room Service</p>
                    <p>• Meeting Rooms</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Dining & Entertainment</h3>
                <div className="text-sm space-y-1">
                  <p>• RestauRANT Bar + Grill</p>
                  <p>• In-Room Dining</p>
                  <p>• Lobby Lounge</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* White container that slides down */}
      <div className={`absolute inset-0 flex flex-col transition-transform duration-500 ease-in-out ${
        showWindowShade ? 'translate-y-[calc(100%-90px)]' : 'translate-y-0'
      }`}>
        {/* Clickable background area at top */}
        <div 
          className="h-8 md:h-12 cursor-pointer"
          onClick={() => setShowWindowShade(true)}
        />
        
        {/* Content container with rounded corners */}
        <div className="flex-1 bg-white rounded-t-3xl flex flex-col min-h-0">
          {/* Handle bar and logo - only show when retracted */}
          {showWindowShade && (
            <div 
              className="flex flex-col items-center gap-2.5 px-6 py-3 cursor-pointer"
              onClick={() => setShowWindowShade(false)}
            >
              <div className="w-[115px] h-1 bg-black rounded-sm" />
              <div className="flex items-center gap-[5px]">
                <img 
                  src="/logos/bowtie-logo-black-bg.svg" 
                  alt="Simon" 
                  className="w-6 h-6"
                />
              </div>
            </div>
          )}
          
          {/* Main content area */}
          <div className={`flex-1 ${showWindowShade ? 'hidden' : 'block'}`}>
          {messages.length === 0 ? (
            <div className="flex-1 p-6">
            <div className="w-full max-w-md mx-auto space-y-12">
              {/* Top Group: Name, Logo, Welcome Text */}
              <div className="pt-2">
                <WelcomeMessage />
              </div>
              
              {/* Middle Group: How can I help + Quick Suggestions */}
              <div>
                <QuickSuggestions 
                  onSuggestionClick={handleSendMessage} 
                  onHotelAmenitiesClick={() => setShowWindowShade(true)}
                />
              </div>
              
              {/* Bottom Group: Promo Carousel */}
              <div className="pb-2">
                <PromoCarousel />
              </div>
            </div>
          </div>
          ) : (
            <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              
              {isLoading && (
                <>
                  <TypingIndicator />
                  {currentResponse && (
                    <div className="flex justify-start mb-6">
                      <div className="chat-bubble chat-bubble-ai">
                        <div className="flex items-center space-x-3 mb-3">
                          <img 
                            src="/logos/bowtie-logo-black-bg.svg" 
                            alt="Simon" 
                            className="w-7 h-7"
                          />
                          <span className="text-sm font-medium text-neutral-800 tracking-wide">Simon</span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap">
                          {currentResponse}
                          <span className="inline-block w-0.5 h-5 bg-primary-500 ml-1 animate-pulse" />
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            </div>
          )}
          </div>
        
          {/* Input */}
          <div className={showWindowShade ? 'hidden' : 'block'}>
            <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          </div>
      </div>
      
    </div>
    </div>
  )
}