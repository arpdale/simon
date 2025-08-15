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
      <div className={`chat-bubble ${isUser ? 'chat-bubble-user' : 'chat-bubble-ai'} ${!isUser && message.widgets ? 'max-w-2xl' : ''}`}>
        {!isUser && (
          <div className="flex items-center space-x-3 mb-3">
            <img 
              src="/logos/bowtie-bowtie-logo-black-bg.svg" 
              alt="Simon" 
              className="w-7 h-7"
            />
            <span className="text-sm font-medium text-neutral-800 tracking-wide">Simon</span>
          </div>
        )}
        
        <p className="leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        
        {/* Render widgets inside the message bubble */}
        {!isUser && message.widgets && (
          <div className="mt-4 -mx-4 px-8">
            <WidgetContainer widgets={message.widgets} />
          </div>
        )}
        
        <div className={`text-xs mt-3 ${isUser ? 'text-neutral-200' : 'text-neutral-500'} font-medium tracking-wide`}>
          {format(message.timestamp, 'h:mm a')}
        </div>
      </div>
    </div>
  )
}