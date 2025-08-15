export interface Attraction {
  id: string
  name: string
  type: string
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

export interface AttractionsQueryResult {
  textResponse: string
  attractions: Attraction[]
  timestamp: number
}

export interface AttractionsConversationMessage {
  type: 'user' | 'ai'
  content: string
  attractions?: Attraction[]
  timestamp: number
}

class AttractionsStore {
  private attractions: Map<string, Attraction> = new Map()
  private queryCache: Map<string, AttractionsQueryResult> = new Map()
  private conversationHistory: AttractionsConversationMessage[] = []
  private readonly CACHE_EXPIRY = 30 * 60 * 1000 // 30 minutes

  constructor() {
    this.loadFromSessionStorage()
  }

  // Query caching
  getCachedQuery(query: string): AttractionsQueryResult | null {
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

  cacheQuery(query: string, textResponse: string, attractions: Attraction[]): void {
    const hash = this.generateQueryHash(query)
    const result: AttractionsQueryResult = {
      textResponse,
      attractions,
      timestamp: Date.now()
    }
    
    this.queryCache.set(hash, result)
    
    // Also store individual attractions
    attractions.forEach(attraction => {
      this.attractions.set(attraction.id, attraction)
    })
    
    this.saveToSessionStorage()
  }

  private generateQueryHash(query: string): string {
    // Simple hash function for query fingerprinting
    const normalized = query.toLowerCase().trim()
    let hash = 0
    for (let i = 0; i < normalized.length; i++) {
      const char = normalized.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return hash.toString()
  }

  // Conversation history
  getConversationHistory(): AttractionsConversationMessage[] {
    return [...this.conversationHistory]
  }

  addConversationMessage(message: AttractionsConversationMessage): void {
    this.conversationHistory.push(message)
    this.saveToSessionStorage()
  }

  clearConversationHistory(): void {
    this.conversationHistory = []
    this.saveToSessionStorage()
  }

  // Individual attraction management
  getAttraction(id: string): Attraction | undefined {
    return this.attractions.get(id)
  }

  getAllAttractions(): Attraction[] {
    return Array.from(this.attractions.values())
  }

  addAttraction(attraction: Attraction): void {
    this.attractions.set(attraction.id, attraction)
    this.saveToSessionStorage()
  }

  // Session storage persistence
  private saveToSessionStorage(): void {
    try {
      const data = {
        attractions: Array.from(this.attractions.entries()),
        queryCache: Array.from(this.queryCache.entries()),
        conversationHistory: this.conversationHistory,
        timestamp: Date.now()
      }
      sessionStorage.setItem('attractionsStore', JSON.stringify(data))
    } catch (error) {
      console.warn('Failed to save attractions store to sessionStorage:', error)
    }
  }

  private loadFromSessionStorage(): void {
    try {
      const stored = sessionStorage.getItem('attractionsStore')
      if (!stored) return

      const data = JSON.parse(stored)
      
      // Load attractions
      if (data.attractions && Array.isArray(data.attractions)) {
        this.attractions = new Map(data.attractions)
      }
      
      // Load query cache with expiry check
      if (data.queryCache && Array.isArray(data.queryCache)) {
        const now = Date.now()
        this.queryCache = new Map(
          data.queryCache.filter(([_, result]: [string, AttractionsQueryResult]) => 
            now - result.timestamp < this.CACHE_EXPIRY
          )
        )
      }
      
      // Load conversation history
      if (data.conversationHistory && Array.isArray(data.conversationHistory)) {
        this.conversationHistory = data.conversationHistory
      }
      
    } catch (error) {
      console.warn('Failed to load attractions store from sessionStorage:', error)
    }
  }

  // Clear all data
  clearAll(): void {
    this.attractions.clear()
    this.queryCache.clear()
    this.conversationHistory = []
    try {
      sessionStorage.removeItem('attractionsStore')
    } catch (error) {
      console.warn('Failed to clear attractions store from sessionStorage:', error)
    }
  }
}

// Export singleton instance
export const attractionsStore = new AttractionsStore()