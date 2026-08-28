import Interview from "../models/Interview.js";
import {
    generateInterviewQuestions,
    evaluateInterviewAnswer,
} from "../services/geminiService.js";

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
        const { interviewId, jobRole, experience, difficulty } = req.body;

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

        let interview = null;

        if (interviewId) {
            interview = await Interview.findOne({
                _id: interviewId,
                user: req.user._id,
            });

            if (!interview) {
                return res.status(404).json({
                    success: false,
                    message: "Interview not found",
                });
            }

            interview.questions = questions;
            interview.status = "in-progress";

            await interview.save();
        }

        res.status(200).json({
            success: true,
            message: "Interview questions generated successfully",
            questions,
            interview,
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

export const submitAnswer = async (req, res) => {
    try {
        const { interviewId, questionId, answer } = req.body;

        if (!interviewId || !questionId || !answer) {
            return res.status(400).json({
                success: false,
                message: "Interview ID, question ID and answer are required",
            });
        }

        const interview = await Interview.findOne({
            _id: interviewId,
            user: req.user._id,
        });

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: "Interview not found",
            });
        }

        const question = interview.questions.id(questionId);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found",
            });
        }

        const evaluation = await evaluateInterviewAnswer({
            question: question.question,
            answer,
            jobRole: interview.jobRole,
            difficulty: interview.difficulty,
        });

        question.answer = answer;
        question.score = evaluation.score;
        question.feedback = evaluation.feedback;

        await interview.save();

        res.status(200).json({
            success: true,
            message: "Answer evaluated successfully",
            evaluation: {
                score: evaluation.score,
                feedback: evaluation.feedback,
            },
            question,
        });
    } catch (error) {
        console.error("Submit Answer Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to evaluate answer",
        });
    }
};