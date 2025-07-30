import { WidgetData } from './types'
import { hotelAmenities } from './mock-data'
import { parseClaudeRecommendations } from './recommendation-parser'

export function detectAndParseWidgets(content: string): {
  cleanContent: string
  widgets: WidgetData[]
} {
  const widgets: WidgetData[] = []
  let cleanContent = content

  // Restaurant widget detection
  if (content.includes('[RESTAURANT_WIDGET]')) {
    cleanContent = cleanContent.replace('[RESTAURANT_WIDGET]', '')
    widgets.push({
      type: 'restaurant',
      data: generateRestaurantData(content)
    })
  }

  // Attraction widget detection
  if (content.includes('[ATTRACTION_WIDGET]')) {
    cleanContent = cleanContent.replace('[ATTRACTION_WIDGET]', '')
    widgets.push({
      type: 'attraction', 
      data: generateAttractionData(content)
    })
  }

  // Hotel widget detection
  if (content.includes('[HOTEL_WIDGET]')) {
    cleanContent = cleanContent.replace('[HOTEL_WIDGET]', '')
    widgets.push({
      type: 'hotel',
      data: generateHotelData(content)
    })
  }

  return {
    cleanContent: cleanContent.trim(),
    widgets
  }
}

function generateRestaurantData(content: string) {
  // First try to parse actual recommendations from Claude's response
  const { restaurants: parsedRestaurants } = parseClaudeRecommendations(content)
  
  if (parsedRestaurants.length > 0) {
    return { restaurants: parsedRestaurants }
  }
  
  // Fallback to mock data if no specific recommendations found
  const isRomantic = content.toLowerCase().includes('romantic') || content.toLowerCase().includes('couples')
  const isUpscale = content.toLowerCase().includes('upscale') || content.toLowerCase().includes('fine')
  const isItalian = content.toLowerCase().includes('italian')
  const isMexican = content.toLowerCase().includes('mexican') || content.toLowerCase().includes('tacos')

  const restaurants = [
    {
      name: 'Nobu Santa Monica',
      cuisine: 'Japanese',
      rating: 4.6,
      priceRange: '$$$',
      distance: '8 miles',
      description: 'Upscale Japanese with ocean views',
      photos: ['https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300'],
      highlight: isRomantic || isUpscale
    },
    {
      name: 'Gracias Madre',
      cuisine: 'Mexican',
      rating: 4.4, 
      priceRange: '$$',
      distance: '12 miles',
      description: 'Plant-based Mexican in West Hollywood',
      photos: ['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300'],
      highlight: isMexican
    },
    {
      name: 'The Ivy',
      cuisine: 'American',
      rating: 4.3,
      priceRange: '$$$',
      distance: '15 miles', 
      description: 'Classic California cuisine',
      photos: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300'],
      highlight: isUpscale
    }
  ]

  return {
    restaurants: restaurants.sort((a, b) => (b.highlight ? 1 : 0) - (a.highlight ? 1 : 0))
  }
}

function generateAttractionData(content: string) {
  const isBeach = content.toLowerCase().includes('beach') || content.toLowerCase().includes('ocean')
  const isArt = content.toLowerCase().includes('art') || content.toLowerCase().includes('museum')
  const isWine = content.toLowerCase().includes('wine') || content.toLowerCase().includes('vineyard')

  const attractions = [
    {
      name: 'El Matador Beach',
      category: 'Beach',
      rating: 4.7,
      distance: '12 miles',
      hours: 'Sunrise to sunset',
      description: 'Dramatic rock formations and sunset views',
      photos: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300'],
      highlight: isBeach
    },
    {
      name: 'Getty Villa',
      category: 'Museum',
      rating: 4.6,
      distance: '10 miles',
      hours: '10am-5pm (Thu-Mon)',
      description: 'Ancient art in stunning architecture',
      photos: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300'],
      highlight: isArt
    },
    {
      name: 'Santa Monica Wine Safaris',
      category: 'Winery',
      rating: 4.5,
      distance: '15 miles',
      hours: '11am-6pm',
      description: 'Wine tasting with exotic animals',
      photos: ['https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300'],
      highlight: isWine
    }
  ]

  return {
    attractions: attractions.sort((a, b) => (b.highlight ? 1 : 0) - (a.highlight ? 1 : 0))
  }
}

function generateHotelData(content: string) {
  const isSpa = content.toLowerCase().includes('spa') || content.toLowerCase().includes('massage')
  const isGym = content.toLowerCase().includes('gym') || content.toLowerCase().includes('fitness')
  const isPool = content.toLowerCase().includes('pool')
  const isDining = content.toLowerCase().includes('restaurant') || content.toLowerCase().includes('dining')

  let relevantAmenities = hotelAmenities

  // Filter and prioritize based on context
  if (isSpa) {
    relevantAmenities = hotelAmenities.filter(a => a.id === 'spa' || a.category === 'wellness')
  } else if (isGym) {
    relevantAmenities = hotelAmenities.filter(a => a.id === 'gym' || a.category === 'fitness')  
  } else if (isPool) {
    relevantAmenities = hotelAmenities.filter(a => a.id === 'pool' || a.category === 'recreation')
  } else if (isDining) {
    relevantAmenities = hotelAmenities.filter(a => a.id === 'restaurant' || a.category === 'dining')
  }

  return {
    amenities: relevantAmenities.slice(0, 3) // Show top 3 relevant amenities
  }
}