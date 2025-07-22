import Link from 'next/link'

export default function QRLandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Hotel Branding */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-primary-800">
            Welcome to Anza Hotel
          </h1>
          <p className="text-secondary-600">
            Calabasas, California
          </p>
        </div>

        {/* Simon Introduction */}
        <div className="widget-card space-y-4">
          <div className="w-16 h-16 bg-primary-500 rounded-full mx-auto flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Meet Simon
            </h2>
            <p className="text-gray-600 mt-2">
              Your personal AI concierge for the best local recommendations, 
              hotel services, and exclusive experiences around Calabasas.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <Link 
          href="/chat"
          className="block w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors touch-target"
        >
          Start Chatting with Simon
        </Link>

        {/* Quick Access */}
        <div className="grid grid-cols-3 gap-3 text-sm">
          <button className="p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 transition-colors">
            <div className="text-lg mb-1">🍽️</div>
            Restaurants
          </button>
          <button className="p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 transition-colors">
            <div className="text-lg mb-1">🏖️</div>
            Attractions
          </button>
          <button className="p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 transition-colors">
            <div className="text-lg mb-1">🏨</div>
            Hotel Info
          </button>
        </div>
      </div>
    </div>
  )
}