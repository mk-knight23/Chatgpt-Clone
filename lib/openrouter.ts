const OPENROUTER_API_KEY = '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';
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

export interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
  context_length?: number;
  pricing: {
    prompt: number;
    completion: number;
  };
  top_provider: {
    context_length: number;
    max_completion_tokens: number;
  };
}

export interface FreeModel extends OpenRouterModel {
  isFree: boolean;
}

export class OpenRouterService {
  private static instance: OpenRouterService;
  private models: OpenRouterModel[] = [];
  private freeModels: FreeModel[] = [];
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): OpenRouterService {
    if (!OpenRouterService.instance) {
      OpenRouterService.instance = new OpenRouterService();
    }
    return OpenRouterService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      await this.fetchModels();
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing OpenRouter service:', error);
    }
  }

  async fetchModels(): Promise<OpenRouterModel[]> {
    try {
      const response = await fetch(`${OPENROUTER_BASE_URL}/models`, {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://chatgpt-clone.vercel.app',
          'X-Title': 'ChatGPT Clone with OpenRouter',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`);
      }
      
      const data = await response.json();
      this.models = data.data || [];
      
      // Use the current free models list
      this.freeModels = this.getCurrentFreeModels();
      console.log(`Using ${this.freeModels.length} current free models`);

      return this.models;
    } catch (error) {
      console.error('Error fetching OpenRouter models, using current free models:', error);
      // Use current free models if API fails
      this.freeModels = this.getCurrentFreeModels();
      return [];
    }
  }

  // All current free models from OpenRouter (Jan 2025)
  private getCurrentFreeModels(): FreeModel[] {
    return [
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
    ];
  }

  getFreeModels(): FreeModel[] {
    return this.freeModels;
  }

  getAllModels(): OpenRouterModel[] {
    return this.models;
  }

  async createChatCompletion(
    model: string, 
    messages: Array<{role: 'user' | 'assistant' | 'system'; content: string}>
  ) {
    try {
      const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://chatgpt-clone.vercel.app',
          'X-Title': 'ChatGPT Clone with OpenRouter',
        },
        body: JSON.stringify({
          model,
          messages,
          stream: false,
          // Add some basic parameters that most models support
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API request failed: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error creating chat completion:', error);
      throw error;
    }
  }

  async createStreamingChatCompletion(
    model: string, 
    messages: Array<{role: 'user' | 'assistant' | 'system'; content: string}>,
    onChunk: (chunk: string) => void
  ) {
    try {
      const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://chatgpt-clone.vercel.app',
          'X-Title': 'ChatGPT Clone with OpenRouter',
        },
        body: JSON.stringify({
          model,
          messages,
          stream: true,
          // Add some basic parameters that most models support
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API request failed: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader available');
      }

      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || '';
              if (content) {
                onChunk(content);
              }
            } catch (parseError) {
              // Skip invalid JSON
              continue;
            }
          }
        }
      }
    } catch (error) {
      console.error('Error creating streaming chat completion:', error);
      throw error;
    }
  }

  // Helper method to get a default free model
  getDefaultFreeModel(): string {
    const freeModels = this.getFreeModels();
    return freeModels.length > 0 ? freeModels[0].id : 'minimax/minimax-m2';
  }
}

export const openRouterService = OpenRouterService.getInstance();
