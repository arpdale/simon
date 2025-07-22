'use client'

import { useState, useEffect, useRef } from 'react'
import { Message } from '@/lib/types'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'
import TypingIndicator from './TypingIndicator'
import WidgetContainer from '../widgets/WidgetContainer'
import { detectAndParseWidgets } from '@/lib/widget-utils'

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentResponse, setCurrentResponse] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, currentResponse, isLoading])

  // Initialize with Simon's welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: "Hey there! 👋 I'm Simon, your personal concierge for the Anza Hotel. I know all the best spots around Calabasas and Malibu. What can I help you discover today?",
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
  }, [])

  const handleSendMessage = async (content: string) => {
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
    <div className="flex flex-col h-screen luxury-gradient">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-neutral-200 p-6 flex-shrink-0 shadow-sm">
        <div className="flex items-center space-x-4 max-w-md mx-auto">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-md">
            <span className="text-xl">🤵</span>
          </div>
          <div>
            <h1 className="font-display text-xl font-medium text-neutral-900 tracking-wide">Simon</h1>
            <p className="text-sm text-neutral-600 font-medium">Your dedicated concierge</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 pb-32">
        <div className="max-w-md mx-auto space-y-6">
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
                      <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-sm">🤵</span>
                      </div>
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

      {/* Input */}
      <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  )
}