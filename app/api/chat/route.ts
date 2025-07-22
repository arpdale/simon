import Anthropic from '@anthropic-ai/sdk'
import { SIMON_PERSONALITY } from '@/lib/ai-prompts'
import { locationContext } from '@/lib/mock-data'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    
    // Build system prompt with Simon's personality and context
    const systemPrompt = `${SIMON_PERSONALITY}

LOCATION CONTEXT:
You are the concierge for ${locationContext.hotel.name} located at ${locationContext.hotel.address}. 
You serve ${locationContext.targetAudience} seeking ${locationContext.priceRange} experiences.
Your recommendations should focus on: ${locationContext.localAreas.join(', ')}.
Search within a ${locationContext.searchRadius}-mile radius of the hotel.

CURRENT CONVERSATION:
Respond naturally as Simon. If the guest asks about restaurants, attractions, or hotel services, include the appropriate widget trigger in your response.`

    const stream = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
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
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}