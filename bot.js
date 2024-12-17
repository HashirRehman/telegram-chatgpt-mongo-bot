const TelegramBot = require('node-telegram-bot-api');
const { MongoClient } = require('mongodb');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();

const mongoUri = process.env.MONGO_DB_URI;
const client = new MongoClient(mongoUri);
const dbName = 'telegramBotDB';
const collectionName = 'conversations';
let db, collection;

const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(telegramToken, { polling: true });

const connectToMongoDB = async () => {
    try {
        await client.connect();
        db = client.db(dbName);
        collection = db.collection(collectionName);
        console.log('MongoDB connected successfully.');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

const setUser = async (chatId) => {
    let user = {
        chatId,
        familySize: null,
        householdIncome: null,
        gender: null,
        conversation: []
    };
    return user;
};

const getChatGptResponse = async (prompt) => {
    if (!prompt) {
        return 'Sorry, I didn’t receive a prompt. Please try again later.';
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 150
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        if (data.choices && Array.isArray(data.choices) && data.choices.length > 0) {
            return data.choices[0].message.content.trim();
        } else {
            console.error('Unexpected API response structure:', data);
            return 'Sorry, I couldn’t get a valid response. Please try again later.';
        }

    } catch (error) {
        console.error('Error calling ChatGPT API:', error);
        return 'Sorry, I couldn’t get a response. Please try again later.';
    }
};

const handleConversation = async (msg) => {
    const chatId = msg.chat.id;
    const userMessage = msg.text;

    let user = await collection.findOne({ chatId });

    if (!user) {
        user = await setUser(chatId);
        await saveConversation(user);
    }

    if (!user.familySize) {
        user.familySize = userMessage;
        await bot.sendMessage(chatId, 'Thank you! Now, what is your household income?');
    } else if (!user.householdIncome) {
        user.householdIncome = userMessage;
        await bot.sendMessage(chatId, 'Got it! And finally, what is your gender?');
    } else if (!user.gender) {
        user.gender = userMessage;
        await bot.sendMessage(chatId, 'Thank you for your responses! Let me check with our assistant.');
        const chatGptResponse = await getChatGptResponse(userMessage);
        await bot.sendMessage(chatId, chatGptResponse);
    } else {
        const chatGptResponse = await getChatGptResponse(userMessage);
        await bot.sendMessage(chatId, chatGptResponse);
    }

    user.conversation.push(userMessage);
    await saveConversation(user);
};

const saveConversation = async (user) => {
    try {
        const result = await collection.updateOne(
            { chatId: user.chatId },
            { $set: user },
            { upsert: true }
        );
        console.log('User data saved to MongoDB:', result);
    } catch (error) {
        console.error('Error saving user data:', error);
    }
};

const mainJob = async () => {
    try {
        await connectToMongoDB();
        bot.on('message', async (msg) => {
            try {
                await handleConversation(msg);
            } catch (error) {
                console.error('Error handling message:', error);
            }
        });
    } catch (error) {
        console.error('Error in mainJob:', error);
    }
};

mainJob();
