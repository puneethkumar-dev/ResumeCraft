const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const apiRouter = require('./routes/index');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Auth routes rate limiter: 10 requests per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { default: false }
});

// Resume CRUD routes rate limiter: 100 requests per 15 minutes per IP
const resumeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many resume requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { default: false }
});

// 1. Security HTTP Headers
app.use(helmet());

// 2. CORS setup (highly configurable)
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));

// 3. Custom Request Logging (Method, Route, Status, Response Time, User ID)
app.use((req, res, next) => {
  const startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const userId = req.user ? req.user._id.toString() : 'anonymous';
    console.log(`[REQUEST] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms | User: ${userId}`);
  });
  next();
});

// 4. Request Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB injection protection
app.use(mongoSanitize());

// 5. Cookie Parser
app.use(cookieParser());

// Apply rate limiters
app.use('/api/auth', authLimiter);
app.use('/api/resumes', resumeLimiter);

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
