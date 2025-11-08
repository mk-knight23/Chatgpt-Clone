"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Send, 
  Bot, 
  User, 
  Trash2, 
  Plus, 
  Zap, 
  Sun, 
  Moon,
  Settings,
  MessageCircle
} from "lucide-react"
import { ModelSelector } from "@/components/model-selector"
import { useOpenRouterChat } from "@/hooks/use-openrouter-chat"
import { getDefaultModel, getModelById } from "@/lib/client-models"

export default function ChatGPTClone() {
  const [selectedModel, setSelectedModel] = useState(getDefaultModel())
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, clearMessages } = useOpenRouterChat(selectedModel)
  const [conversations, setConversations] = useState([{ id: 1, title: "New Chat", messages: [] }])
  const [currentConversation, setCurrentConversation] = useState(1)
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { theme, setTheme } = useTheme()

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

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const currentModelInfo = getModelById(selectedModel)

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 space-y-3">
          <Button 
            onClick={newChat} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
          
          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 mr-2" />
            ) : (
              <Moon className="w-4 h-4 mr-2" />
            )}
            {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </Button>
        </div>

        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`p-3 m-1 rounded-lg cursor-pointer transition-colors ${
                  currentConversation === conv.id 
                    ? "bg-blue-600 text-white" 
                    : "hover:bg-gray-700 text-gray-300"
                }`}
                onClick={() => setCurrentConversation(conv.id)}
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 flex-shrink-0" />
                  <div className="text-sm truncate">{conv.title}</div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-gray-700 space-y-1">
          <div className="text-sm font-semibold text-white">ChatGPT Clone</div>
          <div className="text-xs text-gray-400">Powered by OpenRouter</div>
          {currentModelInfo && (
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span className="truncate">{currentModelInfo.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <Bot className="w-6 h-6 text-blue-500" />
              <h1 className="text-xl font-semibold text-gray-800 dark:text-white">ChatGPT Clone</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={clearChat}
                variant="outline"
                size="sm"
                className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
                disabled={messages.length === 0}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Chat
              </Button>
            </div>
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
                <Bot className="w-16 h-16 mx-auto text-gray-400 mb-6" />
                <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-3">How can I help you today?</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Start a conversation by typing a message below.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-left">
                    <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-1">💻 Code Assistant</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-300">Get help with programming questions</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-left">
                    <h3 className="font-medium text-green-800 dark:text-green-200 mb-1">📝 Writing Help</h3>
                    <p className="text-sm text-green-600 dark:text-green-300">Improve your writing and grammar</p>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-left">
                    <h3 className="font-medium text-purple-800 dark:text-purple-200 mb-1">🧠 Problem Solving</h3>
                    <p className="text-sm text-purple-600 dark:text-purple-300">Break down complex problems</p>
                  </div>
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-left">
                    <h3 className="font-medium text-orange-800 dark:text-orange-200 mb-1">📚 Learning</h3>
                    <p className="text-sm text-orange-600 dark:text-orange-300">Learn new concepts easily</p>
                  </div>
                </div>
                
                {currentModelInfo && (
                  <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Zap className="w-4 h-4 text-blue-500" />
                    <span>Currently using: {currentModelInfo.name}</span>
                  </div>
                )}
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="flex gap-4 group">
                  <Avatar className="w-8 h-8 mt-1 flex-shrink-0">
                    <AvatarFallback className={message.role === "user" ? "bg-blue-500" : "bg-green-500"}>
                      {message.role === "user" ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                      {message.role === "user" ? "You" : "ChatGPT"}
                      <span className="text-xs text-gray-400 font-normal">
                        {message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : ''}
                      </span>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300 break-words">
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex gap-4">
                <Avatar className="w-8 h-8 mt-1 flex-shrink-0">
                  <AvatarFallback className="bg-green-500">
                    <Bot className="w-4 h-4 text-white" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-800 dark:text-white mb-2">ChatGPT</div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
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
            <form onSubmit={onSubmit} className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type your message here..."
                  className="pr-12 py-3 text-base border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700"
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
            <div className="flex justify-between items-center mt-3 text-xs text-gray-500 dark:text-gray-400">
              <span>AI can make mistakes. Consider checking important information.</span>
              {currentModelInfo && (
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-blue-500" />
                  <span className="truncate max-w-32">{currentModelInfo.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
