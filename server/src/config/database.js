const mongoose = require('mongoose');

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * If connection fails, logs the error and terminates the process.
 */
const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error('Database connection error: MONGO_URI environment variable is not defined.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
