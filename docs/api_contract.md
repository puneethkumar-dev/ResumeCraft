# ResumeCraft API Contract Specification

This document details the REST API endpoints, request/response payloads, authentication mechanisms, validation structures, and expected status codes for the ResumeCraft backend.

---

## Base URL
```text
http://localhost:5000/api
```

---

## Global Headers

For all protected routes, the client must include the JWT token in the `Authorization` header:
```text
Authorization: Bearer <JWT_TOKEN>
```

---

## Response Formats

### Standard Success Response
All successful operations return status codes `200 OK` or `201 Created` with the following wrapper:
```json
{
  "success": true,
  "message": "Human-readable description of success",
  "data": {}
}
```

### Standard Failure Response
Failed operations return status codes `400`, `401`, `403`, `404`, `500`, `504` with the following wrapper:
```json
{
  "success": false,
  "message": "Human-readable description of the error"
}
```

---

## 1. Authentication Module

### Register User
* **Endpoint**: `POST /api/auth/register`
* **Access**: Public
* **Rate Limit**: Max 10 requests per 15 mins per IP.
* **Request Payload**:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123"
}
```
* **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "JWT_STRING",
    "user": {
      "_id": "6a4e1d4a5d461e4a645ab60a",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "user"
    }
  }
}
```

---

### Login User
* **Endpoint**: `POST /api/auth/login`
* **Access**: Public
* **Rate Limit**: Max 10 requests per 15 mins per IP.
* **Request Payload**:
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123"
}
```
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "JWT_STRING",
    "user": {
      "_id": "6a4e1d4a5d461e4a645ab60a",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "user"
    }
  }
}
```

---

### Get User Profile
* **Endpoint**: `GET /api/auth/profile`
* **Access**: Private (Protected)
* **Headers**: `Authorization: Bearer <TOKEN>`
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "_id": "6a4e1d4a5d461e4a645ab60a",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "user"
    }
  }
}
```

---

## 2. Resume CRUD Module

All Resume endpoints are protected and rate-limited to **100 requests per 15 minutes per IP**.

### Create Resume
* **Endpoint**: `POST /api/resumes`
* **Access**: Private
* **Request Payload**:
```json
{
  "personalInfo": {
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "location": "San Francisco, CA",
    "linkedin": "https://linkedin.com/in/johndoe",
    "github": "https://github.com/johndoe",
    "portfolio": "https://johndoe.dev"
  },
  "summary": "Full Stack developer with 5+ years experience",
  "education": [
    {
      "institution": "Stanford University",
      "degree": "B.S.",
      "fieldOfStudy": "Computer Science",
      "startDate": "2018-09",
      "endDate": "2022-06",
      "cgpa": "3.9/4.0",
      "description": "Graduated with honors"
    }
  ],
  "experience": [
    {
      "company": "Google",
      "role": "Software Engineer",
      "location": "Mountain View, CA",
      "startDate": "2022-07",
      "endDate": "Present",
      "currentlyWorking": true,
      "description": "Led frontend search enhancements."
    }
  ],
  "projects": [
    {
      "title": "Search Optimizations",
      "technologies": ["React", "Go", "Kubernetes"],
      "github": "https://github.com/johndoe/search-opt",
      "liveDemo": "https://search.johndoe.dev",
      "description": "Decreased latency by 15%."
    }
  ],
  "skills": [
    {
      "category": "Programming Languages",
      "items": ["JavaScript", "Go", "Python"]
    }
  ],
  "certifications": [
    {
      "title": "AWS Architect",
      "issuer": "Amazon Web Services",
      "issueDate": "2024-05",
      "credentialId": "AWS-ARCH-999"
    }
  ],
  "achievements": [
    {
      "title": "Engineering Award",
      "description": "Won Q3 Spot award for search performance improvement."
    }
  ]
}
```
* **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "Resume created successfully",
  "data": {
    "_id": "6a4e1d4a5d461e4a645ab610"
  }
}
```

---

### Get All Resumes (Owner Only)
* **Endpoint**: `GET /api/resumes`
* **Access**: Private
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Resumes retrieved successfully",
  "data": [
    {
      "_id": "6a4e1d4a5d461e4a645ab610",
      "user": "6a4e1d4a5d461e4a645ab60a",
      "personalInfo": {
        "fullName": "John Doe",
        "email": "john.doe@example.com"
      },
      "summary": "...",
      "education": [],
      "experience": [],
      "projects": [],
      "skills": [],
      "certifications": [],
      "achievements": [],
      "generatedContent": {
        "summary": "",
        "experience": [],
        "projects": [],
        "metadata": {}
      },
      "atsScore": 0,
      "createdAt": "2026-07-08T10:00:00Z",
      "updatedAt": "2026-07-08T10:00:00Z"
    }
  ]
}
```

---

### Get Single Resume (Owner Only)
* **Endpoint**: `GET /api/resumes/:id`
* **Access**: Private
* **Success Response (200 OK)**: Returns the complete resume object shown in the list response inside the `data` wrapper.

---

### Update Resume (Owner Only)
* **Endpoint**: `PUT /api/resumes/:id`
* **Access**: Private
* **Request Payload**: (Supports complete payload matching creation schema format).
* **Success Response (200 OK)**: Returns the updated resume object in the `data` wrapper.

---

### Delete Resume (Owner Only)
* **Endpoint**: `DELETE /api/resumes/:id`
* **Access**: Private
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Resume deleted successfully",
  "data": {}
}
```

---

## 3. AI Resume Generation Module

### Generate ATS Optimizations
* **Endpoint**: `POST /api/ai/generate`
* **Access**: Private
* **Rate Limit**: Max 5 requests per minute per authenticated user (or IP).
* **Request Payload**:
```json
{
  "resumeId": "6a4e1d4a5d461e4a645ab610"
}
```
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Resume generated successfully",
  "data": {
    "resumeId": "6a4e1d4a5d461e4a645ab610",
    "generatedContent": {
      "summary": "Optimized ATS-friendly summary...",
      "experience": [
        "Led search query optimization projects resulting in a 15% latency reduction.",
        "Engineered scalable microservices utilizing Go and Kubernetes."
      ],
      "projects": [
        "Designed and published high-performance Search Optimization engines decreasing overall search page load times."
      ],
      "metadata": {
        "provider": "gemini",
        "generatedAt": "2026-07-08T10:00:02.788Z",
        "version": "1.0"
      }
    }
  }
}
```

---

## 4. Expected Status Codes

| Code | Status | Description / Cause |
| :--- | :--- | :--- |
| **200** | OK | Retrieve, Update, and Delete actions completed successfully. |
| **201** | Created | User or Resume resource created successfully. |
| **400** | Bad Request | Parameter validation error (e.g. missing fields, invalid email format, invalid ObjectId format). |
| **401** | Unauthorized | Invalid token, expired token, or token not supplied. |
| **403** | Forbidden | Ownership validation check failed (attempting to access another user's resume). |
| **404** | Not Found | Requested resource (User or Resume) does not exist. |
| **429** | Too Many Requests | Rate limit limit exceeded. |
| **500** | Internal Server Error | Generic internal database or library operational exceptions. |
| **504** | Gateway Timeout | AI engine request to Gemini timed out (> 30 seconds). |