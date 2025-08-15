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
      label: "What options are available for dining in?",
      action: () => router.push('/chat/category/in-room-dining')
    },
    {
      icon: <Utensils className="w-5 h-5" />,
      label: "Recommended local dining",
      action: () => router.push('/chat/local-dining')
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: "Can you recommend nearby attractions?",
      action: () => router.push('/chat/nearby-attractions')
    },
    {
      icon: <Building2 className="w-5 h-5" />,
      label: "What hotel amenities do you offer?",
      action: "What hotel amenities are available at the Renaissance Los Angeles Airport Hotel?"
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
    <div className="space-y-3">
      <h2 className="text-lg font-medium text-gray-900 text-center">How can I help you?</h2>
        {suggestions.map((suggestion, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="text-gray-600">
              {suggestion.icon}
            </span>
            <button
              onClick={() => handleClick(suggestion)}
              className="flex-1 text-left px-4 py-2 rounded-full border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all text-xs text-gray-700"
            >
              {suggestion.label}
            </button>
          </div>
        ))}
    </div>
  )
}