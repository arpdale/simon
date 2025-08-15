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
- Always include exactly 4-6 restaurants near LAX/Los Angeles area that match the user's specific request
- Adapt recommendations based on user preferences (high-end vs casual, family-friendly vs romantic, etc.)
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
          // Make actual call to Anthropic API
          const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': process.env.ANTHROPIC_API_KEY || '',
              'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
              model: 'claude-3-haiku-20240307',
              max_tokens: 2000,
              system: systemPrompt,
              messages: [
                {
                  role: 'user',
                  content: userPrompt
                }
              ]
            })
          })

          if (!anthropicResponse.ok) {
            throw new Error(`Anthropic API error: ${anthropicResponse.status}`)
          }

          const anthropicData = await anthropicResponse.json()
          const aiResponseText = anthropicData.content[0].text

          // Stream the response character by character to simulate real AI streaming
          for (let i = 0; i < aiResponseText.length; i += 10) {
            const chunk = aiResponseText.slice(i, i + 10)
            const data = JSON.stringify({ content: chunk })
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            
            // Small delay to simulate streaming
            await new Promise(resolve => setTimeout(resolve, 20))
          }

          // Send completion signal
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()

        } catch (error) {
          console.error('Test API error:', error)
          
          // Clean fallback data
          const isLowKey = query.toLowerCase().includes('low-key') || query.toLowerCase().includes('casual') || query.toLowerCase().includes('family');
          
          const mockResponse = isLowKey ? {
            textResponse: "I understand! Here are some fantastic low-key, family-friendly spots with amazing food.",
            restaurants: [
              {
                id: "inn-out",
                name: "In-N-Out Burger",
                cuisine: "American",
                rating: 4.4,
                priceLevel: "$",
                description: "California beloved burger chain with fresh ingredients and secret menu.",
                detailedDescription: "California most beloved burger chain serves fresh never-frozen burgers.",
                setting: "Clean retro-style fast-casual restaurant with red-and-white checkered floors.",
                mustTry: "Double-Double burger, Animal Style fries, and chocolate shake.",
                experience: "A true California experience perfect for families.",
                imageUrl: "https://picsum.photos/seed/innout/800/600",
                address: "9149 S Sepulveda Blvd, Los Angeles, CA 90045",
                phone: "(800) 786-1000",
                website: "https://in-n-out.com"
              },
              {
                id: "langers",
                name: "Langers Delicatessen",
                cuisine: "Jewish Deli",
                rating: 4.5,
                priceLevel: "$$",
                description: "Legendary family deli serving massive pastrami sandwiches since 1947.",
                detailedDescription: "This legendary family deli has been serving the best pastrami in LA since 1947.",
                setting: "Classic deli atmosphere with vintage booths and black-and-white photos.",
                mustTry: "The famous Hot Pastrami sandwich and matzo ball soup.",
                experience: "An authentic LA institution where three generations have perfected deli dining.",
                imageUrl: "https://picsum.photos/seed/langers/800/600",
                address: "704 S Alvarado St, Los Angeles, CA 90057",
                phone: "(213) 483-8050",
                website: "https://langersdeli.com"
              },
              {
                id: "guelaguetza",
                name: "Guelaguetza",
                cuisine: "Mexican",
                rating: 4.6,
                priceLevel: "$$",
                description: "Family-run Oaxacan restaurant with authentic moles and warm atmosphere.",
                detailedDescription: "This beloved family-owned restaurant brings authentic Oaxacan cuisine to Los Angeles.",
                setting: "Colorful, festive atmosphere with traditional Mexican decor and live mariachi music.",
                mustTry: "The famous seven-mole sampler and traditional horchata drinks.",
                experience: "A true cultural experience where generations share their Oaxacan heritage through food.",
                imageUrl: "https://picsum.photos/seed/guelaguetza/800/600",
                address: "3014 W Olympic Blvd, Los Angeles, CA 90006",
                phone: "(213) 427-0601",
                website: "https://www.guelaguetza.com"
              },
              {
                id: "homeroom",
                name: "HomeRoom",
                cuisine: "Comfort Food",
                rating: 4.3,
                priceLevel: "$$",
                description: "Mac and cheese specialists with creative combinations perfect for families.",
                detailedDescription: "This cozy spot specializes in elevated mac and cheese with creative combinations.",
                setting: "Warm, homey atmosphere with communal tables and a kitchen-like feel.",
                mustTry: "The Classic mac and cheese and their famous grilled cheese sandwich.",
                experience: "Pure comfort food bliss where families can indulge in elevated mac and cheese.",
                imageUrl: "https://picsum.photos/seed/homeroom/800/600",
                address: "1720 Telegraph Ave, Oakland, CA 94612",
                phone: "(510) 251-0000",
                website: "https://homeroom510.com"
              }
            ]
          } : {
            textResponse: "I am happy to help you! Here are some excellent dining options.",
            restaurants: [
              {
                id: "nobu-malibu",
                name: "Nobu Malibu",
                cuisine: "Japanese-Peruvian Fusion",
                rating: 4.9,
                priceLevel: "$$$$",
                description: "Incredible Japanese fusion with breathtaking oceanfront views.",
                detailedDescription: "Celebrity haven perched above Carbon Beach with oceanfront views.",
                setting: "Expansive ocean terrace with private dining cabanas and Pacific sunset views.",
                mustTry: "The legendary Black Cod Miso and Rock Shrimp Tempura.",
                experience: "Where celebrities dine on world-class Japanese cuisine while watching waves.",
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
                description: "Housed in a stunning historic building offering French cuisine in romantic atmosphere.",
                detailedDescription: "Housed in a stunning historic 1928 Gothic-style building with French cuisine.",
                setting: "Soaring cathedral ceilings with exposed brick and dramatic archways.",
                mustTry: "Chef Walter Manzke sophisticated French-California pastries and Duck Confit.",
                experience: "A true LA institution where impeccable French technique meets California sensibility.",
                imageUrl: "https://picsum.photos/seed/republique/800/600",
                address: "624 S La Brea Ave, Los Angeles, CA 90036",
                phone: "(310) 362-6115",
                website: "https://republiquela.com"
              },
              {
                id: "bestia",
                name: "Bestia",
                cuisine: "Italian",
                rating: 4.7,
                priceLevel: "$$$$",
                description: "Industrial-chic Italian restaurant famous for house-made charcuterie and wood-fired dishes.",
                detailedDescription: "This industrial-chic Italian restaurant in the Arts District is famous for house-made charcuterie.",
                setting: "Raw industrial warehouse space with exposed brick and steel beams.",
                mustTry: "Bone Marrow with herbs, House-made Charcuterie board, and Wood-fired Pizza.",
                experience: "LA dining at its most exciting where exceptional Italian cooking meets Arts District edge.",
                imageUrl: "https://picsum.photos/seed/bestia/800/600",
                address: "2121 E 7th Pl, Los Angeles, CA 90021",
                phone: "(213) 514-5724",
                website: "https://bestiala.com"
              },
              {
                id: "providence",
                name: "Providence",
                cuisine: "Seafood",
                rating: 4.8,
                priceLevel: "$$$$",
                description: "Michelin-starred seafood temple with impeccable service and stunning tasting menus.",
                detailedDescription: "This Michelin-starred seafood temple offers impeccable service and stunning tasting menus.",
                setting: "Elegant dining room with warm wood tones and sophisticated table settings.",
                mustTry: "Chef Michael Cimarusti seasonal tasting menus featuring pristine Santa Barbara uni.",
                experience: "The pinnacle of fine dining in LA where every detail is perfected.",
                imageUrl: "https://picsum.photos/seed/providence/800/600",
                address: "5955 Melrose Ave, Los Angeles, CA 90038",
                phone: "(323) 460-4170",
                website: "https://providencela.com"
              }
            ]
          }

          // Stream fallback response
          const responseText = JSON.stringify(mockResponse)
          
          for (let i = 0; i < responseText.length; i += 10) {
            const chunk = responseText.slice(i, i + 10)
            const data = JSON.stringify({ content: chunk })
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            
            await new Promise(resolve => setTimeout(resolve, 20))
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
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
    console.error('Test API error:', error)
    return NextResponse.json(
      { error: 'Failed to get test recommendations' },
      { status: 500 }
    )
  }
}