"use client"

import { useState, useCallback } from 'react';
import { useSettings } from '@/lib/settings-store';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { selectedProvider, selectedModel, providerSettings } = useSettings();

  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage.id;
  }, []);

  const updateMessage = useCallback((id: string, content: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === id ? { ...msg, content: msg.content + content } : msg
      )
    );
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    addMessage({ role: 'user', content: userMessage });
    const assistantId = addMessage({ role: 'assistant', content: '' });

    try {
      const config = providerSettings[selectedProvider] || {};
      
      // Validate API key exists for providers that require it
      const provider = { id: selectedProvider };
      if (selectedProvider !== 'ollama' && selectedProvider !== 'lmstudio' && !config.apiKey) {
        updateMessage(assistantId, '❌ Error: API key not configured. Please add your API key in Settings.');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }],
          provider: selectedProvider,
          model: selectedModel,
          config
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || '';
              if (content) updateMessage(assistantId, content);
            } catch {}
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      let errorMsg = '❌ Error: Unable to get response.';
      
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          errorMsg = '❌ Error: Invalid API key. Please check your API key in Settings.';
        } else if (error.message.includes('402')) {
          errorMsg = '❌ Error: Payment required. Your API key may need credits or a valid payment method.';
        } else if (error.message.includes('429')) {
          errorMsg = '❌ Error: Rate limit exceeded. Please wait a moment and try again.';
        } else if (error.message.includes('500')) {
          errorMsg = '❌ Error: Provider service error. Please try again later.';
        } else {
          errorMsg = `❌ Error: ${error.message}`;
        }
      }
      
      updateMessage(assistantId, errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, selectedProvider, selectedModel, providerSettings, addMessage, updateMessage]);

  const clearMessages = useCallback(() => setMessages([]), []);

  return {
    messages,
    input,
    isLoading,
    setInput,
    handleSubmit,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value),
    clearMessages
  };
}
