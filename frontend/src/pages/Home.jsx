import { Link } from "react-router-dom";

function Home() {
    return (
        <main className="hero">
            <div className="hero-content">
                <span className="badge">
                    AI-Powered Interview Practice
                </span>

                <h1>
                    Ace Your Next
                    <br />
                    <span>Technical Interview</span>
                </h1>

                <p>
                    Practice realistic technical interviews with
                    AI-generated questions, instant evaluation,
                    scores, and personalized feedback.
                </p>

                <Link to="/interview/setup" className="start-btn">
                    Start Interview
                </Link>
            </div>
        </main>
    );
}

export default Home;