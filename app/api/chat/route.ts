import { openRouterService } from "@/lib/openrouter"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json()
    
    // Get the selected model (fallback to default free model)
    const selectedModel = model || 'minimax/minimax-m2'
    
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
          // Try to use OpenRouter service
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
          console.error('OpenRouter API error:', error)
          
          // Provide helpful error message based on error type
          let errorMessage = 'Unable to process your request. Please try again.'
          
          if (error instanceof Error) {
            if (error.message.includes('401') || error.message.includes('Unauthorized') || error.message.includes('User not found')) {
              errorMessage = 'Invalid OpenRouter API key. Please check your .env.local file and ensure you have a valid API key from https://openrouter.ai/keys'
            } else if (error.message.includes('404')) {
              errorMessage = 'Model not found. Please select a different model from the dropdown.'
            } else if (error.message.includes('429')) {
              errorMessage = 'Rate limit exceeded. Please wait a moment and try again.'
            } else if (error.message.includes('500')) {
              errorMessage = 'OpenRouter service is temporarily unavailable. Please try again later.'
            }
          }
          
          // Send error message as a streaming response
          const errorData = {
            choices: [{
              delta: {
                content: `❌ ${errorMessage}`
              }
            }]
          }
          controller.enqueue(`data: ${JSON.stringify(errorData)}\n\n`)
          controller.enqueue('data: [DONE]\n\n')
          controller.close()
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
