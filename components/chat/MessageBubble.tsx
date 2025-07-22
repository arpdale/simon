'use client'

import { Message } from '@/lib/types'
import { format } from 'date-fns'
import WidgetContainer from '../widgets/WidgetContainer'

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`chat-bubble ${isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
        {!isUser && (
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-sm">🤖</span>
            </div>
            <span className="text-sm font-medium text-gray-700">Simon</span>
          </div>
        )}
        
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        
        <div className={`text-xs mt-2 opacity-70 ${isUser ? 'text-white' : 'text-gray-500'}`}>
          {format(message.timestamp, 'h:mm a')}
        </div>
      </div>
      
      {/* Render widgets for assistant messages */}
      {!isUser && message.widgets && (
        <div className="mt-3">
          <WidgetContainer widgets={message.widgets} />
        </div>
      )}
    </div>
  )
}