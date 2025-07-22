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
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-sm">🤵</span>
            </div>
            <span className="text-sm font-medium text-neutral-800 tracking-wide">Simon</span>
          </div>
        )}
        
        <p className="leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        
        <div className={`text-xs mt-3 ${isUser ? 'text-neutral-200' : 'text-neutral-500'} font-medium tracking-wide`}>
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