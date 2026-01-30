const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'config/.env') });
console.log("DEBUG: JWT_EXPIRES_IN loaded as:", process.env.JWT_EXPIRES_IN);
const app = require('./app');
const mongoose = require('mongoose');
const logger = require('./utils/logger'); // We will create this

const PORT = process.env.PORT || 5000;

// Handle Uncaught Exceptions
// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Logged error (keeping process alive for dev):');
  console.error(err);
  // process.exit(1); // Disabled for user preference
});

// Database Connection
const DB = process.env.DATABASE_URI || 'mongodb://localhost:27017/signal-platform';

const connectDB = async () => {
  try {
    await mongoose.connect(DB);
    logger.info('DB connection successful!');
  } catch (err) {
    logger.error('DB Connection Failed... Retrying in 5s:', err.message);
    setTimeout(connectDB, 5000); // Retry logic
  }
};

connectDB();

const server = app.listen(PORT, () => {
  logger.info(`App running on port ${PORT}...`);
});

// Handle Unhandled Rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Logged error:');
  logger.error(err);
  // server.close(() => { process.exit(1); }); // Disabled for user preference
});
