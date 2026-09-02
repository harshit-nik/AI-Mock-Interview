import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function Interview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [answers, setAnswers] = useState({});
  const [evaluations, setEvaluations] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState({});
  const [error, setError] = useState("");

  const [timeLeft, setTimeLeft] = useState(null);
  const [startingInterview, setStartingInterview] = useState(true);
  const [timeExpired, setTimeExpired] = useState(false);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login first.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/interviews/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const interviewData = response.data.interview;

        setInterview(interviewData);

        const savedEvaluations = {};
        const savedAnswers = {};

        interviewData.questions.forEach((question) => {
          if (question.answer) {
            savedAnswers[question._id] = question.answer;
          }

          if (question.answer && question.feedback) {
            savedEvaluations[question._id] = {
              score: question.score,
              feedback: question.feedback,
            };
          }
        });

        setAnswers(savedAnswers);
        setEvaluations(savedEvaluations);

        // Start timer if it has not started yet
        if (interviewData.status !== "completed" && !interviewData.startedAt) {
          const startResponse = await axios.post(
            `http://localhost:5000/api/interviews/${id}/start`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const startedInterview = {
            ...interviewData,
            startedAt: startResponse.data.startedAt,
            expiresAt: startResponse.data.expiresAt,
            status: "in-progress",
          };

          setInterview(startedInterview);
        } else if (interviewData.expiresAt) {
          const remaining = Math.max(
            0,
            Math.floor(
              (new Date(interviewData.expiresAt).getTime() - Date.now()) / 1000,
            ),
          );

          setTimeLeft(remaining);

          if (remaining <= 0) {
            setTimeExpired(true);
          }
        }
      } catch (error) {
        console.error("Fetch Interview Error:", error);

        setError(error.response?.data?.message || "Failed to load interview.");
      } finally {
        setLoading(false);
        setStartingInterview(false);
      }
    };

    fetchInterview();
  }, [id]);

  // Countdown timer
  useEffect(() => {
    if (!interview?.expiresAt || interview.status === "completed") {
      return;
    }

    const updateTimer = () => {
      const remaining = Math.max(
        0,
        Math.floor(
          (new Date(interview.expiresAt).getTime() - Date.now()) / 1000,
        ),
      );

      setTimeLeft(remaining);

      if (remaining <= 0) {
        setTimeExpired(true);
      }
    };

    updateTimer();

    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [interview]);

  // Format timer as MM:SS
  const formatTime = (seconds) => {
    if (seconds === null) return "--:--";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  };

  // Automatically complete interview when timer expires
  useEffect(() => {
    if (!timeExpired || !interview || interview.status === "completed") {
      return;
    }

    const autoCompleteInterview = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.post(
          "http://localhost:5000/api/interviews/complete",
          {
            interviewId: id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setInterview(response.data.interview);

        alert("Time is up! Your interview has been completed.");

        navigate(`/interview/${id}/results`);
      } catch (error) {
        console.error("Auto Complete Interview Error:", error);

        alert(
          error.response?.data?.message ||
            "Time expired. Failed to complete interview.",
        );
      }
    };

    autoCompleteInterview();
  }, [timeExpired, interview, id, navigate]);

  const handleAnswerChange = (questionId, value) => {
    if (timeExpired) return;

    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleCompleteInterview = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/interviews/complete",
        {
          interviewId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setInterview(response.data.interview);

      alert("Interview completed successfully!");

      navigate(`/interview/${id}/results`);
    } catch (error) {
      console.error("Complete Interview Error:", error);

      alert(error.response?.data?.message || "Failed to complete interview.");
    }
  };

  const handleSubmitAnswer = async (questionId) => {
    if (timeExpired) {
      alert("Interview time has expired.");
      return;
    }

    const answer = answers[questionId]?.trim();

    if (!answer) {
      alert("Please write an answer first.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      setSubmitting((prev) => ({
        ...prev,
        [questionId]: true,
      }));

      const response = await axios.post(
        "http://localhost:5000/api/interviews/submit-answer",
        {
          interviewId: id,
          questionId,
          answer,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setEvaluations((prev) => ({
        ...prev,
        [questionId]: response.data.evaluation,
      }));

      setInterview((prev) => ({
        ...prev,
        questions: prev.questions.map((question) =>
          question._id === questionId
            ? {
                ...question,
                answer,
                score: response.data.evaluation.score,
                feedback: response.data.evaluation.feedback,
              }
            : question,
        ),
      }));
    } catch (error) {
      console.error("Submit Answer Error:", error);

      alert(error.response?.data?.message || "Failed to evaluate answer.");
    } finally {
      setSubmitting((prev) => ({
        ...prev,
        [questionId]: false,
      }));
    }
  };

  if (loading || startingInterview) {
    return <div className="loading">Loading interview...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!interview) {
    return null;
  }

  const allAnswered = interview.questions.every(
    (question) => question.answer && question.answer.trim() !== "",
  );

  const timerWarning = timeLeft !== null && timeLeft <= 60 && timeLeft > 0;

  return (
    <main className="interview-page">
      <div className="interview-header">
        <div>
          <h1>{interview.jobRole} Interview</h1>

          <p>
            {interview.experience} · {interview.difficulty}
          </p>
        </div>

        {interview.status !== "completed" && (
          <div
            className={`interview-timer ${
              timerWarning ? "timer-warning" : ""
            } ${timeExpired ? "timer-expired" : ""}`}
          >
            <span className="timer-label">TIME LEFT</span>

            <strong>{timeExpired ? "00:00" : formatTime(timeLeft)}</strong>

            {timerWarning && !timeExpired && <small>Hurry up!</small>}
          </div>
        )}
      </div>

      {timeExpired && (
        <div className="timer-expired-message">
          ⏰ Interview time has expired. Please complete the interview.
        </div>
      )}

      <div className="questions-container">
        {interview.questions.map((item, index) => {
          const evaluation = evaluations[item._id];

          return (
            <div className="question-card" key={item._id}>
              <span className="question-number">Question {index + 1}</span>

              <h2>{item.question}</h2>

              <textarea
                value={
                  answers[item._id] !== undefined
                    ? answers[item._id]
                    : item.answer || ""
                }
                onChange={(e) => handleAnswerChange(item._id, e.target.value)}
                placeholder="Type your answer here..."
                rows="6"
                disabled={!!evaluation || timeExpired}
              />

              {!evaluation && (
                <button
                  className="submit-answer-btn"
                  onClick={() => handleSubmitAnswer(item._id)}
                  disabled={submitting[item._id] || timeExpired}
                >
                  {submitting[item._id] ? "Evaluating..." : "Submit Answer"}
                </button>
              )}

              {evaluation && (
                <div className="evaluation">
                  <h3>Score: {evaluation.score}/10</h3>

                  <p>
                    <strong>AI Feedback:</strong> {evaluation.feedback}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {(allAnswered || timeExpired) && (
        <div className="complete-interview">
          <button className="complete-btn" onClick={handleCompleteInterview}>
            Complete Interview
          </button>
        </div>
      )}
    </main>
  );
}

export default Interview;
