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

class RestaurantStore {
  private restaurants: Map<string, Restaurant> = new Map()

  addRestaurants(restaurants: Restaurant[]) {
    restaurants.forEach(restaurant => {
      this.restaurants.set(restaurant.id, restaurant)
    })
  }

  getRestaurant(id: string): Restaurant | null {
    return this.restaurants.get(id) || null
  }

  getAllRestaurants(): Restaurant[] {
    return Array.from(this.restaurants.values())
  }

  clear() {
    this.restaurants.clear()
  }
}

// Global singleton instance
export const restaurantStore = new RestaurantStore()
export type { Restaurant }