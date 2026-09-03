import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../api";

function InterviewSetup() {
    const navigate = useNavigate();

    const [jobRole, setJobRole] = useState("");
    const [experience, setExperience] = useState("");
    const [difficulty, setDifficulty] = useState("Medium");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!jobRole || !experience) {
            setError("Please select job role and experience.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            // 1. Create interview
            const createResponse = await axios.post(
                `${API_URL}/api/interviews`,
                {
                    jobRole,
                    experience,
                    difficulty,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const interviewId = createResponse.data.interview._id;

            // 2. Generate AI questions
            const generateResponse = await axios.post(
                `${API_URL}/api/interviews/generate-questions`,
                {
                    interviewId,
                    jobRole,
                    experience,
                    difficulty,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Generated Questions:", generateResponse.data);

            // 3. Go to questions page
            navigate(`/interview/${interviewId}`);
        } catch (error) {
            console.error("Generate Interview Error:", error);

            setError(
                error.response?.data?.message ||
                    "Failed to generate interview."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="setup-page">
            <div className="setup-card">
                <h1>Interview Setup</h1>

                <p className="setup-subtitle">
                    Configure your interview before you begin.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Job Role</label>

                        <select
                            value={jobRole}
                            onChange={(e) => setJobRole(e.target.value)}
                        >
                            <option value="">Select Job Role</option>
                            <option value="Software Developer">
                                Software Developer
                            </option>
                            <option value="Frontend Developer">
                                Frontend Developer
                            </option>
                            <option value="Backend Developer">
                                Backend Developer
                            </option>
                            <option value="Full Stack Developer">
                                Full Stack Developer
                            </option>
                            <option value="Java Developer">
                                Java Developer
                            </option>
                            <option value="C++ Developer">
                                C++ Developer
                            </option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Experience</label>

                        <select
                            value={experience}
                            onChange={(e) =>
                                setExperience(e.target.value)
                            }
                        >
                            <option value="">
                                Select Experience
                            </option>
                            <option value="Fresher">Fresher</option>
                            <option value="1-2 Years">1-2 Years</option>
                            <option value="3-5 Years">3-5 Years</option>
                            <option value="5+ Years">5+ Years</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Difficulty</label>

                        <select
                            value={difficulty}
                            onChange={(e) =>
                                setDifficulty(e.target.value)
                            }
                        >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>

                    {error && (
                        <p className="error-message">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="generate-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "Generating..."
                            : "Generate Interview"}
                    </button>
                </form>
            </div>
        </main>
    );
}

export default InterviewSetup;