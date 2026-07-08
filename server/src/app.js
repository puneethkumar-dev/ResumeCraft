const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const apiRouter = require('./routes/index');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// 1. Security HTTP Headers
app.use(helmet());

// 2. CORS setup (highly configurable)
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));

// 3. Request Logging (verbose in dev, standard in production)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 4. Request Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. Cookie Parser
app.use(cookieParser());

// 6. Routes
app.use('/api', apiRouter);

// Root path health check redirect/response
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ResumeCraft API Running'
  });
});

// 7. Unmatched Route Handler (404)
app.use(notFound);

// 8. Centralized Global Error Handler
app.use(errorHandler);

module.exports = app;
