'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, X, Send } from 'lucide-react'
import VoiceRecordingOverlay from './VoiceRecordingOverlay'

interface MessageInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
}

export default function MessageInput({ onSendMessage, isLoading }: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [canUseVoice, setCanUseVoice] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)

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

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    console.log('handleSubmit called with message:', message)
    if (message.trim() && !isLoading) {
      console.log('Sending message:', message.trim())
      onSendMessage(message.trim())
      setMessage('')
    } else {
      console.log('Message not sent - empty message or loading:', { message: message.trim(), isLoading })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && message.trim()) {
      e.preventDefault()
      handleSubmit()
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
      setMessage('')
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const clearMessage = () => {
    setMessage('')
    inputRef.current?.focus()
  }

  return (
    <>
      <div className="bg-white border-t border-gray-200">
        <div className="p-4">
          <div className="flex items-center bg-gray-100 rounded-full border border-gray-300 p-1">
            {/* Left Simon logo (non-clickable) */}
            <div>
              <img 
                src="/logos/chat-icon-simon.svg" 
                alt="Simon" 
                className="w-10 h-10"
              />
            </div>

            {/* Text input - clickable area for text entry */}
            <form onSubmit={handleSubmit} className="flex-1">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Simon anything"
                className="w-full bg-transparent px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none text-base"
                disabled={isLoading || isListening}
              />
            </form>

            {/* Right microphone button - always visible for voice recording */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              disabled={isLoading}
              className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors border border-gray-300"
            >
              <Mic className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Voice recording overlay */}
      {isListening && <VoiceRecordingOverlay onStop={stopRecording} />}
    </>
  )
}