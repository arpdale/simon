import Link from 'next/link'

export default function QRLandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 luxury-gradient">
      <div className="max-w-md w-full text-center space-y-10">
        {/* Hotel Branding */}
        <div className="space-y-3">
          <h1 className="font-display text-4xl font-medium text-primary-800 tracking-tight">
            Welcome to Anza Hotel
          </h1>
          <p className="font-serif text-lg text-secondary-700 italic">
            Calabasas, California
          </p>
        </div>

        {/* Simon Introduction */}
        <div className="widget-card space-y-6 px-8 py-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full mx-auto flex items-center justify-center shadow-lg">
            <span className="text-3xl">🤵</span>
          </div>
          
          <div className="space-y-3">
            <h2 className="font-display text-2xl font-medium text-neutral-900">
              Meet Simon
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Your personal AI concierge for the finest local recommendations, 
              exclusive hotel services, and curated experiences throughout Calabasas.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <Link 
          href="/chat"
          className="luxury-button block w-full text-center font-medium py-3 text-lg tracking-wide"
        >
          Begin Your Experience
        </Link>

        {/* Quick Access */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <button className="p-4 bg-neutral-50 border border-neutral-200 hover:border-primary-300 hover:bg-neutral-100 transition-all duration-300 group">
            <div className="text-xl mb-2 group-hover:scale-110 transition-transform">🍽️</div>
            <span className="font-medium text-neutral-800">Dining</span>
          </button>
          <button className="p-4 bg-neutral-50 border border-neutral-200 hover:border-primary-300 hover:bg-neutral-100 transition-all duration-300 group">
            <div className="text-xl mb-2 group-hover:scale-110 transition-transform">🎭</div>
            <span className="font-medium text-neutral-800">Culture</span>
          </button>
          <button className="p-4 bg-neutral-50 border border-neutral-200 hover:border-primary-300 hover:bg-neutral-100 transition-all duration-300 group">
            <div className="text-xl mb-2 group-hover:scale-110 transition-transform">🏨</div>
            <span className="font-medium text-neutral-800">Services</span>
          </button>
        </div>
      </div>
    </div>
  )
}