# AI Mock Interview Platform

AI Mock Interview Platform is a full-stack web application that helps users
practice technical and behavioral interviews with AI-powered questions,
automated evaluation, scoring, and personalized feedback.

## Features

- User registration and login
- JWT-based authentication
- Secure password hashing using bcrypt
- Protected API routes
- MongoDB Atlas database
- Mock interview sessions
- AI-generated interview questions
- AI-based answer evaluation
- Interview scoring and feedback
- Interview history
- Performance tracking
- Personalized interview preparation

## Tech Stack

### Frontend

- React.js
- JavaScript
- HTML5
- CSS3

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt.js

### Development Tools

- VS Code
- Git
- GitHub
- Postman

## Project Structure

```text
AI-Mock-Interview/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   └── authController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   └── User.js
│   │
│   ├── routes/
│   │   └── authRoutes.js
│   │
│   ├── utils/
│   │   └── generateToken.js
│   │
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│
└── README.md
