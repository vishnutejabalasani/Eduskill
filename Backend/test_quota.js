const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'config/.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const candidates = [
    "gemini-2.0-flash-exp",
    "gemini-2.0-flash-lite-preview-02-05",
    "gemini-flash-latest",
    "gemini-1.5-flash"
];

async function findWorkingModel() {
    console.log("Testing models for quota access...");

    for (const modelName of candidates) {
        process.stdout.write(`Trying ${modelName}... `);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Test");
            console.log("✅ SUCCESS!");
            console.log(`\n>>> RECOMMENDATION: Use '${modelName}'`);
            return;
        } catch (error) {
            if (error.status === 429) {
                console.log("❌ QUOTA EXCEEDED (Limit 0)");
            } else if (error.status === 404) {
                console.log("❌ NOT FOUND");
            } else {
                console.log(`❌ ERROR: ${error.message.split('[')[0]}`);
            }
        }
    }
    console.log("\nNo working models found in candidates list.");
}

findWorkingModel();
