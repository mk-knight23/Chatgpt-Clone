"use client"

import { useState, useCallback, useRef } from 'react'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: number
}

export interface UseOpenRouterChat {
  messages: ChatMessage[]
  input: string
  isLoading: boolean
  setInput: (value: string) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  setMessages: (messages: ChatMessage[]) => void
  clearMessages: () => void
}

export function useOpenRouterChat(
  model: string = 'minimax/minimax-m2'
): UseOpenRouterChat {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const currentMessageId = useRef<string | null>(null)

  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    }
    setMessages(prev => [...prev, newMessage])
    return newMessage.id
  }, [])

  const updateMessage = useCallback((id: string, content: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === id 
          ? { ...msg, content: msg.content + content }
          : msg
      )
    )
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)

    // Add user message
    addMessage({
      role: 'user',
      content: userMessage
    })

    // Create assistant message
    const assistantMessageId = addMessage({
      role: 'assistant',
      content: ''
    })

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, {
            role: 'user' as const,
            content: userMessage
          }],
          model
        }),
      })

      if (!response.ok) {
        // Handle HTTP errors gracefully
        throw new Error(`API request failed: ${response.status}`)
      }

      if (!response.body) {
        throw new Error('No response body')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              return
            }

            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices[0]?.delta?.content || ''
              if (content) {
                updateMessage(assistantMessageId, content)
              }
            } catch (parseError) {
              // Skip invalid JSON
              continue
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
      
      // Provide helpful error message based on error type
      let errorMessage = 'Sorry, I encountered an error. Please try again.'
      
      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          errorMessage = '❌ Invalid API key. Please update your OpenRouter API key in .env.local'
        } else if (error.message.includes('fetch')) {
          errorMessage = '🔗 Connection error. Please check your network connection.'
        } else if (error.message.includes('API request failed')) {
          errorMessage = '⚠️ API request failed. The service may be temporarily unavailable.'
        }
      }
      
      updateMessage(assistantMessageId, errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, messages, model, addMessage, updateMessage])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    input,
    isLoading,
    setInput,
    handleSubmit,
    handleInputChange,
    setMessages,
    clearMessages
  }
}
