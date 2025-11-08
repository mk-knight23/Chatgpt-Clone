# 🤖 ChatGPT Clone with OpenRouter

A modern, feature-rich ChatGPT clone built with Next.js, featuring real AI models through OpenRouter, theme support, and a clean user interface.

## 🚀 Live Demo

**📍 Deploy to Vercel:**
1. Visit [Vercel.com](https://vercel.com)
2. Sign in with GitHub and import: `mk-knight23/Chatgpt-Clone`
3. Add environment variable: `OPENROUTER_API_KEY` = your OpenRouter API key
4. Click "Deploy"

**🔗 After deployment, your app will be live at:** [Live Link ](https://v0-clone-chat-gpt-app-eta.vercel.app)

## ✨ Features

### 🤖 **AI Integration**
- **9 Free AI Models** via OpenRouter:
  - **MiniMax M2** - Compact 10B activated parameters (230B total)
  - **DeepSeek R1T2 Chimera** - 671B mixture-of-experts model
  - **GLM 4.5 Air** - Lightweight MoE with hybrid inference
  - **DeepSeek R1T Chimera** - Reasoning + efficiency merge
  - **DeepSeek V3 0324** - 685B-parameter mixture-of-experts
  - **DeepSeek R1 0528** - 671B parameters, 37B active
  - **Qwen3 235B A22B** - 235B MoE, 22B active parameters
  - **Qwen3 Coder 480B A35B** - 480B MoE for coding tasks
  - **Gemini 2.0 Flash Experimental** - Fast multimodal model

### 🎨 **User Interface**
- **Real-time Streaming** responses
- **Model Selection** with search functionality
- **Dark/Light Theme** toggle
- **Responsive Design** for all devices
- **Modern Chat Interface** with message bubbles
- **Loading Animations** and smooth interactions

### 🛠️ **Technical Features**
- **Error Handling** with graceful fallbacks
- **Demo Mode** when API unavailable
- **TypeScript** throughout
- **Server-Sent Events** for streaming
- **Production Ready** optimization

## 🛠️ Tech Stack

- **Framework:** Next.js 15.2.4
- **Language:** TypeScript
- **UI Library:** React 19
- **Styling:** Tailwind CSS
- **Components:** Radix UI
- **Themes:** Next Themes
- **AI Integration:** OpenRouter API
- **Icons:** Lucide React
- **Deployment:** Vercel (recommended)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- OpenRouter API key ([Get free key](https://openrouter.ai/keys))

### Local Development
```bash
# Clone the repository
git clone https://github.com/mk-knight23/Chatgpt-Clone.git
cd Chatgpt-Clone

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your OpenRouter API key to .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment

### Vercel (Recommended)
1. **Push to GitHub** (already done)
2. **Connect to Vercel:**
   - Visit [Vercel.com](https://vercel.com)
   - Import `mk-knight23/Chatgpt-Clone`
3. **Environment Variables:**
   - `OPENROUTER_API_KEY`: Your OpenRouter API key
4. **Deploy:** Click "Deploy" and wait 2-3 minutes

### Other Platforms
This Next.js app can also be deployed to:
- **Netlify**
- **Railway** 
- **DigitalOcean App Platform**
- **AWS Amplify**

## 🎯 Usage

1. **Select a Model:** Use the dropdown to choose from 9 free AI models
2. **Send Messages:** Type your message and press Enter or click Send
3. **Theme Toggle:** Switch between light and dark modes
4. **Model Switching:** Try different models for various tasks
5. **Clear Chat:** Reset conversation when needed

## 📁 Project Structure

```
Chatgpt-Clone/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Main chat page
├── components/         # React components
│   ├── ui/            # UI components (Radix)
│   ├── model-selector.tsx
│   └── theme-provider.tsx
├── hooks/              # Custom React hooks
│   └── use-openrouter-chat.ts
├── lib/               # Utility libraries
│   ├── openrouter.ts  # OpenRouter integration
│   └── client-models.ts
├── public/            # Static assets
├── styles/            # Global styles
└── configuration files
```

## 🔑 API Configuration

### OpenRouter Setup
1. **Create Account:** Visit [openrouter.ai](https://openrouter.ai)
2. **Generate API Key:** Go to [openrouter.ai/keys](https://openrouter.ai/keys)
3. **Add to Environment:**
   - Local: Add to `.env.local`
   - Production: Add to Vercel environment variables

### Environment Variables
```env
OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
```

## 🤖 Available Models

| Model | Context Length | Max Output | Best For |
|-------|---------------|------------|----------|
| MiniMax M2 | 197K | 8,192 | Coding & Workflows |
| DeepSeek R1T2 Chimera | 164K | 8,192 | Complex Reasoning |
| GLM 4.5 Air | 131K | 4,096 | Lightweight Tasks |
| DeepSeek R1T Chimera | 164K | 4,096 | Efficient Reasoning |
| DeepSeek V3 0324 | 164K | 8,192 | General Purpose |
| DeepSeek R1 0528 | 164K | 8,192 | OpenAI o1 Alternative |
| Qwen3 235B A22B | 131K | 4,096 | Mixed Tasks |
| Qwen3 Coder 480B A35B | 262K | 4,096 | Code Generation |
| Gemini 2.0 Flash | 1,050K | 8,192 | Fast Multimodal |

## 🎨 Screenshots

### Light Mode
- Clean, modern chat interface
- Intuitive model selection
- Smooth animations

### Dark Mode
- Professional dark theme
- Reduced eye strain
- Consistent styling

## 🔧 Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Key Files
- `app/api/chat/route.ts` - OpenRouter API integration
- `lib/openrouter.ts` - Server-side OpenRouter service
- `components/model-selector.tsx` - Model selection UI
- `hooks/use-openrouter-chat.ts` - Chat management logic

## 🛡️ Error Handling

- **API Failures:** Graceful fallback to demo mode
- **Invalid Keys:** Clear error messages with setup instructions
- **Rate Limits:** Helpful retry suggestions
- **Network Issues:** Offline-ready interface

## 📊 Performance

- **Fast Loading:** Optimized bundle size
- **Streaming:** Real-time response streaming
- **Caching:** Efficient API response handling
- **Mobile:** Responsive design for all devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **OpenRouter** - Unified AI model access
- **Next.js** - React framework
- **Radix UI** - Accessible component library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide** - Beautiful icon library

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/mk-knight23/Chatgpt-Clone/issues)
- **Discussions:** [GitHub Discussions](https://github.com/mk-knight23/Chatgpt-Clone/discussions)
- **OpenRouter Support:** [openrouter.ai/support](https://openrouter.ai/support)

---

**Built with ❤️ using OpenRouter and Next.js**

*Experience the power of 9 free AI models in a beautiful, modern chat interface.*
