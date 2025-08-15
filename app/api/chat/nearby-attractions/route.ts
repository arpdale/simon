import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    // Create a structured prompt for Anthropic
    const systemPrompt = `You are Simon, the AI concierge for the Renaissance Los Angeles Airport Hotel. When users ask about nearby attractions, you should respond with JSON that includes both a conversational response AND structured attraction data.

Your response MUST be valid JSON in this exact format:
{
  "textResponse": "A friendly, conversational response about nearby attractions and things to do",
  "attractions": [
    {
      "id": "unique-attraction-id",
      "name": "Attraction Name",
      "type": "Attraction Type (Museum, Beach, Shopping, etc.)",
      "rating": 4.8,
      "priceLevel": "Free", "$$", "$$$", or "$$$$",
      "description": "Brief description for cards",
      "detailedDescription": "Longer detailed description for the details page",
      "setting": "Description of the attraction's atmosphere and setting",
      "mustTry": "Key activities and must-see highlights",
      "experience": "What makes the experience special",
      "imageUrl": "/images/attraction-placeholder.jpg",
      "address": "Full address",
      "website": "https://website.com",
      "phone": "(XXX) XXX-XXXX"
    }
  ]
}

Guidelines:
- Always include 2-3 top attractions near LAX/Los Angeles area
- Include diverse attraction types (beaches, museums, shopping, entertainment, etc.)
- Ratings should be between 4.2-4.9
- Price levels: "Free", "$", "$$", "$$$", "$$$$"
- Descriptions should be 2-3 sentences highlighting unique features and visitor experience
- Use placeholder image URLs for now
- Make the textResponse feel personal and helpful

Remember: Your entire response must be valid JSON that can be parsed. Do not include any text before or after the JSON.`

    const userPrompt = `${query}\n\nPlease provide nearby attractions recommendations in the specified JSON format.`

    // Create streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // For now, we'll create a mock response to demonstrate the structure
          // In production, this would call Anthropic's API
          const mockResponse = {
            textResponse: "Steve, I'm excited to help you explore Los Angeles!\n\nThere are so many incredible attractions near your hotel. From world-famous beaches to iconic entertainment destinations, LA has something for everyone.",
            attractions: [
              {
                id: "santa-monica-pier",
                name: "Santa Monica Pier",
                type: "Entertainment",
                rating: 4.6,
                priceLevel: "Free",
                description: "Iconic oceanfront amusement park with historic carousel and thrilling rides. Perfect blend of nostalgia and fun! →",
                detailedDescription: "This iconic oceanfront amusement park features a historic carousel, thrilling rides, and stunning Pacific Ocean views. The perfect blend of nostalgia and modern fun right on the beach.",
                setting: "Historic wooden pier extending into the Pacific Ocean with colorful carnival rides, vintage arcade games, and bustling boardwalk atmosphere. The sound of waves mixes with carnival music and laughter.",
                mustTry: "Ride the historic 1922 carousel, experience the Pacific Wheel Ferris wheel with ocean views, try carnival games, and explore the Santa Monica Pier Aquarium beneath the pier.",
                experience: "A quintessential LA experience where vintage charm meets modern entertainment. Street performers, ocean breezes, and stunning sunsets create magical moments for visitors of all ages.",
                imageUrl: "https://picsum.photos/seed/santamonica/800/600",
                address: "200 Santa Monica Pier, Santa Monica, CA 90401",
                website: "https://santamonicapier.org",
                phone: "(310) 458-8900"
              },
              {
                id: "getty-center",
                name: "Getty Center",
                type: "Museum",
                rating: 4.8,
                priceLevel: "Free",
                description: "Architectural masterpiece with world-class art and stunning hilltop gardens. Free admission! →",
                detailedDescription: "This architectural masterpiece houses world-class art collections in stunning hilltop gardens with panoramic city views. Free admission makes it accessible to all.",
                setting: "Modernist campus perched atop the Santa Monica Mountains with pristine white travertine buildings, meticulously manicured gardens, and sweeping views from the Pacific to downtown LA.",
                mustTry: "Explore the Central Garden's living sculpture, view European paintings and sculptures, experience the architecture tour, and enjoy sunset views from the outdoor terraces.",
                experience: "A world-class cultural destination that combines artistic masterpieces with architectural innovation. The outdoor spaces and city views create an inspiring atmosphere for art lovers and casual visitors alike.",
                imageUrl: "https://picsum.photos/seed/getty/800/600",
                address: "1200 Getty Center Dr, Los Angeles, CA 90049",
                website: "https://getty.edu",
                phone: "(310) 440-7300"
              },
              {
                id: "venice-beach",
                name: "Venice Beach",
                type: "Beach",
                rating: 4.4,
                priceLevel: "Free",
                description: "Famous for bohemian spirit, street performers, and vibrant boardwalk culture. Unique shops and art! →",
                detailedDescription: "Famous for its bohemian spirit, street performers, and vibrant boardwalk culture. A place where creativity meets California beach lifestyle.",
                setting: "Eclectic beachfront boardwalk buzzing with street performers, artists, and colorful characters. Wide sandy beach meets a carnival-like atmosphere of shops, cafes, and the famous Muscle Beach outdoor gym.",
                mustTry: "Watch bodybuilders at Muscle Beach, browse Venice Beach Boardwalk's unique shops and street art, skate or bike along the beach path, and catch street performances throughout the day.",
                experience: "An authentic slice of California counterculture where anything goes. The artistic energy, diverse community, and free-spirited atmosphere create an unforgettable LA experience that's both entertaining and inspiring.",
                imageUrl: "https://picsum.photos/seed/venice/800/600",
                address: "Venice Beach, CA 90291",
                website: "https://venicebeach.com",
                phone: "(310) 399-2775"
              }
            ]
          }

          // Simulate streaming response
          const responseText = JSON.stringify(mockResponse)
          
          // Stream the response character by character to simulate real AI streaming
          for (let i = 0; i < responseText.length; i += 10) {
            const chunk = responseText.slice(i, i + 10)
            const data = JSON.stringify({ content: chunk })
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            
            // Small delay to simulate streaming
            await new Promise(resolve => setTimeout(resolve, 20))
          }

          // Send completion signal
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()

        } catch (error) {
          console.error('Nearby attractions API error:', error)
          controller.error(error)
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error) {
    console.error('Nearby attractions API error:', error)
    return NextResponse.json(
      { error: 'Failed to get nearby attractions recommendations' },
      { status: 500 }
    )
  }
}