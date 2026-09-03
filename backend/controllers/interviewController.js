import Interview from "../models/Interview.js";
import {
  generateInterviewQuestions,
  evaluateInterviewAnswer,
  generateOverallFeedback,
} from "../services/geminiService.js";

export const createInterview = async (req, res) => {
  try {
    const { jobRole, experience, difficulty } = req.body;

    const allowedDifficulties = ["Easy", "Medium", "Hard"];

    if (!jobRole?.trim() || !experience?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Job role and experience are required",
      });
    }

    if (difficulty && !allowedDifficulties.includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: "Invalid difficulty level",
      });
    }

    const interview = await Interview.create({
      user: req.user._id,
      jobRole: jobRole.trim(),
      experience: experience.trim(),
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
export const deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findOneAndDelete({
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
      message: "Interview deleted successfully",
    });
  } catch (error) {
    console.error("Delete Interview Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete interview",
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
    if (interview.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Interview is already completed",
      });
    }

    if (interview.expiresAt && new Date() >= new Date(interview.expiresAt)) {
      return res.status(400).json({
        success: false,
        message: "Interview time has expired.",
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

    // Check how many questions have been answered
    const answeredQuestions = interview.questions.filter(
      (q) => q.answer && q.answer.trim() !== "",
    );

    // If all questions are answered, complete the interview
    if (answeredQuestions.length === interview.questions.length) {
      const totalScore = interview.questions.reduce(
        (sum, q) => sum + q.score,
        0,
      );

      interview.totalScore = totalScore;
      interview.status = "completed";

      interview.overallFeedback = await generateOverallFeedback({
        jobRole: interview.jobRole,
        difficulty: interview.difficulty,
        questions: interview.questions,
        totalScore,
      });
    } else {
      interview.status = "in-progress";
    }

    await interview.save();

    res.status(200).json({
      success: true,
      message: "Answer evaluated successfully",
      evaluation: {
        score: evaluation.score,
        feedback: evaluation.feedback,
      },
      interview: {
        id: interview._id,
        status: interview.status,
        totalScore: interview.totalScore,
        overallFeedback: interview.overallFeedback,
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

export const completeInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;

    if (!interviewId) {
      return res.status(400).json({
        success: false,
        message: "Interview ID is required",
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

    if (interview.status === "completed") {
      return res.status(200).json({
        success: true,
        message: "Interview is already completed",
        interview,
      });
    }

    const now = new Date();

    const isExpired =
      interview.expiresAt && now >= new Date(interview.expiresAt);

    const allAnswered = interview.questions.every(
      (question) => question.answer && question.answer.trim() !== "",
    );

    // Before timer expires, all questions must be answered
    if (!isExpired && !allAnswered) {
      return res.status(400).json({
        success: false,
        message: "Please answer all questions first",
      });
    }

    // Unanswered questions remain at score 0
    const totalScore = interview.questions.reduce(
      (total, question) => total + (question.score || 0),
      0,
    );

    interview.totalScore = totalScore;
    interview.status = "completed";

    // Generate overall feedback if it does not already exist
    if (!interview.overallFeedback) {
      interview.overallFeedback = await generateOverallFeedback({
        jobRole: interview.jobRole,
        difficulty: interview.difficulty,
        questions: interview.questions,
        totalScore,
      });
    }

    await interview.save();

    res.status(200).json({
      success: true,
      message: isExpired
        ? "Time expired. Interview completed automatically."
        : "Interview completed successfully",
      interview,
    });
  } catch (error) {
    console.error("Complete Interview Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to complete interview",
    });
  }
};

export const startInterview = async (req, res) => {
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

    if (interview.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Interview is already completed",
      });
    }

    // If timer has already started, return existing timer
    if (interview.startedAt && interview.expiresAt) {
      return res.status(200).json({
        success: true,
        message: "Interview already started",
        startedAt: interview.startedAt,
        expiresAt: interview.expiresAt,
      });
    }

    const startedAt = new Date();

    const expiresAt = new Date(
      startedAt.getTime() + interview.durationMinutes * 60 * 1000,
    );

    interview.startedAt = startedAt;
    interview.expiresAt = expiresAt;
    interview.status = "in-progress";

    await interview.save();

    res.status(200).json({
      success: true,
      message: "Interview started successfully",
      startedAt: interview.startedAt,
      expiresAt: interview.expiresAt,
    });
  } catch (error) {
    console.error("Start Interview Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to start interview",
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const interviews = await Interview.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    const completedInterviews = interviews.filter(
      (interview) => interview.status === "completed",
    );

    const totalInterviews = interviews.length;

    const completedCount = completedInterviews.length;

    const averageScore =
      completedCount > 0
        ? completedInterviews.reduce(
            (sum, interview) => {
              const questionCount = interview.questions.length;

              if (questionCount === 0) return sum;

              return sum + interview.totalScore / questionCount;
            },
            0,
          ) / completedCount
        : 0;

    const bestScore =
      completedCount > 0
        ? Math.max(
            ...completedInterviews.map((interview) => {
              const questionCount = interview.questions.length;

              return questionCount > 0
                ? interview.totalScore / questionCount
                : 0;
            }),
          )
        : 0;

    const recentInterviews = interviews.slice(0, 5);
    const performanceTrend = completedInterviews
  .slice()
  .reverse()
  .map((interview, index) => {
    const questionCount = interview.questions.length;

    const score =
      questionCount > 0
        ? Number(
            (
              interview.totalScore / questionCount
            ).toFixed(1)
          )
        : 0;

    return {
      name: `Interview ${index + 1}`,
      score,
      date: interview.createdAt,
    };
  });

    res.status(200).json({
      success: true,
      stats: {
        totalInterviews,
        completedInterviews: completedCount,
        averageScore: Number(averageScore.toFixed(1)),
        bestScore: Number(bestScore.toFixed(1)),
      },
      recentInterviews,
      performanceTrend,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard stats",
    });
  }
};
