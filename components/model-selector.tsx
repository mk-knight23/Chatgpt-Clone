"use client"

import React, { useState, useRef } from 'react'
import { Search, ChevronDown, Check, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { FREE_MODELS, type ClientFreeModel } from '@/lib/client-models'

export function ModelSelector({
  selectedModel,
  onModelChange,
  disabled = false
}: {
  selectedModel: string
  onModelChange: (modelId: string) => void
  disabled?: boolean
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const filteredModels = FREE_MODELS.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (model.description && model.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const selectedModelInfo = FREE_MODELS.find(model => model.id === selectedModel) || FREE_MODELS[0]

  const handleModelSelect = (modelId: string) => {
    onModelChange(modelId)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className="w-full justify-between h-10 px-3 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Zap className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <span className="truncate text-sm font-medium">
              {selectedModelInfo?.name || 'Select Free Model'}
            </span>
            <Badge variant="secondary" className="ml-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Free
            </Badge>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              ref={searchInputRef}
              placeholder="Search free models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 h-9"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">All models are 100% free - no paid options</p>
        </div>
        
        <div className="max-h-80 overflow-y-auto">
          {filteredModels.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {searchTerm ? 'No free models found' : 'No free models available'}
            </div>
          ) : (
            <div className="py-2">
              {filteredModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleModelSelect(model.id)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">
                          {model.name}
                        </span>
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Free
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {model.id}
                      </p>
                      {model.description && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {model.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">
                          {model.context_length ? `${(model.context_length / 1000).toFixed(0)}K` : 'N/A'} ctx
                        </span>
                        {model.top_provider?.max_completion_tokens && (
                          <span className="text-xs text-gray-400">
                            • {model.top_provider.max_completion_tokens} output
                          </span>
                        )}
                      </div>
                    </div>
                    {selectedModel === model.id && (
                      <Check className="w-4 h-4 text-blue-500 flex-shrink-0 ml-2" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-3 border-t bg-gray-50 dark:bg-gray-800">
          <p className="text-xs text-gray-500 text-center">
            {FREE_MODELS.length} cutting-edge free models available
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}
