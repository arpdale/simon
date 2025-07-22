'use client'

export default function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="chat-bubble chat-bubble-ai">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="text-sm">🤖</span>
          </div>
          <span className="text-sm font-medium text-gray-700">Simon</span>
        </div>
        
        <div className="flex items-center space-x-1 mt-2">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
        </div>
      </div>
    </div>
  )
}