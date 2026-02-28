# AI Gateway Telegram Bot

Professional management interface for your AI Gateway.

## Features
- **1-Click Key Gen**: Users can generate their unique `sk-frenix` keys.
- **Strict Limits**: Only **one** key per Telegram Account.
- **Live Stats**: Real-time tracking of requests, tokens, and costs.
- **Enterprise Grade**: Clean UI using Telegram Keyboards.

## Setup
1. Create a bot via [@BotFather](https://t.me/botfather).
2. Copy the token into `index.js` or a `.env` file.
3. Install dependencies:
   ```bash
   cd bot
   npm install
   ```
4. Start the bot:
   ```bash
   npm start
   ```

## Integration
The bot communicates with the AI Gateway API. Ensure your Gateway is running on `http://localhost:3000` (or update `API_BASE` in `.env`).
