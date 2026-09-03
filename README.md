# AI Mock Interview Platform

An AI-powered full-stack mock interview platform that helps candidates practice technical interviews, receive AI-generated questions, get automated answer evaluation, and track their interview performance over time.

## 🚀 Live Demo

[AI Mock Interview Platform](https://ai-mock-interview-alpha-nine.vercel.app)

## ✨ Features

- User registration and login
- JWT-based authentication
- Secure password hashing using bcrypt
- Protected backend API routes
- AI-generated interview questions using Google Gemini
- Role, experience, and difficulty-based interviews
- Technical and practical interview questions
- Timed interview sessions
- Automatic interview expiry
- AI-based answer evaluation
- Individual question scoring from 0–10
- AI-generated feedback for each answer
- Overall interview feedback
- Interview completion and result tracking
- Interview history
- Dashboard with performance statistics
- Average score and best score tracking
- Performance trend visualization
- Delete previous interviews

## 🧠 How It Works

1. Create an account or log in.
2. Select the desired job role, experience level, and difficulty.
3. Start a mock interview.
4. The platform generates interview questions using Google Gemini.
5. Answer each question within the available interview time.
6. Gemini evaluates each answer based on:
   - Technical correctness
   - Relevance
   - Completeness
   - Clarity
7. Receive a score and constructive feedback.
8. Complete the interview and view the overall performance.
9. Track previous interviews and performance from the dashboard.

## 🛠️ Tech Stack

### Frontend

- React.js
- JavaScript
- React Router
- Recharts
- HTML5
- CSS3
- Vite

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt.js

### AI

- Google Gemini API
- @google/genai

### Tools & Deployment

- Git
- GitHub
- Postman
- Vercel
- Render
- MongoDB Atlas

## 🏗️ Architecture

```text
React Frontend
      |
      | REST API
      ↓
Node.js + Express Backend
      |
      ├── JWT Authentication
      ├── Interview APIs
      ├── Gemini AI Service
      |
      ↓
MongoDB Atlas
```

## 📂 Project Structure

```text
AI-Mock-Interview/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   └── interviewController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── Interview.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── interviewRoutes.js
│   │
│   ├── services/
│   │   └── geminiService.js
│   │
│   ├── utils/
│   │   └── generateToken.js
│   │
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Interview.jsx
│   │   │   ├── InterviewHistory.jsx
│   │   │   ├── InterviewSetup.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Results.jsx
│   │   │
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   │
│   ├── vercel.json
│   └── package.json
│
├── .gitignore
└── README.md
```

## 🔐 Authentication

The application uses JWT-based authentication.

- User registration and login
- Password hashing using bcrypt.js
- JWT-based authentication
- Protected API routes
- User-specific interview data

### Authentication Flow

```text
Register / Login
       ↓
Backend validates credentials
       ↓
JWT token generated
       ↓
Frontend stores token
       ↓
Protected API requests
       ↓
Backend verifies JWT
```

## 🤖 AI Integration

Google Gemini powers the core AI functionality of the platform.

### Question Generation

Interview questions are generated based on:

- Job role
- Experience level
- Difficulty

The backend requests structured JSON from Gemini and stores the generated questions in the interview session.

### Answer Evaluation

Each candidate answer is evaluated based on:

- Technical correctness
- Relevance
- Completeness
- Clarity

The AI returns a score from 0–10 along with constructive feedback.

### Overall Feedback

After the interview is completed, Gemini generates concise overall feedback based on the candidate's individual question scores and feedback.

## ⏱️ Timed Interview System

Each interview session has a defined duration.

When an interview starts, the backend records:

```text
startedAt
    ↓
durationMinutes
    ↓
expiresAt
```

The backend checks the interview expiry before accepting answers.

If the interview expires, further answer submissions are rejected and the interview can be completed with unanswered questions receiving a score of 0.

## 📊 Dashboard & Performance Tracking

The dashboard provides an overview of the candidate's interview performance.

It includes:

- Total interviews
- Completed interviews
- Average score
- Best score
- Recent interviews
- Performance trend

Performance data is calculated from completed interview sessions stored in MongoDB.

## 🔌 API Endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Interviews

```text
POST   /api/interviews
POST   /api/interviews/generate-questions
GET    /api/interviews
GET    /api/interviews/dashboard
GET    /api/interviews/:id
POST   /api/interviews/:id/start
POST   /api/interviews/submit-answer
POST   /api/interviews/complete
DELETE /api/interviews/:id
```

Protected endpoints require JWT authentication.

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/harshit-nik/AI-Mock-Interview.git
cd AI-Mock-Interview
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

### 4. Configure environment variables

Create:

```text
backend/.env
```

Add:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

### 5. Start the backend

```bash
cd backend
npm run dev
```

Backend:

```text
http://localhost:5000
```

### 6. Start the frontend

```bash
cd frontend
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## 🚀 Deployment

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |
| AI | Google Gemini API |

### Production URLs

Frontend:

https://ai-mock-interview-alpha-nine.vercel.app

Backend:

https://ai-mock-interview-backend-9eau.onrender.com

## 🔒 Security

- Passwords are hashed using bcrypt.js.
- Protected routes require JWT authentication.
- Users can access only their own interview data.
- Environment variables are excluded from Git.
- API keys and database credentials are not committed to the repository.
- CORS is configured for authorized frontend origins.

## 🔮 Future Improvements

- Voice-based mock interviews
- Resume-based interview generation
- Adaptive interview difficulty
- Skill-wise performance analytics
- Coding interview support
- AI-generated personalized improvement plans
- Interview report export
- More interview categories

## 👨‍💻 Author

**Harshit Katiyar**

GitHub: [harshit-nik](https://github.com/harshit-nik)