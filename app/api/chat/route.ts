import { openRouterService } from "@/lib/openrouter"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json()
    
    // Get the selected model (fallback to default free model)
    const selectedModel = model || openRouterService.getDefaultFreeModel()
    
    // Transform messages to match OpenRouter format
    const transformedMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content
    }))
    
    // Add system prompt
    const messagesWithSystem = [
      {
        role: 'system' as const,
        content: 'You are a helpful AI assistant. Provide clear, accurate, and helpful responses to user questions.'
      },
      ...transformedMessages
    ]

    // Create streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          await openRouterService.createStreamingChatCompletion(
            selectedModel,
            messagesWithSystem,
            (chunk: string) => {
              const data = {
                choices: [{
                  delta: {
                    content: chunk
                  }
                }]
              }
              controller.enqueue(`data: ${JSON.stringify(data)}\n\n`)
            }
          )
          
          controller.enqueue('data: [DONE]\n\n')
          controller.close()
        } catch (error) {
          console.error('Streaming error:', error)
          controller.error(error)
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
