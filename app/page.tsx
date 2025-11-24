"use client"

import { useRef, useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Trash2, Sun, Moon, Copy, Check } from "lucide-react"
import { SettingsDialog } from "@/components/settings-dialog"
import { LoadingStates } from "@/components/loading-states"
import { useChat } from "@/hooks/use-chat"
import { useSettings } from "@/lib/settings-store"
import { getProvider } from "@/lib/providers/registry"

export default function ChatGPTClone() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, clearMessages } = useChat()
  const { selectedProvider, selectedModel } = useSettings()
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { theme, setTheme } = useTheme()

  const provider = getProvider(selectedProvider)
  const model = provider?.models.find(m => m.id === selectedModel)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex-1 flex flex-col">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Multi-Provider AI Chat
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {provider?.name} • {model?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} variant="ghost" size="sm">
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <SettingsDialog />
              <Button onClick={clearMessages} variant="outline" size="sm" disabled={messages.length === 0}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6">
                  <Bot className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                  How can I help you today?
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Using {provider?.name} with {model?.name}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                  {[
                    { emoji: '💻', title: 'Code Assistant', desc: 'Get help with programming', color: 'blue' },
                    { emoji: '📝', title: 'Writing Help', desc: 'Improve your writing', color: 'green' },
                    { emoji: '🧠', title: 'Problem Solving', desc: 'Break down complex problems', color: 'purple' },
                    { emoji: '📚', title: 'Learning', desc: 'Learn new concepts', color: 'orange' }
                  ].map((item, i) => (
                    <div key={i} className={`p-4 bg-${item.color}-50 dark:bg-${item.color}-900/20 rounded-xl text-left hover:shadow-md transition-shadow cursor-pointer border border-${item.color}-100 dark:border-${item.color}-800`}>
                      <h3 className={`font-semibold text-${item.color}-800 dark:text-${item.color}-200 mb-1`}>
                        {item.emoji} {item.title}
                      </h3>
                      <p className={`text-sm text-${item.color}-600 dark:text-${item.color}-300`}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="group">
                  <div className="flex gap-4">
                    <Avatar className="w-8 h-8 mt-1 flex-shrink-0">
                      <AvatarFallback className={message.role === "user" 
                        ? "bg-gradient-to-br from-blue-500 to-blue-600" 
                        : "bg-gradient-to-br from-green-500 to-green-600"}>
                        {message.role === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-sm text-gray-800 dark:text-white">
                          {message.role === "user" ? "You" : "AI Assistant"}
                        </div>
                        {message.role === "assistant" && message.content && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => copyToClipboard(message.content, message.id)}
                          >
                            {copiedId === message.id ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        )}
                      </div>
                      <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                        {message.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {isLoading && <LoadingStates />}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Input
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="flex-1 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              AI can make mistakes. Using {provider?.name} • {model?.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
