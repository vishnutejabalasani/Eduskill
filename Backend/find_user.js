const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config/.env' });
const User = require('./models/User');

const run = async () => {
    await mongoose.connect(process.env.DATABASE_URI);
    const user = await User.findOne({ name: 'random' });
    console.log('User found:', user ? user._id.toString() : 'NOT FOUND');
    await mongoose.disconnect();
};
run();
