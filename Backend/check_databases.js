const mongoose = require('mongoose');
const path = require('path');
const Course = require('./models/Course');

const dbs = [
    'mongodb://localhost:27017/vision',
    'mongodb://localhost:27017/signal-platform',
    'mongodb://localhost:27017/test',
    'mongodb://127.0.0.1:27017/vision', // Sometimes localhost resolves to IPv6 ::1
    'mongodb://127.0.0.1:27017/signal-platform'
];

async function checkDBs() {
    for (const uri of dbs) {
        try {
            console.log(`Checking: ${uri} ...`);
            await mongoose.connect(uri);
            const count = await Course.countDocuments();
            console.log(`>>> FOUND ${count} COURSES in ${uri}`);
            await mongoose.disconnect();

            if (count > 0) return; // Stop if we find them
        } catch (err) {
            console.log(`Failed to connect to ${uri}: ${err.message}`);
        }
    }
}

checkDBs();
