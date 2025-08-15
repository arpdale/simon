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
      <div className="bg-white">
        <div className="p-4">
          <div className="flex items-center bg-white rounded-full border border-gray-300 px-4 py-3">
            {/* Left Simon logo */}
            <div className="flex-shrink-0 mr-3">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <img 
                  src="/logos/bowtie-logo-white-bg.svg" 
                  alt="Simon" 
                  className="w-8 h-8"
                />
              </div>
            </div>

            {/* Text input */}
            <form onSubmit={handleSubmit} className="flex-1">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Simon anything"
                className="w-full bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-base"
                disabled={isLoading || isListening}
              />
            </form>

            {/* Right microphone button */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              disabled={isLoading}
              className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors ml-3"
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