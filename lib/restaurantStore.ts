interface Restaurant {
  id: string
  name: string
  cuisine: string
  rating: number
  priceLevel: string
  description: string
  detailedDescription?: string
  setting?: string
  mustTry?: string
  experience?: string
  imageUrl: string
  address?: string
  phone?: string
  website?: string
}

interface QueryResult {
  textResponse: string
  restaurants: Restaurant[]
  timestamp: number
  queryHash: string
}

interface ConversationMessage {
  type: 'user' | 'ai'
  content: string
  restaurants?: Restaurant[]
  timestamp: number
}

class RestaurantStore {
  private restaurants: Map<string, Restaurant> = new Map()
  private queryCache: Map<string, QueryResult> = new Map()
  private conversationHistory: ConversationMessage[] = []
  private readonly CACHE_EXPIRY = 30 * 60 * 1000 // 30 minutes

  constructor() {
    this.loadFromSessionStorage()
  }

  // Session Storage Methods
  private loadFromSessionStorage() {
    if (typeof window === 'undefined') return

    try {
      // Load restaurants
      const restaurantsData = sessionStorage.getItem('simon_restaurant_cache')
      if (restaurantsData) {
        const restaurantArray = JSON.parse(restaurantsData)
        restaurantArray.forEach((restaurant: Restaurant) => {
          this.restaurants.set(restaurant.id, restaurant)
        })
      }

      // Load query cache
      const queryCacheData = sessionStorage.getItem('simon_query_results')
      if (queryCacheData) {
        const queryArray = JSON.parse(queryCacheData)
        queryArray.forEach((query: QueryResult) => {
          // Only load non-expired queries
          if (Date.now() - query.timestamp < this.CACHE_EXPIRY) {
            this.queryCache.set(query.queryHash, query)
          }
        })
      }

      // Load conversation history
      const conversationData = sessionStorage.getItem('simon_conversation_history')
      if (conversationData) {
        this.conversationHistory = JSON.parse(conversationData)
      }
    } catch (error) {
      console.warn('Failed to load from session storage:', error)
    }
  }

  private saveToSessionStorage() {
    if (typeof window === 'undefined') return

    try {
      // Save restaurants
      const restaurantArray = Array.from(this.restaurants.values())
      sessionStorage.setItem('simon_restaurant_cache', JSON.stringify(restaurantArray))

      // Save non-expired query cache
      const validQueries = Array.from(this.queryCache.values()).filter(
        query => Date.now() - query.timestamp < this.CACHE_EXPIRY
      )
      sessionStorage.setItem('simon_query_results', JSON.stringify(validQueries))

      // Save conversation history
      sessionStorage.setItem('simon_conversation_history', JSON.stringify(this.conversationHistory))
    } catch (error) {
      console.warn('Failed to save to session storage:', error)
    }
  }

  // Query Hash Generation
  private generateQueryHash(query: string): string {
    // Simple hash function for query fingerprinting
    return btoa(query.toLowerCase().replace(/\s+/g, ' ').trim())
  }

  // Restaurant Methods
  addRestaurants(restaurants: Restaurant[]) {
    restaurants.forEach(restaurant => {
      this.restaurants.set(restaurant.id, restaurant)
    })
    this.saveToSessionStorage()
  }

  getRestaurant(id: string): Restaurant | null {
    return this.restaurants.get(id) || null
  }

  getAllRestaurants(): Restaurant[] {
    return Array.from(this.restaurants.values())
  }

  // Query Cache Methods
  getCachedQuery(query: string): QueryResult | null {
    const hash = this.generateQueryHash(query)
    const cached = this.queryCache.get(hash)
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_EXPIRY) {
      return cached
    }
    
    // Remove expired cache
    if (cached) {
      this.queryCache.delete(hash)
      this.saveToSessionStorage()
    }
    
    return null
  }

  cacheQuery(query: string, textResponse: string, restaurants: Restaurant[]): void {
    const hash = this.generateQueryHash(query)
    const queryResult: QueryResult = {
      textResponse,
      restaurants,
      timestamp: Date.now(),
      queryHash: hash
    }
    
    this.queryCache.set(hash, queryResult)
    this.addRestaurants(restaurants) // Also cache individual restaurants
    this.saveToSessionStorage()
  }

  // Conversation Methods
  addConversationMessage(message: ConversationMessage): void {
    this.conversationHistory.push({
      ...message,
      timestamp: Date.now()
    })
    this.saveToSessionStorage()
  }

  getConversationHistory(): ConversationMessage[] {
    return this.conversationHistory
  }

  clearConversation(): void {
    this.conversationHistory = []
    this.saveToSessionStorage()
  }

  // Cache Management
  clear() {
    this.restaurants.clear()
    this.queryCache.clear()
    this.conversationHistory = []
    
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('simon_restaurant_cache')
      sessionStorage.removeItem('simon_query_results')
      sessionStorage.removeItem('simon_conversation_history')
    }
  }

  // Get cache statistics
  getCacheStats() {
    return {
      restaurantCount: this.restaurants.size,
      queryCount: this.queryCache.size,
      conversationLength: this.conversationHistory.length,
      cacheSize: typeof window !== 'undefined' ? 
        JSON.stringify(Array.from(this.restaurants.values())).length + 
        JSON.stringify(Array.from(this.queryCache.values())).length : 0
    }
  }
}

// Global singleton instance
export const restaurantStore = new RestaurantStore()
export type { Restaurant, QueryResult, ConversationMessage }