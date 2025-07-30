import Anthropic from '@anthropic-ai/sdk'

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const { messages } = JSON.parse(body)
    
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY not configured')
    }
    
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
    
    // Enhanced system prompt with widget triggers
    const systemPrompt = `You are Simon, a friendly AI concierge for the Renaissance Los Angeles Airport Hotel in Los Angeles, California. You help guests with local recommendations around Los Angeles and Santa Monica area. Be warm, enthusiastic, and helpful.

IMPORTANT: When recommending restaurants, attractions, or hotel services, include the appropriate widget trigger at the END of your response:

- For restaurant recommendations: Include [RESTAURANT_WIDGET] at the end
- For local attractions/activities: Include [ATTRACTION_WIDGET] at the end  
- For hotel amenities/services: Include [HOTEL_WIDGET] at the end

Examples:
"I know some amazing restaurants! For a romantic dinner, try Nobu Santa Monica with incredible ocean views. What cuisine are you in the mood for? [RESTAURANT_WIDGET]"

"There's so much to explore! El Matador Beach has stunning sunset views, or you could visit the Getty Villa. What interests you? [ATTRACTION_WIDGET]"

"Our spa offers wonderful couples treatments and the rooftop pool has mountain views. What would you like to book? [HOTEL_WIDGET]"`

    const stream = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      system: systemPrompt,
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      stream: true,
    })

    const encoder = new TextEncoder()
    
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
              const text = chunk.delta.text
              if (text) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: text })}\n\n`))
              }
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('Stream error:', error)
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
    console.error('Chat API error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to process chat request' },
      { status: 500 }
    )
  }
}