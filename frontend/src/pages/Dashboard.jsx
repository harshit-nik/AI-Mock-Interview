import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [performanceTrend, setPerformanceTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login first.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/interviews/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setStats(response.data.stats);
        setRecentInterviews(response.data.recentInterviews || []);
        setPerformanceTrend(response.data.performanceTrend || []);
      } catch (error) {
        console.error("Dashboard Error:", error);

        setError(error.response?.data?.message || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div>
            <span className="dashboard-label">PERFORMANCE OVERVIEW</span>

            <h1>Dashboard</h1>

            <p>
              Track your interview performance and improve with every attempt.
            </p>
          </div>

          <Link to="/interview/setup" className="dashboard-start-btn">
            Start New Interview →
          </Link>
        </div>

        {/* Statistics */}
        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-title">Average Score</span>

            <div className="stat-value">
              {stats?.averageScore ?? 0}
              <small>/10</small>
            </div>

            <span className="stat-description">
              Across completed interviews
            </span>
          </div>

          <div className="stat-card">
            <span className="stat-title">Completed</span>

            <div className="stat-value">{stats?.completedInterviews ?? 0}</div>

            <span className="stat-description">Interviews completed</span>
          </div>

          <div className="stat-card">
            <span className="stat-title">Total Interviews</span>

            <div className="stat-value">{stats?.totalInterviews ?? 0}</div>

            <span className="stat-description">Practice attempts</span>
          </div>

          <div className="stat-card">
            <span className="stat-title">Best Score</span>

            <div className="stat-value">
              {stats?.bestScore ?? 0}
              <small>/10</small>
            </div>

            <span className="stat-description">Your highest performance</span>
          </div>
        </section>

        {/* Performance Trend */}
        <section className="performance-trend">
          <div className="section-heading">
            <div>
              <h2>Performance Trend</h2>

              <p>Your score across completed interviews</p>
            </div>
          </div>

          <div className="trend-card">
            {performanceTrend.length === 0 ? (
              <div className="empty-trend">
                <p>Complete an interview to see your performance trend.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={performanceTrend}
                  margin={{
                    top: 15,
                    right: 20,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#26344d" />

                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) =>
                      new Date(date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                      })
                    }
                    stroke="#64748b"
                    tick={{
                      fill: "#94a3b8",
                      fontSize: 12,
                    }}
                  />

                  <YAxis
                    domain={[0, 10]}
                    stroke="#64748b"
                    tick={{
                      fill: "#94a3b8",
                      fontSize: 12,
                    }}
                  />

                  <Tooltip
                    labelFormatter={(date) =>
                      new Date(date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    }
                    formatter={(value) => [`${value}/10`, "Score"]}
                    contentStyle={{
                      background: "#111a2b",
                      border: "1px solid #26344d",
                      borderRadius: "8px",
                      color: "#f8fafc",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        {/* Recent Interviews */}
        <section className="recent-interviews">
          <div className="section-heading">
            <div>
              <h2>Recent Interviews</h2>

              <p>Your latest practice sessions</p>
            </div>

            <Link to="/interviews" className="view-all-link">
              View All →
            </Link>
          </div>

          {recentInterviews.length === 0 ? (
            <div className="empty-dashboard">
              <h3>No interviews yet</h3>

              <p>
                Start your first AI mock interview to see your performance here.
              </p>

              <Link to="/interview/setup" className="dashboard-start-btn">
                Start Interview
              </Link>
            </div>
          ) : (
            <div className="recent-interview-list">
              {recentInterviews.map((interview) => {
                const totalQuestions = interview.questions?.length || 0;

                const averageScore =
                  totalQuestions > 0
                    ? (interview.totalScore / totalQuestions).toFixed(1)
                    : "0.0";

                const isCompleted = interview.status === "completed";

                return (
                  <div className="recent-interview-card" key={interview._id}>
                    <div className="recent-interview-info">
                      <h3>{interview.jobRole}</h3>

                      <p>
                        {interview.experience} · {interview.difficulty}
                      </p>
                    </div>

                    <div className="recent-interview-meta">
                      <span
                        className={`status-badge ${
                          isCompleted ? "completed" : "in-progress"
                        }`}
                      >
                        {isCompleted ? "Completed" : "In Progress"}
                      </span>

                      <span className="recent-score">
                        {isCompleted ? `${averageScore}/10` : "—"}
                      </span>

                      {isCompleted ? (
                        <Link
                          to={`/interview/${interview._id}/results`}
                          className="recent-action"
                        >
                          Results →
                        </Link>
                      ) : (
                        <Link
                          to={`/interview/${interview._id}`}
                          className="recent-action"
                        >
                          Continue →
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Dashboard;
