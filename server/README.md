# ResumeCraft Backend Server

This is the production-ready Node.js, Express, and MongoDB backend application framework for **ResumeCraft**. It provides a robust, scalable architecture with centralized error handling, security middleware, and a structured modular design.

---

## 1. Project Architecture

The application is built using a clean, layered architectural pattern:
- **Routing Layer** (`src/routes/`): Exposes RESTful API endpoints and applies path-specific rate limits and schema validation.
- **Controller Layer** (`src/controllers/`): Slim controllers that validate request formats, delegate business logic execution, and handle error propagation.
- **Service Layer** (`src/services/`): Pure business logic layers. The AI optimization workflow is encapsulated here, completely provider-independent.
- **Data Layer** (`src/models/`): Mongoose schemas governing data structures, unique constraints, and schema indexes.
- **Middlewares** (`src/middleware/`): Includes authentication protection, centralized error formatting, route sanitization, and request rate-limiting.

---

## 2. Directory Structure

```text
server/
│
├── scratch/                 # Developer scratchpad scripts & tests
│
├── src/
│   ├── config/
│   │      database.js       # MongoDB connection bootstrapping
│   │
│   ├── controllers/         # Thin controllers mapping requests to services
│   │      authController.js
│   │      resumeController.js
│   │      aiController.js
│   │
│   ├── middleware/
│   │      auth.js           # JWT authentication protection
│   │      errorHandler.js   # Centralized global error normalizer
│   │      notFound.js       # Catch-all unmatched routes (404)
│   │
│   ├── models/              # Mongoose database models
│   │      User.js
│   │      Resume.js
│   │
│   ├── routes/              # Express routing modules
│   │      index.js          # API router index
│   │      authRoutes.js
│   │      resumeRoutes.js
│   │      aiRoutes.js
│   │
│   ├── services/            # Modulized business logic
│   │      ai/
│   │         AIService.js   # Orchestrates AI Resume generation & timeouts
│   │         providers/
│   │            GeminiProvider.js  # Google Gen AI integration
│   │            PromptBuilder.js   # ATS formatting prompts
│   │            JSONValidator.js   # Output structure check
│   │            AILogger.js        # Secure operational logging
│   │
│   ├── validators/          # Input schema validation rules
│   │      authValidator.js
│   │      resumeValidator.js
│   │
│   ├── utils/               # Common helper utilities
│   │      jwt.js            # JWT token signing & verifying
│   │
│   ├── constants/           # Application-wide constants
│   │
│   ├── prompts/             # Folder for raw system prompts
│   │
│   └── app.js               # Express application initialization & middleware setup
│
├── server.js                # Server entry point & environment validations
├── .env.example             # Configuration template
├── package.json             # NPM dependencies & startup scripts
└── README.md                # Server developer guide
```

---

## 3. Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local MongoDB instance running

### Installation

1. Navigate to the server folder:
   ```bash
   cd server
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. Install production and development dependencies:
   ```bash
   npm install
   ```

---

## 4. Environment Variables

Configure the following variables inside your `.env` file:
* `PORT`: Port server runs on (e.g. `5000`).
* `MONGO_URI`: MongoDB connection string.
* `JWT_SECRET`: Secret key used to sign and verify JSON Web Tokens.
* `GEMINI_API_KEY`: API key for Google Gemini model integration. Set to `mock_gemini_key_for_now` to enable mock response generation locally for sandbox testing.
* `NODE_ENV`: Runs application in `development` or `production` mode.

*Note: The server will strictly validate these variables on startup and terminate process execution if any required variable is missing.*

---

## 5. Running Locally

- **Development Mode** (auto-restart with Nodemon):
  ```bash
  npm run dev
  ```

- **Production Mode**:
  ```bash
  npm start
  ```

---

## 6. Testing

### Run Integration Tests
We maintain automated integration test scripts to verify routes, parameters, rate limits, and authentication checks:
```bash
# Verify Auth & Resume CRUD APIs
node scratch/test_resume_api.js

# Verify AI Generation engine & structures
node scratch/test_ai_api.js

# Verify Rate Limiters & Sanitization rules
node scratch/test_production_readiness.js
```

---

## 7. API Overview

All routes are mounted under `/api`.

### Public Routes
- `GET /api` - Root health check
- `POST /api/auth/register` - Create new user account (Max 10 reqs/15 mins)
- `POST /api/auth/login` - Authenticate user & receive JWT token (Max 10 reqs/15 mins)

### Private Protected Routes (Requires Header `Authorization: Bearer <JWT>`)
- `GET /api/auth/profile` - Fetch current user account details
- `POST /api/resumes` - Create a resume (Max 100 reqs/15 mins)
- `GET /api/resumes` - List user's resumes (Max 100 reqs/15 mins)
- `GET /api/resumes/:id` - Fetch single resume details
- `PUT /api/resumes/:id` - Edit a resume
- `DELETE /api/resumes/:id` - Delete a resume
- `POST /api/ai/generate` - Run ATS optimizations on resume (Max 5 reqs/1 min per user)

---

## 8. Deployment Instructions

1. Configure production environment variables in your hosting dashboard (e.g., Heroku, Render, AWS, GCP).
2. Set `NODE_ENV=production`.
3. Set up database indices (run Mongoose indexing or configure on MongoDB Atlas).
4. Run the production script:
   ```bash
   npm start
   ```
