# ResumeCraft Backend Server

This is the production-ready Node.js, Express, and MongoDB backend application framework for **ResumeCraft**. It provides a robust, scalable architecture with centralized error handling, security middleware, and a structured modular design.

## Features Configured

- **Web Framework**: [Express.js](https://expressjs.com/)
- **Security**: [Helmet](https://helmetjs.github.io/) (HTTP security headers) & [CORS](https://github.com/expressjs/cors) (Cross-Origin Resource Sharing)
- **Database**: [Mongoose](https://mongoosejs.com/) (MongoDB ODM) with robust error handling and auto-reconnection configuration
- **Middleware**: [Cookie-Parser](https://github.com/expressjs/cookie-parser) for parsing cookies & [Morgan](https://github.com/expressjs/morgan) for request logging
- **Centralized Error Handling**: Global catch-all handler that normalizes database validation/cast errors and structures responses (hiding stack traces in production)
- **Environment Management**: [dotenv](https://github.com/motdotla/dotenv) configuration mapping

---

## Directory Structure

```text
server/
│
├── src/
│   ├── config/
│   │      database.js       # MongoDB connection configuration
│   │
│   ├── controllers/         # Request handling logic (controllers)
│   │
│   ├── middleware/
│   │      errorHandler.js   # Centralized global error handling middleware
│   │      notFound.js       # 404 Route handler middleware
│   │
│   ├── models/              # Mongoose schemas (User, Resume, etc.)
│   │
│   ├── routes/
│   │      index.js          # Main API endpoints (mounted under /api)
│   │
│   ├── services/            # Business & integration services
│   │      ai/               # AI optimization integration
│   │      ats/              # ATS scanning algorithm
│   │      pdf/              # PDF creation/export templates
│   │
│   ├── validators/          # Validation schemas
│   │
│   ├── utils/               # Common helper utilities
│   │
│   ├── constants/           # Application-wide constants
│   │
│   ├── prompts/             # System prompts for LLM integrations
│   │
│   └── app.js               # Express application initialization & middleware setup
│
├── server.js                # Server entry point (starts listening and handles process exceptions)
├── .env.example             # Template for environmental variables
├── package.json             # NPM dependencies & script definition
└── README.md                # Server-specific documentation
```

---

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18+) and [MongoDB](https://www.mongodb.com/) running on your system.

### Installation

1. Navigate to the server folder:
   ```bash
   cd server
   ```

2. Copy the example environment file and configure variables:
   ```bash
   cp .env.example .env
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

- **Development Mode** (auto-restart with Nodemon):
  ```bash
  npm run dev
  ```

- **Production Mode**:
  ```bash
  npm start
  ```

---

## Base API Routes

The API is served at `/api`.

- **Root Health Check**:
  - `GET /api`
  - Response:
    ```json
    {
      "success": true,
      "message": "ResumeCraft API Running"
    }
    ```
