# Security Guidelines

## API Key Management

### ⚠️ NEVER commit API keys to Git

API keys should NEVER be hardcoded in your source code. This project stores API keys in:
- Browser localStorage (via Settings UI)
- `.env.local` file (optional, for development)

### How to Use API Keys Safely

1. **Use the Settings Dialog** (Recommended)
   - Click Settings in the app
   - Enter your API keys
   - Keys are stored in browser localStorage only

2. **Use Environment Variables** (Optional)
   - Copy `.env.example` to `.env.local`
   - Add your keys to `.env.local`
   - `.env.local` is already in `.gitignore`

### If You Accidentally Commit Keys

1. **Immediately revoke the exposed keys** from provider dashboards
2. **Remove from git history:**
   ```bash
   git reset --soft HEAD~1  # Undo last commit
   git commit -m "your message"  # Recommit without keys
   git push --force  # Force push to overwrite history
   ```

3. **Generate new API keys** from your providers

## Exposed Keys - Action Required

If you've exposed keys, revoke them immediately:

- **OpenAI:** https://platform.openai.com/api-keys
- **OpenRouter:** https://openrouter.ai/keys
- **Anthropic:** https://console.anthropic.com
- **Google AI:** https://makersuite.google.com/app/apikey
- **Hugging Face:** https://huggingface.co/settings/tokens
- **Perplexity:** https://www.perplexity.ai/settings/api
- **xAI:** https://console.x.ai
- **Other providers:** Check their respective dashboards

## Best Practices

1. ✅ Use `.env.local` for local development
2. ✅ Add API keys via Settings UI
3. ✅ Keep `.gitignore` updated
4. ✅ Review commits before pushing
5. ❌ Never hardcode keys in source files
6. ❌ Never commit `.env.local` or `.env`
7. ❌ Never share keys in screenshots or logs

## Deployment

For production deployments (Vercel, Netlify, etc.):
- API keys are entered by end users via Settings UI
- No server-side key storage needed
- Keys stay in user's browser only
