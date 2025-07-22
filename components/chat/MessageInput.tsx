'use client'

import { useState, useRef, useEffect } from 'react'

interface MessageInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
}

export default function MessageInput({ onSendMessage, isLoading }: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [canUseVoice, setCanUseVoice] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<any>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [message])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      setCanUseVoice(true)
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setMessage(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }


  return (
    <div className="fixed bottom-0 left-0 right-0 bg-neutral-50 border-t border-neutral-200 p-6 backdrop-blur-sm">
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="flex items-end space-x-4">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share your desires with Simon..."
              className="w-full resize-none border border-neutral-300 rounded-2xl px-5 py-4 pr-14 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 max-h-32 bg-white shadow-sm transition-all duration-200"
              rows={1}
              disabled={isLoading}
            />
            {canUseVoice && (
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`absolute right-4 bottom-4 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isListening 
                    ? 'bg-accent-500 text-white animate-pulse shadow-lg' 
                    : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-600 hover:shadow-sm'
                }`}
                disabled={isLoading}
              >
                <span className="text-sm">🎤</span>
              </button>
            )}
          </div>
          
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="luxury-button disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 text-base font-medium"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
        
        {isListening && (
          <div className="text-center mt-3 text-sm text-neutral-600 font-medium">
            Listening attentively... Tap the microphone to finish
          </div>
        )}
      </div>
    </div>
  )
}