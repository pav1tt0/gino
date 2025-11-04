# SustainAI Materials - Secure Setup Guide

## 🚨 IMPORTANT: API Key Security

**Never share your API keys publicly or commit them to version control!**

## Setup Instructions

### 1. Secure API Key Configuration

1. **Get a new API key** (since you accidentally shared yours):
   - Go to [Anthropic Console](https://console.anthropic.com/)
   - Revoke your old key immediately
   - Generate a new API key

2. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

3. **Add your API key to `.env`**:
   ```env
   REACT_APP_ANTHROPIC_API_KEY=your_new_api_key_here
   ```

### 2. Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

### 3. Using the AI Chat

The app now supports two approaches:

#### Option A: Direct API Integration (Frontend)
- ⚠️ **Not recommended for production** (API keys exposed in browser)
- Good for development/testing only
- Update `src/App.js` to use `AIService`

#### Option B: Backend Proxy (Recommended)
- ✅ **Secure for production**
- API keys stored safely on server
- Set up the backend server:

```bash
cd backend-example
npm install
echo "ANTHROPIC_API_KEY=your_api_key_here" > .env
npm start
```

### 4. Current Implementation

The current implementation uses a **smart simulation system** that:
- Analyzes your materials database
- Provides intelligent responses without external API calls
- Works immediately without setup
- Perfect for demos and testing

### 5. Upgrade to Real AI

When ready for production AI:

1. **For immediate testing** (not secure):
   ```javascript
   import AIService from './services/aiService';

   const aiService = new AIService();
   const response = await aiService.callAnthropic(message, materials);
   ```

2. **For production** (secure):
   ```javascript
   const response = await aiService.callBackendAPI(message, materials);
   ```

## Security Best Practices

- ✅ API keys in `.env` files only
- ✅ `.env` files in `.gitignore`
- ✅ Use backend proxy for production
- ✅ Regenerate compromised keys immediately
- ❌ Never commit API keys to git
- ❌ Never share keys in chat/email

## Features Available Now

Your AI chat can handle:
- "Which materials are most sustainable?"
- "Show me low carbon footprint options"
- "What about water usage?"
- "Tell me about [material name]"
- "What categories do you have?"

Upload your materials CSV to get started!