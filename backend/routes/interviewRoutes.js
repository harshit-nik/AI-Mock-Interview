import express from "express";
import {
  createInterview,
  generateQuestions,
  getUserInterviews,
  getInterviewById,
  submitAnswer,
  completeInterview,
} from "../controllers/interviewController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new interview
router.post("/", authMiddleware, createInterview);

// Generate AI interview questions
router.post("/generate-questions", authMiddleware, generateQuestions);

// Get all interviews of logged-in user
router.get("/", authMiddleware, getUserInterviews);

// Get a single interview
router.get("/:id", authMiddleware, getInterviewById);
router.post("/submit-answer", authMiddleware, submitAnswer);

router.post("/complete", authMiddleware, completeInterview);
export default router;
