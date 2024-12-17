# Telegram Health Insurance Bot with ChatGPT Integration

This project creates a Telegram bot that interacts with users to gather information about their health insurance needs. It asks a series of questions such as:

- Are you looking for a health insurance plan?
- What is your family size?
- What is your household income?
- What is your gender?

Once the basic questions are answered, the bot uses ChatGPT to respond to any further user input. The bot also stores the user's responses and conversation in a MongoDB database for later use.

## Demo Video
- You can see the demo video inside the demo_video folder of this repo to view the program in action!


## Features

- **Interactive Telegram Bot**: Asks users a series of questions about their health insurance needs.
- **ChatGPT Integration**: Uses OpenAI's GPT model to generate dynamic responses based on user input.
- **MongoDB Storage**: Saves user responses and conversation history in MongoDB for each individual user.

## Technologies Used

- **Telegram Bot API**: For user interaction via the Telegram platform.
- **ChatGPT (OpenAI)**: For generating intelligent responses to user queries.
- **MongoDB**: For storing user data and conversation history.
- **Node.js**: For running the backend logic of the bot.
- **Express (optional)**: Can be added for more advanced routing, but not necessary for this basic setup.

## Prerequisites

Before running the bot, ensure you have the following:

- A **Telegram Bot Token** (obtained via [BotFather](https://core.telegram.org/bots#botfather)).
- A **MongoDB Cluster URI** for a cloud MongoDB database (e.g., from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)).
- An **OpenAI API Key** (to interact with ChatGPT) from [OpenAI](https://platform.openai.com/).

## Setup

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/yourusername/telegram-health-insurance-bot.git
   cd telegram-health-insurance-bot
   ```

2. Install dependencies
   ```
   npm install
   ```
3. Create a .env file in the root of the project and add the following environment variables:
   ```
   MONGO_DB_URI=your_mongodb_cluster_uri
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   OPENAI_API_KEY=your_openai_api_key
   ```
4. Start the bot:
   ```
   node bot.js
   ```
