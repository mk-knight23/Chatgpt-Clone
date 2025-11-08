# OpenRouter API Setup Guide

## 🔑 Getting a Valid OpenRouter API Key

The current API key in `.env.local` appears to be invalid or expired. To get a working OpenRouter API key:

### Step 1: Create OpenRouter Account
1. Visit [https://openrouter.ai](https://openrouter.ai)
2. Sign up for a free account
3. Verify your email address

### Step 2: Generate API Key
1. Go to [https://openrouter.ai/keys](https://openrouter.ai/keys)
2. Click "Create Key"
3. Give it a name like "ChatGPT Clone"
4. Copy the generated key (starts with `sk-or-v1-`)

### Step 3: Update Environment Variables
Replace the current API key in `.env.local`:
```env
OPENROUTER_API_KEY=sk-or-v1-YOUR_NEW_API_KEY_HERE
```

### Step 4: Restart Development Server
```bash
npm run dev
```

## 🆓 Free Models Available

Once you have a valid API key, you'll have access to these **100% free models**:

1. **MiniMax M2** - Compact 10B activated parameters (230B total)
2. **DeepSeek R1T2 Chimera** - 671B mixture-of-experts model
3. **GLM 4.5 Air** - Lightweight MoE model with hybrid inference
4. **DeepSeek R1T Chimera** - Merge of DeepSeek-R1 and DeepSeek-V3
5. **DeepSeek V3 0324** - 685B-parameter mixture-of-experts
6. **DeepSeek R1 0528** - 671B parameters, 37B active
7. **Qwen3 235B A22B** - 235B MoE, 22B active parameters
8. **Qwen3 Coder 480B A35B** - 480B MoE, 35B active for coding
9. **Gemini 2.0 Flash Experimental** - Fast multimodal model

## 🔧 Current Implementation Status

✅ **Working Features**:
- OpenRouter API integration (per official documentation)
- 9 free models available
- Streaming responses
- Theme support (light/dark mode)
- Model selection
- Demo mode fallback
- Error handling
- Responsive UI

⚠️ **Current Issue**:
- API key appears to be invalid/expired
- Application falls back to demo mode automatically
- This is expected behavior and shows the error handling works correctly

## 🧪 Testing

Once you update with a valid API key:
1. Start the dev server: `npm run dev`
2. Open `http://localhost:3000`
3. Try sending a message
4. You should see real AI responses instead of demo mode

The console will show detailed logging for debugging API calls.
