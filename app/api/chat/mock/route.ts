export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const lastMessage = messages[messages.length - 1]?.content || ''
    
    // Mock Simon responses based on input
    let mockResponse = "Hey! I'm Simon, your Anza Hotel concierge. "
    
    if (lastMessage.toLowerCase().includes('restaurant') || lastMessage.toLowerCase().includes('food') || lastMessage.toLowerCase().includes('eat')) {
      mockResponse += "I know some amazing restaurants around Calabasas! For a romantic dinner, I'd recommend Nobu Malibu - the sunset views are incredible. Or if you want something more intimate, there's this fantastic farm-to-table place called SunCafe Organic in Studio City. What kind of cuisine are you in the mood for? [RESTAURANT_WIDGET]"
    } else if (lastMessage.toLowerCase().includes('attraction') || lastMessage.toLowerCase().includes('do') || lastMessage.toLowerCase().includes('see')) {
      mockResponse += "There's so much to explore around here! You could visit the gorgeous El Matador Beach in Malibu - perfect for sunset photos. Or if you're into wine, there are some incredible wineries in the Santa Monica Mountains. What kind of activities interest you? [ATTRACTION_WIDGET]"
    } else if (lastMessage.toLowerCase().includes('hotel') || lastMessage.toLowerCase().includes('spa') || lastMessage.toLowerCase().includes('gym')) {
      mockResponse += "I'd love to help with our hotel amenities! Our spa offers amazing couples treatments, and the rooftop pool has stunning mountain views. The fitness center is open 24/7 if you want to squeeze in a workout. What can I book for you? [HOTEL_WIDGET]"
    } else {
      mockResponse += "I know all the best spots around Calabasas and Malibu. Whether you're looking for amazing restaurants, beautiful attractions, or want to book hotel services, I'm here to help! What sounds interesting to you?"
    }

    // Simulate streaming response
    const encoder = new TextEncoder()
    const words = mockResponse.split(' ')
    
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for (const word of words) {
            // Add a small delay to simulate real streaming
            await new Promise(resolve => setTimeout(resolve, 50))
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: word + ' ' })}\n\n`))
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('Mock stream error:', error)
          controller.error(error)
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Mock chat API error:', error)
    return Response.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}