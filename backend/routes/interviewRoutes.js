import express from "express";

import {
  createInterview,
  generateQuestions,
  getUserInterviews,
  getInterviewById,
  submitAnswer,
  completeInterview,
  startInterview,
  deleteInterview,
  getDashboardStats,
} from "../controllers/interviewController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new interview
router.post("/", authMiddleware, createInterview);

// Generate AI interview questions
router.post("/generate-questions", authMiddleware, generateQuestions);

// Get all interviews of logged-in user
router.get("/", authMiddleware, getUserInterviews);

// Get dashboard statistics
router.get("/dashboard", authMiddleware, getDashboardStats);

// Get a single interview
router.get("/:id", authMiddleware, getInterviewById);

// Submit an answer
router.post("/submit-answer", authMiddleware, submitAnswer);

// Complete an interview
router.post("/complete", authMiddleware, completeInterview);

// Start an interview
router.post("/:id/start", authMiddleware, startInterview);

// Delete an interview
router.delete("/:id", authMiddleware, deleteInterview);

export default router;