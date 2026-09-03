import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API_URL from "../api";

function InterviewHistory() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleDeleteInterview = async (interviewId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this interview?",
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${API_URL}/api/interviews/${interviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setInterviews((prevInterviews) =>
        prevInterviews.filter(
          (interview) => interview._id !== interviewId,
        ),
      );
    } catch (error) {
      console.error("Delete Interview Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete interview.",
      );
    }
  };

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login first.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${API_URL}/api/interviews`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setInterviews(response.data.interviews);
      } catch (error) {
        console.error("Fetch Interviews Error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load interview history.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  if (loading) {
    return <div className="loading">Loading interviews...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <main className="history-page">
      <div className="history-container">
        <div className="history-header">
          <div>
            <span className="history-label">
              YOUR PRACTICE
            </span>

            <h1>My Interviews</h1>

            <p>
              Review your previous interviews and track your
              progress.
            </p>
          </div>

          <Link
            to="/interview/setup"
            className="start-btn"
          >
            + Start New Interview
          </Link>
        </div>

        {interviews.length === 0 ? (
          <div className="empty-history">
            <div className="empty-icon">🎯</div>

            <h2>No interviews yet</h2>

            <p>
              Start your first AI mock interview and see your
              performance here.
            </p>

            <Link
              to="/interview/setup"
              className="start-btn"
            >
              Start Your First Interview
            </Link>
          </div>
        ) : (
          <div className="interview-history-list">
            {interviews.map((interview) => {
              const totalQuestions =
                interview.questions.length;

              const answeredQuestions =
                interview.questions.filter(
                  (question) =>
                    question.answer &&
                    question.answer.trim() !== "",
                ).length;

              const averageScore =
                totalQuestions > 0
                  ? (
                      (interview.totalScore || 0) /
                      totalQuestions
                    ).toFixed(1)
                  : "0.0";

              const progress =
                totalQuestions > 0
                  ? Math.round(
                      (answeredQuestions /
                        totalQuestions) *
                        100,
                    )
                  : 0;

              const interviewDate = new Date(
                interview.createdAt,
              ).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              const isCompleted =
                interview.status === "completed";

              return (
                <div
                  className="history-card"
                  key={interview._id}
                >
                  <div className="history-card-main">
                    <div className="history-card-info">
                      <div className="history-title-row">
                        <h2>{interview.jobRole}</h2>

                        <span
                          className={`status-badge ${
                            isCompleted
                              ? "completed"
                              : "in-progress"
                          }`}
                        >
                          {isCompleted
                            ? "Completed"
                            : "In Progress"}
                        </span>
                      </div>

                      <p className="history-meta">
                        {interview.experience} ·{" "}
                        {interview.difficulty} ·{" "}
                        {interviewDate}
                      </p>

                      <div className="history-progress">
                        <div className="progress-header">
                          <span>Progress</span>

                          <span>
                            {answeredQuestions}/
                            {totalQuestions} answered
                          </span>
                        </div>

                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${progress}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="history-score">
                      <span className="score-label">
                        SCORE
                      </span>

                      <strong>
                        {isCompleted
                          ? `${averageScore}/10`
                          : "--"}
                      </strong>
                    </div>
                  </div>

                  <div className="history-card-footer">
                    <span className="question-count">
                      {totalQuestions} questions
                    </span>

                    <div className="history-card-actions">
                      {isCompleted ? (
                        <Link
                          to={`/interview/${interview._id}/results`}
                          className="view-results-btn"
                        >
                          View Results →
                        </Link>
                      ) : (
                        <Link
                          to={`/interview/${interview._id}`}
                          className="view-results-btn"
                        >
                          Continue Interview →
                        </Link>
                      )}

                      <button
                        className="delete-interview-btn"
                        onClick={() =>
                          handleDeleteInterview(
                            interview._id,
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default InterviewHistory;