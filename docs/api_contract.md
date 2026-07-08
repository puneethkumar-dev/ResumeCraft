This is exactly what a backend lead should do. If you define the contracts **now**, your team can work independently without waiting for each other.

I recommend **freezing these contracts** and **not changing them** unless absolutely necessary.

---

# 📄 ResumeCraft v1 API Contract (Freeze This)

## Base URL

```text
http://localhost:5000/api
```

---

# Standard Response Format

## Success

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

---

## Error

```json
{
  "success": false,
  "message": "Error message"
}
```

Never return random response structures.

---

# Authentication

## Register

### POST

```text
/api/auth/register
```

Request

```json
{
  "name": "Puneeth Kumar",
  "email": "puneeth@gmail.com",
  "password": "Password@123"
}
```

Response

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "JWT_TOKEN",
    "user": {
      "_id": "...",
      "name": "Puneeth Kumar",
      "email": "puneeth@gmail.com"
    }
  }
}
```

---

## Login

### POST

```text
/api/auth/login
```

Request

```json
{
  "email": "puneeth@gmail.com",
  "password": "Password@123"
}
```

Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "JWT_TOKEN",
    "user": {
      "_id": "...",
      "name": "Puneeth Kumar",
      "email": "puneeth@gmail.com"
    }
  }
}
```

---

## Get Current User

### GET

```text
/api/auth/profile
```

Header

```text
Authorization: Bearer JWT_TOKEN
```

---

# Resume APIs

## Create Resume

### POST

```text
/api/resumes
```

Request

```json
{
  "personalInfo": {
    "fullName": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "github": "",
    "portfolio": ""
  },
  "summary": "",
  "education": [],
  "experience": [],
  "projects": [],
  "skills": [],
  "certifications": [],
  "achievements": []
}
```

Response

```json
{
  "success": true,
  "message": "Resume created successfully",
  "data": {
    "_id": "resumeId"
  }
}
```

---

## Get All Resumes

```text
GET /api/resumes
```

---

## Get Resume

```text
GET /api/resumes/:id
```

---

## Update Resume

```text
PUT /api/resumes/:id
```

---

## Delete Resume

```text
DELETE /api/resumes/:id
```

---

# AI APIs

## Generate Resume

```text
POST /api/ai/generate
```

Request

```json
{
  "resumeId": "..."
}
```

Response

```json
{
  "success": true,
  "message": "Resume generated",
  "data": {
    "resume": {}
  }
}
```

---

## Tailor Resume

```text
POST /api/ai/tailor
```

Request

```json
{
  "resumeId": "...",
  "jobDescription": "..."
}
```

---

## ATS Analysis

```text
POST /api/ai/ats-score
```

Request

```json
{
  "resumeId": "...",
  "jobDescription": "..."
}
```

Response

```json
{
  "success": true,
  "message": "ATS analysis complete",
  "data": {
    "score": 86,
    "missingKeywords": [],
    "suggestions": []
  }
}
```

---

# PDF

## Download

```text
GET /api/pdf/:resumeId
```

Downloads PDF.

---

# MongoDB Schema

## User

```javascript
{
    _id,

    name,

    email,

    password,

    role,

    createdAt,

    updatedAt
}
```

---

## Resume

```javascript
{
    _id,

    user,

    personalInfo,

    summary,

    education,

    experience,

    projects,

    skills,

    certifications,

    achievements,

    generatedResume,

    createdAt,

    updatedAt
}
```

---

# Frontend Routes

Freeze these too.

```text
/

login

register

dashboard

resume-builder

resume-preview

templates

settings
```

---

# AI JSON Structure

Tell T2 to always return

```json
{
  "summary": "...",
  "experience": [],
  "projects": [],
  "skills": [],
  "atsKeywords": []
}
```

Never plain text.

---

# Resume JSON

This is what every module should use.

```json
{
  "personalInfo": {
    "fullName": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "github": "",
    "portfolio": ""
  },
  "summary": "",
  "education": [],
  "experience": [],
  "projects": [],
  "skills": [],
  "certifications": [],
  "achievements": []
}
```

---

# Status Codes

Freeze these.

```text
200 OK

201 Created

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

500 Internal Server Error
```

---

# Folder Responsibilities

### You(Puneeth)

Backend

* Authentication
* Resume APIs
* Database
* JWT
* Middleware

---

### T1(Renuka)

Frontend

* UI
* Forms
* Dashboard
* API Consumption

---

### T2(Varshini)

AI

* Gemini
* Prompt Engineering
* Resume Generation
* ATS

---

### T3(Supraja)

Documents

* Resume Template
* PDF
* DOCX
* Preview

---

# Communication Rules

1. Don't rename API endpoints after the frontend starts integrating.
2. Don't change response formats without informing everyone.
3. Keep request body keys consistent.
4. Use meaningful commit messages.
5. Merge only tested code into `main`.