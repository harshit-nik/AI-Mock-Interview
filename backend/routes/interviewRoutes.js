import express from "express";

import {
    createInterview,
    getUserInterviews,
    getInterviewById,
} from "../controllers/interviewController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new interview
router.post("/", authMiddleware, createInterview);

// Get all interviews of logged-in user
router.get("/", authMiddleware, getUserInterviews);

// Get a single interview
router.get("/:id", authMiddleware, getInterviewById);

export default router;