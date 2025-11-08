"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Trash2, Plus, Zap } from "lucide-react"
import { ModelSelector } from "@/components/model-selector"
import { useOpenRouterChat } from "@/hooks/use-openrouter-chat"
import { openRouterService } from "@/lib/openrouter"

export default function ChatGPTClone() {
  const [selectedModel, setSelectedModel] = useState(openRouterService.getDefaultFreeModel())
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, clearMessages } = useOpenRouterChat(selectedModel)
  const [conversations, setConversations] = useState([{ id: 1, title: "New Chat", messages: [] }])
  const [currentConversation, setCurrentConversation] = useState(1)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const clearChat = () => {
    clearMessages()
  }

  const newChat = () => {
    const newId = conversations.length + 1
    setConversations([...conversations, { id: newId, title: "New Chat", messages: [] }])
    setCurrentConversation(newId)
    clearMessages()
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return
    handleSubmit(e)
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4">
          <Button onClick={newChat} className="w-full bg-gray-700 hover:bg-gray-600 text-white border border-gray-600">
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>

        <ScrollArea className="flex-1 px-2">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`p-3 m-1 rounded cursor-pointer hover:bg-gray-700 ${
                currentConversation === conv.id ? "bg-gray-700" : ""
              }`}
              onClick={() => setCurrentConversation(conv.id)}
            >
              <div className="text-sm truncate">{conv.title}</div>
            </div>
          ))}
        </ScrollArea>

        <div className="p-4 border-t border-gray-700">
          <div className="text-sm text-gray-400">ChatGPT Clone</div>
          <div className="text-xs text-gray-500">Powered by OpenRouter</div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">ChatGPT Clone</h1>
            <Button
              onClick={clearChat}
              variant="outline"
              size="sm"
              className="text-gray-600 hover:text-gray-800 bg-transparent"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Chat
            </Button>
          </div>
          
          {/* Model Selector */}
          <div className="max-w-md">
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <Bot className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">How can I help you today?</h2>
                <p className="text-gray-600 dark:text-gray-400">Start a conversation by typing a message below.</p>
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Zap className="w-4 h-4 text-blue-500" />
                  <span>Using {selectedModel}</span>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="flex gap-4">
                  <Avatar className="w-8 h-8 mt-1">
                    <AvatarFallback className={message.role === "user" ? "bg-blue-500" : "bg-green-500"}>
                      {message.role === "user" ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-gray-800 dark:text-white mb-1">
                      {message.role === "user" ? "You" : "ChatGPT"}
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
                      <div className="whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex gap-4">
                <Avatar className="w-8 h-8 mt-1">
                  <AvatarFallback className="bg-green-500">
                    <Bot className="w-4 h-4 text-white" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-800 dark:text-white mb-1">ChatGPT</div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={onSubmit} className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Message ChatGPT..."
                  className="pr-12 py-3 text-base border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white p-2"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>ChatGPT can make mistakes. Consider checking important information.</span>
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-blue-500" />
                <span>{selectedModel}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
