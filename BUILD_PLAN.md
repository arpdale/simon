# Build Plan for Simon - AI Hotel Concierge POC

## Project Overview

Build a mobile-first web app called "Simon" - an AI hotel concierge for the Renaissance Los Angeles Airport Hotel in Los Angeles, CA. Target audience: high-end couples seeking curated local experiences.

## Phase 1: Foundation (Days 1-3)

### 1. Project Setup
- Next.js 14 with TypeScript, Tailwind CSS, and App Router
- Mobile-first responsive design (375px - 768px primary breakpoints)
- Environment setup for API keys (Claude, Google Places, Google Maps)
- Git repository initialization

### 2. Core Architecture
```
/app
  /page.tsx              # QR landing page
  /chat/page.tsx         # Main chat interface
  /api
    /chat/route.ts       # Claude API integration
    /places/route.ts     # Google Places API
    /mock-booking/route.ts # Fake booking endpoints
/components
  /chat
    /ChatInterface.tsx   # Main conversation UI
    /MessageBubble.tsx   # Chat messages
  /widgets
    /RestaurantWidget.tsx
    /AttractionWidget.tsx
    /HotelWidget.tsx
  /ui                    # Shared components
/lib
  /ai-prompts.ts        # Simon's personality
  /mock-data.ts         # Hotel amenities, fake bookings
```

### 3. Design System
- Color palette: Warm neutrals with accent colors
- Typography: Clean sans-serif (Inter/Work Sans)
- Mobile-optimized touch targets (44px minimum)
- Smooth animations with Framer Motion

## Phase 2: AI & Chat Interface (Days 4-6)

### 1. Simon's Personality
- Friendly local guide who knows Los Angeles/Santa Monica area
- Conversational style: "Hey! I know just the spot..."
- Context awareness for couples' experiences
- Natural widget triggering based on intent

### 2. Chat Implementation
- Streaming responses from Claude API
- Message history with context retention
- Voice input option (Web Speech API)
- Typing indicators and loading states

### 3. Widget Injection Logic
- Intent detection for restaurant/attraction/hotel queries
- Smooth slide-in animations for widgets
- Progressive disclosure (inline → expanded → full)
- State management with Zustand or Context API

## Phase 3: Widget System (Days 7-10)

### 1. Restaurant Widget
- Google Places integration (20-mile radius from Renaissance Los Angeles Airport Hotel)
- Filters: cuisine type, price range, ambiance
- Mock OpenTable booking flow
- Photo carousel, ratings, reviews
- "Perfect for couples" indicators

### 2. Attraction Widget
- Local wineries, beaches, hiking trails
- Santa Monica attractions, Getty Villa, beaches
- Real-time hours and availability
- Mock ticket booking
- Distance/drive time from hotel

### 3. Hotel Amenity Widget
- Renaissance Los Angeles Airport Hotel specifics: spa, pool, restaurant
- Mock availability calendar
- Fake booking confirmations
- Room service menu integration

## Phase 4: Integrations & Polish (Days 11-13)

### 1. Real Integrations
- Google Places API for live restaurant/attraction data
- Google Maps for directions and visualization
- Geolocation for "near me" features

### 2. Mock Integrations
- Fake Stripe payment flow (pre-built UI)
- Simulated booking confirmations
- Mock delivery tracking with toast notifications
- Fake email confirmations

### 3. Polish & Animation
- Loading skeletons for API calls
- Error states and offline handling
- Page transitions and micro-interactions
- PWA setup for app-like experience

## Phase 5: Demo Preparation (Days 14-15)

### 1. Demo Data
- Curated list of best restaurants for couples
- Romantic spots in Santa Monica/Los Angeles
- Pre-scripted conversation flows
- Edge case handling

### 2. Performance Optimization
- Image optimization
- API response caching
- Bundle size optimization
- Lighthouse score improvements

### 3. Deployment
- Vercel deployment
- Environment variables setup
- QR code generation for demo
- Mobile testing on real devices

## Technical Stack Summary

### Frontend
- Next.js 14 + TypeScript
- Tailwind CSS + Custom Design System
- Framer Motion for animations
- React Hook Form + Zod for forms

### APIs & Services
- Anthropic Claude API (conversational AI)
- Google Places API (restaurant/attraction data)
- Google Maps JavaScript API (mapping)
- Mock services for bookings/payments

### Key Libraries
```json
{
  "@anthropic-ai/sdk": "latest",
  "@googlemaps/js-api-loader": "latest",
  "framer-motion": "latest",
  "react-hook-form": "latest",
  "zod": "latest",
  "date-fns": "latest",
  "zustand": "latest"
}
```

## Success Metrics for POC

- Sub-2 second initial load time
- Natural conversation flow with contextual widgets
- Seamless mobile experience
- Believable mock integrations
- Clear value proposition demonstration

## Ready to start building Simon for the Renaissance Los Angeles Airport Hotel!