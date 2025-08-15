import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    // Create a structured prompt for Anthropic
    const systemPrompt = `You are Simon, the AI concierge for the Renaissance Los Angeles Airport Hotel. When users ask about local dining, you should respond with JSON that includes both a conversational response AND structured restaurant data.

Your response MUST be valid JSON in this exact format:
{
  "textResponse": "A friendly, conversational response about local dining options",
  "restaurants": [
    {
      "id": "unique-restaurant-id",
      "name": "Restaurant Name",
      "cuisine": "Cuisine Type",
      "rating": 4.8,
      "priceLevel": "$$$$",
      "description": "Brief description for cards",
      "detailedDescription": "Longer detailed description for the details page",
      "setting": "Description of the restaurant's atmosphere and setting",
      "mustTry": "Signature dishes and must-try items",
      "experience": "What makes the dining experience special",
      "imageUrl": "/images/restaurant-placeholder.jpg",
      "address": "Full address",
      "phone": "(XXX) XXX-XXXX",
      "website": "https://restaurant-website.com"
    }
  ]
}

Guidelines:
- Always include 2-3 high-end restaurants near LAX/Los Angeles area
- Include diverse cuisine types (Japanese, French, American, etc.)
- Ratings should be between 4.5-4.9
- Price levels: $, $$, $$$, $$$$
- Descriptions should be 2-3 sentences highlighting unique features
- Use placeholder image URLs for now
- Make the textResponse feel personal and helpful

Remember: Your entire response must be valid JSON that can be parsed. Do not include any text before or after the JSON.`

    const userPrompt = `${query}\n\nPlease provide local dining recommendations in the specified JSON format.`

    // Create streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // For now, we'll create a mock response to demonstrate the structure
          // In production, this would call Anthropic's API
          const mockResponse = {
            textResponse: "Steve, I'm happy to help you!\n\nThe Renaissance Los Angeles Airport Hotel has partnered with some great local restaurants to provide you excellent dining options.",
            restaurants: [
              {
                id: "nobu-malibu",
                name: "Nobu Malibu",
                cuisine: "Japanese-Peruvian Fusion",
                rating: 4.9,
                priceLevel: "$$$$",
                description: "Incredible Japanese fusion with breathtaking oceanfront views. Perfect for special occasions. →",
                detailedDescription: "Celebrity haven perched directly above Carbon Beach with breathtaking oceanfront views. Chef Nobu Matsuhisa's legendary fusion cuisine meets California beach luxury in this sleek, modern Japanese sanctuary.",
                setting: "Expansive ocean terrace with private dining cabanas and dramatic Pacific sunset views. Floor-to-ceiling windows and natural timber create sophisticated minimalism with maximum wow factor.",
                mustTry: "The legendary Black Cod Miso (Nobu's signature masterpiece), Rock Shrimp Tempura, Yellowtail Sashimi with Jalapeño, and Malibu-exclusive dishes like Live Sweet Shrimp.",
                experience: "Where A-listers come to dine on world-class Japanese cuisine while watching waves crash below. This is one of LA's most sought-after reservations – pure dining perfection where sophisticated flavors meet unparalleled ocean views.",
                imageUrl: "/images/nobu-oceanview.jpg",
                address: "22706 Pacific Coast Hwy, Malibu, CA 90265",
                phone: "(310) 317-9140",
                website: "https://www.noburestaurants.com/malibu"
              },
              {
                id: "republique",
                name: "Republique",
                cuisine: "Modern French",
                rating: 4.7,
                priceLevel: "$$$$",
                description: "Housed in a stunning historic building, offering French cuisine in a romantic atmosphere. Their pastries are legendary! →",
                detailedDescription: "Housed in a stunning historic 1928 Gothic-style building, République transforms from a bustling daytime café to an elegant French dining destination by night.",
                setting: "Soaring cathedral ceilings with exposed brick and dramatic archways create an intimate yet grand atmosphere. The space buzzes with energy during brunch and becomes romantically lit for dinner service.",
                mustTry: "Chef Walter Manzke's sophisticated French-California pastries at breakfast, Duck Confit, and the legendary weekend brunch spread with house-made charcuterie.",
                experience: "A true LA institution where impeccable French technique meets California sensibility. The historic architecture alone is worth the visit, but the exceptional cuisine keeps locals and visitors returning.",
                imageUrl: "/images/republique-interior.jpg",
                address: "624 S La Brea Ave, Los Angeles, CA 90036",
                phone: "(310) 362-6115",
                website: "https://republiquela.com"
              },
              {
                id: "guelaguetza",
                name: "Guelaguetza",
                cuisine: "Mexican",
                rating: 4.6,
                priceLevel: "$$$",
                description: "Authentic Oaxacan cuisine with rich moles, traditional mezcals, and vibrant atmosphere. Weekend mariachi performances! →",
                detailedDescription: "This beloved family-owned restaurant brings authentic Oaxacan cuisine to Los Angeles with rich moles, traditional mezcals, and vibrant atmosphere.",
                setting: "Colorful, festive atmosphere with traditional Mexican décor, hand-painted murals, and the sounds of live mariachi music on weekends. The space feels like a warm embrace from Mexico.",
                mustTry: "The famous seven-mole sampler showcasing complex Oaxacan flavors, Tasajo (dried beef), Chiles Rellenos, and traditional mezcal cocktails made with authentic spirits.",
                experience: "A true cultural experience where generations of the Campos family share their Oaxacan heritage through food. Weekend mariachi performances create an unforgettable celebration of Mexican tradition.",
                imageUrl: "https://picsum.photos/seed/guelaguetza/800/600",
                address: "3014 W Olympic Blvd, Los Angeles, CA 90006",
                phone: "(213) 427-0601",
                website: "https://www.guelaguetza.com"
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
          console.error('Local dining API error:', error)
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
    console.error('Local dining API error:', error)
    return NextResponse.json(
      { error: 'Failed to get local dining recommendations' },
      { status: 500 }
    )
  }
}