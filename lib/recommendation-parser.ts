// Parse actual recommendations from Claude's response text
export function parseClaudeRecommendations(content: string) {
  const restaurants: any[] = []
  const attractions: any[] = []
  
  // Parse numbered restaurant recommendations (e.g., "1. Restaurant Name - Description")
  const restaurantRegex = /\d+\.\s*([^-]+?)\s*-\s*([^0-9\n]+?)(?=\n\d+\.|\n\n|$)/g
  let match
  
  while ((match = restaurantRegex.exec(content)) !== null) {
    const name = match[1].trim()
    const description = match[2].trim()
    
    // Skip if it doesn't look like a restaurant name
    if (name.length > 50 || name.includes('would') || name.includes('can')) continue
    
    restaurants.push({
      name,
      description,
      cuisine: extractCuisineType(description),
      rating: generateRating(),
      priceRange: extractPriceRange(description),
      distance: generateDistance(),
      photos: [getRestaurantPhoto(name)]
    })
  }
  
  return { restaurants, attractions }
}

function extractCuisineType(description: string): string {
  const cuisineMap = {
    'japanese': 'Japanese',
    'sushi': 'Japanese', 
    'italian': 'Italian',
    'mexican': 'Mexican',
    'american': 'American',
    'steak': 'Steakhouse',
    'seafood': 'Seafood',
    'game': 'American',
    'comfort': 'American'
  }
  
  for (const [key, value] of Object.entries(cuisineMap)) {
    if (description.toLowerCase().includes(key)) {
      return value
    }
  }
  
  return 'American'
}

function extractPriceRange(description: string): string {
  if (description.toLowerCase().includes('premium') || 
      description.toLowerCase().includes('world-famous') ||
      description.toLowerCase().includes('upscale')) {
    return '$$$'
  }
  if (description.toLowerCase().includes('casual') || 
      description.toLowerCase().includes('comfort')) {
    return '$$'
  }
  return '$$'
}

function generateRating(): number {
  return Math.round((Math.random() * 1 + 4) * 10) / 10 // 4.0-5.0 range
}

function generateDistance(): string {
  const distances = ['5 miles', '8 miles', '12 miles', '15 miles', '18 miles']
  return distances[Math.floor(Math.random() * distances.length)]
}

function getRestaurantPhoto(name: string): string {
  // Use restaurant name to determine appropriate stock photo
  const nameKey = name.toLowerCase()
  
  if (nameKey.includes('nobu')) {
    return 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300'
  }
  if (nameKey.includes('saddle') || nameKey.includes('lodge')) {
    return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300'  
  }
  if (nameKey.includes('sugarfish') || nameKey.includes('sushi')) {
    return 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300'
  }
  if (nameKey.includes('mastro') || nameKey.includes('steak')) {
    return 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300'
  }
  if (nameKey.includes('king') || nameKey.includes('fish')) {
    return 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300'
  }
  
  // Default restaurant photo
  return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300'
}