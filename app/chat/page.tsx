export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-lg">🤖</span>
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">Simon</h1>
              <p className="text-sm text-gray-600">Your Anza concierge</p>
            </div>
          </div>
        </div>

        {/* Chat Area - Placeholder */}
        <div className="p-4 space-y-4">
          <div className="chat-bubble chat-bubble-ai">
            <p>Hey there! 👋 I'm Simon, your personal concierge for the Anza Hotel. 
               I know all the best spots around Calabasas and Malibu. 
               What can I help you discover today?</p>
          </div>
        </div>

        {/* Input Area - Placeholder */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="max-w-md mx-auto">
            <div className="flex space-x-3">
              <input
                type="text"
                placeholder="Ask Simon anything..."
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500"
              />
              <button className="bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}