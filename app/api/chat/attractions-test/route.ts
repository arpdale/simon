import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    // Create a structured prompt for Anthropic
    const systemPrompt = `You are Simon, the AI concierge for the Renaissance Los Angeles Airport Hotel. When users ask about nearby attractions and things to do, you should respond with JSON that includes both a conversational response AND structured attraction data.

Your response MUST be valid JSON in this exact format:
{
  "textResponse": "A friendly, conversational response about nearby attractions and activities",
  "attractions": [
    {
      "id": "unique-attraction-id",
      "name": "Attraction Name",
      "type": "Type of attraction (Museum, Beach, Shopping, etc.)",
      "rating": 4.8,
      "priceLevel": "Free, $, $$, $$$, or $$$$",
      "description": "Brief description for cards",
      "detailedDescription": "Longer detailed description for the details page",
      "setting": "Description of the location and atmosphere",
      "mustTry": "Key highlights and must-see features",
      "experience": "What makes this attraction special",
      "imageUrl": "/images/attraction-placeholder.jpg",
      "address": "Full address",
      "phone": "(XXX) XXX-XXXX",
      "website": "https://attraction-website.com"
    }
  ]
}

Guidelines:
- Always include exactly 4-6 attractions near LAX/Los Angeles area that match the user's specific request
- Adapt recommendations based on user preferences (cultural vs entertainment, family-friendly vs nightlife, etc.)
- Include diverse attraction types (beaches, museums, shopping, entertainment, outdoor activities, etc.)
- Ratings should be between 4.2-4.9
- Price levels: Free, $, $$, $$$, $$$$
- Descriptions should be 2-3 sentences highlighting unique features
- Use placeholder image URLs for now
- Make the textResponse feel personal and helpful
- Focus on attractions within reasonable distance from LAX/LAX area

Remember: Your entire response must be valid JSON that can be parsed. Do not include any text before or after the JSON.`

    const userPrompt = `${query}\n\nPlease provide nearby attractions recommendations in the specified JSON format.`

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
          let aiResponseText = anthropicData.content[0].text

          // Clean the response text to ensure valid JSON
          try {
            // Try to parse the response to validate it's proper JSON
            JSON.parse(aiResponseText)
          } catch (parseError) {
            console.warn('LLM returned malformed JSON, using fallback')
            throw new Error('Invalid JSON from LLM')
          }

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
          console.error('Attractions test API error:', error)
          
          // Clean fallback data
          const mockResponse = {
            textResponse: "Here are some great attractions in Los Angeles!",
            attractions: [
              {
                id: "santa-monica-pier",
                name: "Santa Monica Pier",
                type: "Amusement Park",
                rating: 4.4,
                priceLevel: "$$",
                description: "Iconic oceanfront amusement park with rides and games.",
                detailedDescription: "Historic pier with classic amusement park fun.",
                setting: "Oceanfront pier with carnival atmosphere.",
                mustTry: "Ferris wheel, roller coaster, and carnival games.",
                experience: "Classic LA experience by the ocean.",
                imageUrl: "https://picsum.photos/seed/santamonica/800/600",
                address: "200 Santa Monica Pier, Santa Monica, CA 90401",
                phone: "(310) 458-8900",
                website: "https://santamonicapier.org"
              },
              {
                id: "griffith-observatory",
                name: "Griffith Observatory",
                type: "Science Museum",
                rating: 4.6,
                priceLevel: "Free",
                description: "Observatory with planetarium shows and city views.",
                detailedDescription: "Art Deco observatory with astronomy exhibits.",
                setting: "Mount Hollywood with panoramic LA views.",
                mustTry: "Planetarium shows and telescope viewing.",
                experience: "Educational fun with spectacular views.",
                imageUrl: "https://picsum.photos/seed/griffith/800/600",
                address: "2800 E Observatory Rd, Los Angeles, CA 90027",
                phone: "(213) 473-0800",
                website: "https://griffithobservatory.org"
              },
              {
                id: "getty-center",
                name: "Getty Center",
                type: "Art Museum",
                rating: 4.8,
                priceLevel: "Free",
                description: "World-class art museum with stunning architecture.",
                detailedDescription: "Architectural masterpiece with art collections.",
                setting: "Hilltop museum with modernist architecture.",
                mustTry: "European paintings and Central Garden.",
                experience: "Cultural oasis with art and nature.",
                imageUrl: "https://picsum.photos/seed/getty/800/600",
                address: "1200 Getty Center Dr, Los Angeles, CA 90049",
                phone: "(310) 440-7300",
                website: "https://getty.edu"
              },
              {
                id: "venice-beach",
                name: "Venice Beach",
                type: "Beach",
                rating: 4.3,
                priceLevel: "Free",
                description: "Eclectic beachfront with street performers.",
                detailedDescription: "Iconic beach with California culture and art.",
                setting: "Bohemian beachfront with murals and street art.",
                mustTry: "Street performers, Muscle Beach, and vendors.",
                experience: "Quintessential LA beach with artistic flair.",
                imageUrl: "https://picsum.photos/seed/venice/800/600",
                address: "Venice Beach, CA 90291",
                phone: "(310) 305-9545",
                website: "https://venicebeach.com"
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
    console.error('Attractions test API error:', error)
    return NextResponse.json(
      { error: 'Failed to get attractions recommendations' },
      { status: 500 }
    )
  }
}