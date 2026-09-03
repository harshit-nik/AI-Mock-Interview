import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import API_URL from "../api";

function Results() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login first.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_URL}/api/interviews/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setInterview(response.data.interview);
      } catch (error) {
        console.error("Fetch Results Error:", error);

        setError(
          error.response?.data?.message || "Failed to load interview results.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading results...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!interview) {
    return null;
  }

  const totalQuestions = interview.questions.length;

  const answeredQuestions = interview.questions.filter(
    (question) => question.answer && question.answer.trim() !== "",
  );

  const totalScore = interview.totalScore || 0;

  const averageScore =
    totalQuestions > 0 ? (totalScore / totalQuestions).toFixed(1) : "0.0";

  const scorePercentage = (Number(averageScore) / 10) * 100;

  const getScoreClass = (score) => {
    if (score >= 8) return "excellent";
    if (score >= 5) return "average";
    return "poor";
  };

  return (
    <main className="results-page">
      <div className="results-container">
        {/* Header */}
        <div className="results-header">
          <span className="results-label">INTERVIEW COMPLETED</span>

          <h1>Interview Results</h1>

          <p>
            {interview.jobRole} · {interview.experience} ·{" "}
            {interview.difficulty}
          </p>
        </div>

        {/* Overall Score */}
        <div className="score-card">
          <div className="score-card-left">
            <span className="score-title">Overall Score</span>

            <h2>
              {averageScore}
              <small>/10</small>
            </h2>

            <p>
              {answeredQuestions.length} / {totalQuestions} questions answered
            </p>
          </div>

          <div className="score-circle">
            <div
              className="score-circle-progress"
              style={{
                "--score": `${scorePercentage}%`,
              }}
            >
              <span>{Math.round(scorePercentage)}%</span>
            </div>
          </div>
        </div>
        {/* Overall AI Feedback */}
        {interview.overallFeedback && (
          <section className="overall-feedback">
            <div className="section-heading">
              <h2>Overall AI Feedback</h2>
            </div>

            <div className="overall-feedback-card">
              <p>{interview.overallFeedback}</p>
            </div>
          </section>
        )}

        {/* Question Performance */}
        <section className="question-results">
          <div className="section-heading">
            <h2>Question-wise Performance</h2>
            <span>
              {answeredQuestions.length}/{totalQuestions} Completed
            </span>
          </div>

          {interview.questions.map((question, index) => {
            const score = question.score || 0;

            return (
              <div className="result-question-card" key={question._id}>
                <div className="question-card-top">
                  <span className="question-number">Question {index + 1}</span>

                  <span className={`result-score ${getScoreClass(score)}`}>
                    {score}/10
                  </span>
                </div>

                <h3>{question.question}</h3>

                {question.answer && (
                  <div className="candidate-answer">
                    <span>Your Answer</span>
                    <p>{question.answer}</p>
                  </div>
                )}

                {question.feedback && (
                  <div className="ai-feedback">
                    <span>AI Feedback</span>
                    <p>{question.feedback}</p>
                  </div>
                )}
              </div>
            );
          })}
        </section>

        {/* Bottom Button */}
        <div className="results-actions">
          <button className="back-home-btn" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>
    </main>
  );
}

export default Results;
