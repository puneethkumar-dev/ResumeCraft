const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnv = ['PORT', 'MONGO_URI', 'JWT_SECRET', 'GEMINI_API_KEY'];
const missingEnv = [];
requiredEnv.forEach((envVar) => {
  if (!process.env[envVar]) {
    missingEnv.push(envVar);
  }
});
if (missingEnv.length > 0) {
  console.error(`CRITICAL CONFIG ERROR: Missing environment variables: ${missingEnv.join(', ')}`);
  process.exit(1);
}

const app = require('./src/app');
const connectDB = require('./src/config/database');

const PORT = process.env.PORT || 5000;

/**
 * Bootstraps the application by connecting to the database
 * and starting the Express HTTP server.
 */
const startServer = async () => {
  // Connect to database
  await connectDB();

  // Start Express server
  const server = app.listen(PORT, () => {
    console.log(`Server running in [${process.env.NODE_ENV || 'development'}] mode on port ${PORT}`);
  });

  // Handle Unhandled Promise Rejections
  process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Promise Rejection: ${err.message}`);
    if (server) {
      server.close(() => {
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
};

// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

startServer();
