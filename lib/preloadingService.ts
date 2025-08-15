import { restaurantStore } from './restaurantStore'

interface PreloadOptions {
  force?: boolean // Force reload even if cached
}

class PreloadingService {
  private isPreloading = false
  private preloadPromises: Map<string, Promise<any>> = new Map()

  // Preload both local dining and attractions
  async preloadAll(options: PreloadOptions = {}) {
    if (this.isPreloading && !options.force) {
      return Promise.all(Array.from(this.preloadPromises.values()))
    }

    this.isPreloading = true

    try {
      const promises = [
        this.preloadLocalDining(options),
        this.preloadAttractions(options)
      ]

      await Promise.all(promises)
    } finally {
      this.isPreloading = false
      this.preloadPromises.clear()
    }
  }

  // Preload local dining data
  async preloadLocalDining(options: PreloadOptions = {}) {
    const cacheKey = 'local-dining-preload'
    const query = "I'd like restaurant recommendations for tonight"

    // Check cache first
    if (!options.force) {
      const cached = restaurantStore.getCachedQuery(query)
      if (cached) {
        return cached
      }
    }

    // Check if already preloading
    if (this.preloadPromises.has(cacheKey)) {
      return this.preloadPromises.get(cacheKey)
    }

    const promise = this.fetchLocalDining(query)
    this.preloadPromises.set(cacheKey, promise)

    return promise
  }

  // Preload attractions data
  async preloadAttractions(options: PreloadOptions = {}) {
    const cacheKey = 'attractions-preload'
    const query = "I'd like to know about nearby attractions and things to do"

    // Check cache first
    if (!options.force) {
      const cached = restaurantStore.getCachedQuery(query)
      if (cached) {
        return cached
      }
    }

    // Check if already preloading
    if (this.preloadPromises.has(cacheKey)) {
      return this.preloadPromises.get(cacheKey)
    }

    const promise = this.fetchAttractions(query)
    this.preloadPromises.set(cacheKey, promise)

    return promise
  }

  // Fetch local dining data
  private async fetchLocalDining(query: string) {
    try {
      const response = await fetch('/api/chat/local-dining', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        throw new Error('Failed to preload local dining')
      }

      const result = await this.parseStreamingResponse(response)
      
      if (result) {
        // Cache the result
        restaurantStore.cacheQuery(query, result.textResponse, result.restaurants)
      }

      return result
    } catch (error) {
      console.warn('Failed to preload local dining:', error)
      return null
    }
  }

  // Fetch attractions data
  private async fetchAttractions(query: string) {
    try {
      const response = await fetch('/api/chat/nearby-attractions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        throw new Error('Failed to preload attractions')
      }

      const result = await this.parseStreamingResponse(response)
      
      if (result) {
        // Cache the result (reuse restaurant store for attractions too)
        restaurantStore.cacheQuery(query, result.textResponse, result.restaurants || result.attractions)
      }

      return result
    } catch (error) {
      console.warn('Failed to preload attractions:', error)
      return null
    }
  }

  // Parse streaming API response
  private async parseStreamingResponse(response: Response) {
    const reader = response.body?.getReader()
    if (!reader) return null

    let fullResponse = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              try {
                return JSON.parse(fullResponse)
              } catch (e) {
                console.warn('Failed to parse preload response:', e)
                return null
              }
            } else {
              try {
                const parsed = JSON.parse(data)
                if (parsed.content) {
                  fullResponse += parsed.content
                }
              } catch (e) {
                // Ignore parsing errors for malformed chunks
              }
            }
          }
        }
      }
    } catch (error) {
      console.warn('Error reading stream:', error)
      return null
    }

    return null
  }

  // Get preloading status
  getStatus() {
    return {
      isPreloading: this.isPreloading,
      activePreloads: Array.from(this.preloadPromises.keys()),
      cacheStats: restaurantStore.getCacheStats()
    }
  }

  // Clear all preload promises
  reset() {
    this.preloadPromises.clear()
    this.isPreloading = false
  }
}

// Global singleton instance
export const preloadingService = new PreloadingService()