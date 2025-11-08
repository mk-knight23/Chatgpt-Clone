"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Search, ChevronDown, Check, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { openRouterService, type FreeModel } from '@/lib/openrouter'

// All current free models from OpenRouter (Jan 2025)
const CURRENT_FREE_MODELS: FreeModel[] = [
  {
    id: 'minimax/minimax-m2',
    name: 'MiniMax M2',
    description: 'Compact 10B activated parameters (230B total) model optimized for coding and agentic workflows',
    context_length: 197000,
    pricing: { prompt: 0, completion: 0 },
    top_provider: { context_length: 197000, max_completion_tokens: 8192 },
    isFree: true
  },
  {
    id: 'tngtech/deepseek-r1t2-chimera',
    name: 'DeepSeek R1T2 Chimera',
    description: 'Second-generation 671B mixture-of-experts model with Assembly-of-Experts merge',
    context_length: 164000,
    pricing: { prompt: 0, completion: 0 },
    top_provider: { context_length: 164000, max_completion_tokens: 8192 },
    isFree: true
  },
  {
    id: 'z-ai/glm-4-5-air',
    name: 'GLM 4.5 Air',
    description: 'Lightweight MoE model with hybrid inference modes (thinking and non-thinking)',
    context_length: 131000,
    pricing: { prompt: 0, completion: 0 },
    top_provider: { context_length: 131000, max_completion_tokens: 4096 },
    isFree: true
  },
  {
    id: 'tngtech/deepseek-r1t-chimera',
    name: 'DeepSeek R1T Chimera',
    description: 'Merge of DeepSeek-R1 and DeepSeek-V3, combining reasoning with token efficiency',
    context_length: 164000,
    pricing: { prompt: 0, completion: 0 },
    top_provider: { context_length: 164000, max_completion_tokens: 4096 },
    isFree: true
  },
  {
    id: 'deepseek/deepseek-v3-0324',
    name: 'DeepSeek V3 0324',
    description: '685B-parameter mixture-of-experts model, latest iteration of flagship chat model',
    context_length: 164000,
    pricing: { prompt: 0, completion: 0 },
    top_provider: { context_length: 164000, max_completion_tokens: 8192 },
    isFree: true
  },
  {
    id: 'deepseek/r1-0528',
    name: 'DeepSeek R1 0528',
    description: '671B parameters with 37B active, open-source model with performance on par with OpenAI o1',
    context_length: 164000,
    pricing: { prompt: 0, completion: 0 },
    top_provider: { context_length: 164000, max_completion_tokens: 8192 },
    isFree: true
  },
  {
    id: 'qwen/qwen3-235b-a22b',
    name: 'Qwen3 235B A22B',
    description: '235B MoE model with 22B active parameters, supports thinking and non-thinking modes',
    context_length: 131000,
    pricing: { prompt: 0, completion: 0 },
    top_provider: { context_length: 131000, max_completion_tokens: 4096 },
    isFree: true
  },
  {
    id: 'qwen/qwen3-coder-480b-a35b',
    name: 'Qwen3 Coder 480B A35B',
    description: 'MoE code generation model with 480B parameters, 35B active for agentic coding tasks',
    context_length: 262000,
    pricing: { prompt: 0, completion: 0 },
    top_provider: { context_length: 262000, max_completion_tokens: 4096 },
    isFree: true
  },
  {
    id: 'google/gemini-2.0-flash-experimental',
    name: 'Gemini 2.0 Flash Experimental',
    description: 'Fast multimodal model with enhanced understanding, coding, and function calling',
    context_length: 1050000,
    pricing: { prompt: 0, completion: 0 },
    top_provider: { context_length: 1050000, max_completion_tokens: 8192 },
    isFree: true
  }
]

export function ModelSelector({
  selectedModel,
  onModelChange,
  disabled = false
}: {
  selectedModel: string
  onModelChange: (modelId: string) => void
  disabled?: boolean
}) {
  const [models, setModels] = useState<FreeModel[]>(CURRENT_FREE_MODELS)
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // Start with false since we have fallback models
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!hasAttemptedLoad) {
      loadModels()
    }
  }, [hasAttemptedLoad])

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  const loadModels = async () => {
    try {
      setIsLoading(true)
      setHasAttemptedLoad(true)
      
      // Try to get additional models from service
      await openRouterService.initialize()
      const serviceModels = openRouterService.getFreeModels()
      
      // If we get models from service, merge with current models (avoid duplicates)
      if (serviceModels && serviceModels.length > 0) {
        const mergedModels = [...CURRENT_FREE_MODELS]
        serviceModels.forEach(serviceModel => {
          if (!mergedModels.find(existing => existing.id === serviceModel.id)) {
            mergedModels.push(serviceModel)
          }
        })
        setModels(mergedModels)
        console.log(`Loaded ${mergedModels.length} total free models`)
      }
    } catch (error) {
      console.error('Error loading additional models, using current free models:', error)
      // Keep current models as fallback
    } finally {
      setIsLoading(false)
    }
  }

  const filteredModels = models.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (model.description && model.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const selectedModelInfo = models.find(model => model.id === selectedModel) || models[0]

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
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              Loading additional models...
            </div>
          ) : filteredModels.length === 0 ? (
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
            {models.length} cutting-edge free models available
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}
