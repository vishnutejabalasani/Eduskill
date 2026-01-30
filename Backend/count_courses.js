const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'config/.env') });
const Course = require('./models/Course');

const DB = process.env.DATABASE_URI || 'mongodb://localhost:27017/signal-platform';

mongoose.connect(DB).then(async () => {
    console.log('DB Connected.');
    try {
        const count = await Course.countDocuments();
        console.log(`TOTAL COURSES IN DB: ${count}`);
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
});
