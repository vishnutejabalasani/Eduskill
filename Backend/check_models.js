const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'config/.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
    console.log("Checking API Key...", process.env.GEMINI_API_KEY ? "Present" : "Missing");

    const candidates = ["gemini-1.5-flash", "gemini-pro", "gemini-1.0-pro", "gemini-1.5-pro"];

    for (const modelName of candidates) {
        console.log(`Testing model: ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            console.log(`SUCCESS! Model '${modelName}' works.`);
            return;
        } catch (error) {
            console.log(`FAILED ${modelName}:`, error.message);
        }
    }
    console.log("All attempts failed.");
}

test();
