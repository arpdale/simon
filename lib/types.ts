export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  widgets?: WidgetData[]
}

export interface WidgetData {
  type: 'restaurant' | 'attraction' | 'hotel'
  data: any
}

export interface ChatState {
  messages: Message[]
  isLoading: boolean
  currentResponse: string
}

export interface RestaurantWidget {
  type: 'restaurant'
  data: {
    name: string
    cuisine: string
    rating: number
    priceRange: string
    distance: string
    photos?: string[]
    description?: string
  }
}

export interface AttractionWidget {
  type: 'attraction' 
  data: {
    name: string
    category: string
    rating: number
    distance: string
    hours?: string
    photos?: string[]
    description?: string
  }
}

export interface HotelWidget {
  type: 'hotel'
  data: {
    name: string
    category: string
    hours: string
    bookable: boolean
    description: string
    icon: string
  }
}