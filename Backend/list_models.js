const { exec } = require('child_process');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'config/.env') });

const cmd = `curl "https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}"`;

exec(cmd, (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    try {
        const data = JSON.parse(stdout);
        if (data.models) {
            console.log("AVAILABLE MODELS:");
            data.models.forEach(m => console.log(m.name));
        } else {
            console.log("No models found in response:", data);
        }
    } catch (e) {
        console.log("Error parsing JSON:", e);
        console.log("Raw output:", stdout.substring(0, 500));
    }
});
