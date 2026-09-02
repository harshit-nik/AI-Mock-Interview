import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
        },

        answer: {
            type: String,
            default: "",
        },

        score: {
            type: Number,
            default: 0,
        },

        feedback: {
            type: String,
            default: "",
        },
    },
    { _id: true }
);

const interviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        jobRole: {
            type: String,
            required: true,
        },

        experience: {
            type: String,
            required: true,
        },

        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            default: "Medium",
        },

        questions: [questionSchema],

        // Interview Timer
        durationMinutes: {
            type: Number,
            default: 15,
        },

        startedAt: {
            type: Date,
            default: null,
        },

        expiresAt: {
            type: Date,
            default: null,
        },

        totalScore: {
            type: Number,
            default: 0,
        },

        overallFeedback: {
            type: String,
            default: "",
        },

        status: {
            type: String,
            enum: ["created", "in-progress", "completed"],
            default: "created",
        },
    },
    {
        timestamps: true,
    }
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;