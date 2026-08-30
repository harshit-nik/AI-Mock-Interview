import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function InterviewHistory() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          "http://localhost:5000/api/interviews",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setInterviews(response.data.interviews);
      } catch (error) {
        console.error("Fetch Interviews Error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load interview history."
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
          <h1>My Interviews</h1>

          <Link to="/interview/setup" className="start-btn">
            Start New Interview
          </Link>
        </div>

        {interviews.length === 0 ? (
          <div className="empty-history">
            <h2>No interviews yet</h2>
            <p>Start your first AI mock interview.</p>

            <Link to="/interview/setup" className="start-btn">
              Start Interview
            </Link>
          </div>
        ) : (
          <div className="interview-history-list">
            {interviews.map((interview) => {
              const totalQuestions = interview.questions.length;

              const answeredQuestions = interview.questions.filter(
                (question) =>
                  question.answer &&
                  question.answer.trim() !== ""
              ).length;

              const averageScore =
                totalQuestions > 0
                  ? (
                      (interview.totalScore || 0) /
                      totalQuestions
                    ).toFixed(1)
                  : "0.0";

              return (
                <div
                  className="history-card"
                  key={interview._id}
                >
                  <div>
                    <h2>{interview.jobRole}</h2>

                    <p>
                      {interview.experience} ·{" "}
                      {interview.difficulty}
                    </p>

                    <span>
                      {answeredQuestions}/{totalQuestions} answered
                    </span>
                  </div>

                  <div className="history-score">
                    <strong>{averageScore}/10</strong>

                    <span>{interview.status}</span>
                  </div>

                  {interview.status === "completed" ? (
                    <Link
                      to={`/interview/${interview._id}/results`}
                      className="view-results-btn"
                    >
                      View Results
                    </Link>
                  ) : (
                    <Link
                      to={`/interview/${interview._id}`}
                      className="view-results-btn"
                    >
                      Continue
                    </Link>
                  )}
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