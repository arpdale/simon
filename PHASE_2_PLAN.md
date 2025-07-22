# Phase 2: AI & Chat Interface

## Goals
- Implement conversational AI using Claude API with streaming responses
- Build dynamic widget injection system based on conversation context
- Add Simon's personality and local expertise
- Create mobile-optimized chat interface with voice input

## Implementation Steps

### 1. Claude API Integration
- Set up API route for chat completions
- Implement streaming response handling
- Add conversation context management
- Configure Simon's personality prompts

### 2. Chat Interface Components
- ChatInterface.tsx - Main conversation UI
- MessageBubble.tsx - Individual chat messages
- MessageInput.tsx - Input with voice support
- TypingIndicator.tsx - Loading states

### 3. Widget Injection Logic
- Intent detection from conversation
- Dynamic widget rendering
- State management between chat and widgets
- Progressive disclosure (inline → expanded → full)

### 4. Voice Input
- Web Speech API integration
- Mobile-optimized voice button
- Speech-to-text conversion
- Error handling for unsupported browsers

## Success Criteria
- Natural conversation with Simon
- Contextual widget injection
- Streaming responses working smoothly
- Voice input functional on mobile
- Mobile-first responsive design