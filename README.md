# GalaGram - Private Travel App

A private travel application for discovering local destinations in the Philippines with AI-powered recommendations.

## Features

- 🏝️ **Destination Discovery**: Explore popular Philippine destinations
- 🤖 **AI Travel Assistant**: Get personalized recommendations with OpenAI
- 📅 **Itinerary Planning**: Create and manage your travel plans
- 🔍 **Smart Search**: Find restaurants, attractions, and accommodations
- ❤️ **Favorites**: Save your preferred destinations
- 💬 **AI Chat**: Get travel advice and local insights
- 📱 **PWA Ready**: Install as a mobile app

## Setup Instructions

### 1. Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:
```
VITE_OPENAI_API_KEY=sk-your-actual-api-key-here
VITE_OPENAI_MODEL=gpt-3.5-turbo
```

### 2. Demo Mode

The app works without an API key in demo mode with:
- Static destination data
- Fallback recommendations
- Limited AI chat responses

### 3. Full AI Features

With a valid OpenAI API key, you get:
- Personalized destination recommendations
- AI-generated itineraries
- Smart travel suggestions
- Enhanced chat assistance

### 4. Getting an OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Go to API Keys section
4. Create a new secret key
5. Add it to your `.env` file

### 5. Running the App

```bash
npm install
npm run dev
```

## Troubleshooting

### OpenAI API Not Working?

If you're experiencing issues with the OpenAI integration:

1. Check your API key in the `.env` file - make sure it's correctly formatted
2. Verify your OpenAI account has sufficient credits
3. The app will always work in demo mode regardless of API status
4. Look for console messages that might indicate specific errors

### Testing Without an API Key

To test the app without configuring OpenAI:
1. Leave the `.env` file with the default values or remove it
2. The app will automatically use curated demo data
3. All features will work with static recommendations

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- Framer Motion
- OpenAI API
- Progressive Web App (PWA)
- React Router
- Local Storage for data persistence

## Demo Accounts

For testing purposes:
- Email: demo@example.com
- Password: password123

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Notes

- The app is optimized for Philippine travel content
- All AI responses are tailored to Philippine destinations
- Works offline with cached data and service worker
- Responsive design for mobile and desktop use