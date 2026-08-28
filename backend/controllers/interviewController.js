import Interview from "../models/Interview.js";
import { generateInterviewQuestions } from "../services/geminiService.js";

export const createInterview = async (req, res) => {
    try {
        const { jobRole, experience, difficulty } = req.body;

        if (!jobRole || !experience) {
            return res.status(400).json({
                success: false,
                message: "Job role and experience are required",
            });
        }

        const interview = await Interview.create({
            user: req.user._id,
            jobRole,
            experience,
            difficulty: difficulty || "Medium",
        });

        res.status(201).json({
            success: true,
            message: "Interview created successfully",
            interview,
        });
    } catch (error) {
        console.error("Create Interview Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export const generateQuestions = async (req, res) => {
    try {
        const { jobRole, experience, difficulty } = req.body;

        if (!jobRole || !experience) {
            return res.status(400).json({
                success: false,
                message: "Job role and experience are required",
            });
        }

        const questions = await generateInterviewQuestions({
            jobRole,
            experience,
            difficulty: difficulty || "Medium",
        });

        res.status(200).json({
            success: true,
            message: "Interview questions generated successfully",
            questions,
        });
    } catch (error) {
        console.error("Generate Questions Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to generate interview questions",
        });
    }
};

export const getUserInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find({
            user: req.user._id,
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: interviews.length,
            interviews,
        });
    } catch (error) {
        console.error("Get Interviews Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export const getInterviewById = async (req, res) => {
    try {
        const interview = await Interview.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: "Interview not found",
            });
        }

        res.status(200).json({
            success: true,
            interview,
        });
    } catch (error) {
        console.error("Get Interview Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};