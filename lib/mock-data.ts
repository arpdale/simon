export const hotelAmenities = [
  {
    id: 'spa',
    name: 'Anza Spa',
    description: 'Full-service spa with couples treatments',
    hours: '9:00 AM - 8:00 PM',
    bookable: true,
    category: 'wellness',
    icon: '🧘‍♀️'
  },
  {
    id: 'pool',
    name: 'Rooftop Pool',
    description: 'Adults-only pool with mountain views',
    hours: '6:00 AM - 10:00 PM',
    bookable: false,
    category: 'recreation',
    icon: '🏊‍♀️'
  },
  {
    id: 'gym',
    name: 'Fitness Center',
    description: '24/7 state-of-the-art fitness facility',
    hours: '24 hours',
    bookable: true,
    category: 'fitness',
    icon: '🏋️‍♀️'
  },
  {
    id: 'restaurant',
    name: 'Terrace Restaurant',
    description: 'California cuisine with organic ingredients',
    hours: '6:30 AM - 10:30 PM',
    bookable: true,
    category: 'dining',
    icon: '🍽️'
  },
  {
    id: 'concierge',
    name: 'Concierge Services',
    description: 'Personal assistance for reservations and planning',
    hours: '24 hours',
    bookable: false,
    category: 'service',
    icon: '🔔'
  }
]

export const sampleConversations = [
  "Find me a romantic restaurant for dinner tonight",
  "What's the best wine tasting in Malibu?",
  "I'd like to book a couples massage",
  "Where can we watch the sunset?",
  "What time does the hotel gym open?",
  "Any good hiking trails nearby?",
  "Can you recommend a beach for the afternoon?",
  "I need a table for two at your restaurant"
]

export const locationContext = {
  hotel: {
    name: 'Anza Hotel',
    address: '23627 Calabasas Rd, Calabasas, CA 91302',
    lat: 34.1684,
    lng: -118.6615,
  },
  searchRadius: 20, // miles
  targetAudience: 'couples',
  priceRange: 'mid-to-high-end',
  localAreas: [
    'Calabasas',
    'Malibu', 
    'Topanga',
    'Agoura Hills',
    'Westlake Village'
  ]
}