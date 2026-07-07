# ResumeCraft

ResumeCraft is a production-ready, feature-rich MERN stack application designed to help job seekers build, optimize, and parse professional resumes. It integrates modern frontend layouts with a robust backend service architecture to provide AI-powered resume enhancement, Applicant Tracking System (ATS) optimization scoring, PDF generation, and resume parsing.

---

## Tech Stack

### Frontend (Client)
- **Framework:** React.js (initialized with Vite)
- **Styling:** Tailwind CSS v4 (native Vite integration)
- **Routing:** React Router DOM v6
- **HTTP Client:** Axios
- **Linting & Formatting:** ESLint & Prettier
- **Environment Management:** Vite `.env` support

### Backend (Server)
- **Runtime Environment:** Node.js
- **Web Framework:** Express.js
- **Database:** MongoDB (via Mongoose ODM)
- **Security & Utilities:** Helmet, CORS, Morgan, Cookie-Parser, Multer (file uploads)
- **Authentication & Cryptography:** JSON Web Tokens (JWT), Bcrypt.js
- **Validation:** Express-Validator
- **Development Tooling:** Nodemon

---

## Folder Structure

```
resume-craft/
├── client/                 # React frontend
│   ├── src/
│   │   ├── assets/         # Images, fonts, and global icons
│   │   ├── components/     # Reusable UI components
│   │   │   ├── common/     # Buttons, inputs, loaders
│   │   │   ├── forms/      # Input forms and validation UI
│   │   │   ├── layout/     # Header, Footer, Sidebar, Layout wrappers
│   │   │   ├── resume/     # Resume builder specific widgets
│   │   │   └── ui/         # Modern cards, modals, dropdowns
│   │   ├── pages/          # Page views / Router targets
│   │   │   ├── Home/
│   │   │   ├── Login/
│   │   │   ├── Register/
│   │   │   ├── Dashboard/
│   │   │   ├── ResumeBuilder/
│   │   │   ├── ResumePreview/
│   │   │   └── NotFound/
│   │   ├── services/       # API call wrappers (Axios client)
│   │   ├── hooks/          # Custom React hooks (auth, local storage)
│   │   ├── context/        # Global React Contexts (auth, resume data)
│   │   ├── utils/          # Helper functions and formatters
│   │   ├── constants/      # App constants and static data
│   │   ├── styles/         # Global styles (Tailwind imports)
│   │   ├── routes/         # Router configuration and guards
│   │   ├── App.jsx         # App router wrapper
│   │   └── main.jsx        # Entry point
│   ├── .env.example
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                 # Express backend
│   ├── config/             # DB and external service configurations
│   ├── controllers/        # Route handler functions
│   ├── middleware/         # Auth, validation, and error middlewares
│   ├── models/             # Mongoose schemas (User, Resume, Template)
│   ├── routes/             # API route definitions
│   ├── services/           # External service integration logic
│   │   ├── ai/             # AI optimization services
│   │   ├── ats/            # ATS feedback algorithm services
│   │   ├── pdf/            # PDF generation & rendering engines
│   │   └── parser/         # Resume parsing services (PDF/Docx extractors)
│   ├── utils/              # Helper utilities and custom exceptions
│   ├── uploads/            # Temporary file storage (ignored by git)
│   ├── validators/         # Input request validation schemas
│   ├── app.js              # Express app definition & middleware setup
│   ├── server.js           # Server runner & DB initializer
│   ├── .env.example
│   └── package.json
│
├── .gitignore              # Workspace-wide git ignore rules
└── README.md               # Main project documentation
```

---

## Installation & Setup

### Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (v18+ recommended)
- **npm** (v9+ recommended)
- **MongoDB** (local installation or MongoDB Atlas cluster connection string)

### Steps

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd resume-craft
   ```

2. **Frontend Setup:**
   ```bash
   cd client
   npm install
   ```

3. **Backend Setup:**
   ```bash
   cd ../server
   npm install
   ```

---

## Run Commands

### Development Mode

Run the frontend and backend servers concurrently or in separate terminals:

- **Frontend:**
  ```bash
  cd client
  npm run dev
  ```
  *Runs the frontend on [http://localhost:5173](http://localhost:5173)*

- **Backend:**
  ```bash
  cd server
  npm run dev
  ```
  *Runs the backend on [http://localhost:5000](http://localhost:5000)*

### Production Mode

- **Frontend Build:**
  ```bash
  cd client
  npm run build
  ```
- **Backend Start:**
  ```bash
  cd server
  npm start
  ```

---

## Future Features
- **AI Bullet Point Enhancer:** Automatically rewrites weak resume descriptions using custom AI models.
- **ATS Keyword Optimizer:** Cross-references resume with job descriptions to score compatibility and flag missing keywords.
- **Interactive Builder:** Real-time PDF rendering drag-and-drop resume section builder.
- **Multi-template Export:** Choose from multiple designed PDF layouts and export high-quality resumes instantly.
