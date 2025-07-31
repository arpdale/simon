'use client'

import { useRouter } from 'next/navigation'
import { Home, Building2, MapPin, Utensils, DollarSign } from 'lucide-react'

interface QuickSuggestion {
  icon: React.ReactNode
  label: string
  action: string | (() => void)
}

interface QuickSuggestionsProps {
  onSuggestionClick?: (message: string) => void
}

export default function QuickSuggestions({ onSuggestionClick }: QuickSuggestionsProps) {
  const router = useRouter()

  const suggestions: QuickSuggestion[] = [
    {
      icon: <Home className="w-5 h-5" />,
      label: "What in-room dining options are available?",
      action: () => router.push('/chat/category/in-room-dining')
    },
    {
      icon: <Building2 className="w-5 h-5" />,
      label: "What hotel amenities do you offer?",
      action: "What hotel amenities are available at the Renaissance Los Angeles Airport Hotel?"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: "Can you recommend nearby attractions?",
      action: () => router.push('/chat/category/nearby-attractions')
    },
    {
      icon: <Utensils className="w-5 h-5" />,
      label: "Recommended local dining",
      action: "Can you recommend the best local restaurants near the hotel?"
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: "I'd like to tip the staff",
      action: "How can I tip the hotel staff?"
    }
  ]

  const handleClick = (suggestion: QuickSuggestion) => {
    if (typeof suggestion.action === 'function') {
      suggestion.action()
    } else if (onSuggestionClick) {
      onSuggestionClick(suggestion.action)
    }
  }

  return (
    <div className="space-y-4 mt-8">
      <p className="text-gray-900 font-medium">How can I help you?</p>
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="text-gray-600">
              {suggestion.icon}
            </span>
            <button
              onClick={() => handleClick(suggestion)}
              className="flex-1 text-left px-6 py-3 rounded-full border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all text-sm text-gray-700"
            >
              {suggestion.label}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}