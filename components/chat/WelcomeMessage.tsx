export default function WelcomeMessage() {
  return (
    <div className="text-center space-y-6">
      <h1 className="text-2xl font-medium text-gray-900">Simon</h1>
      
      <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto">
        <img 
          src="/logos/logo-black-bg.svg" 
          alt="Simon" 
          className="w-16 h-16"
        />
      </div>
      
      <div className="max-w-sm mx-auto">
        <p className="text-gray-700 leading-relaxed">
          Your personal AI concierge for the finest local recommendations, curated experiences, and exclusive hotel services while you enjoy your stay at the Renaissance Hotel.
        </p>
      </div>
    </div>
  )
}