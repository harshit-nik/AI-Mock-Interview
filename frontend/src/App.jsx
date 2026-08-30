import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import InterviewSetup from "./pages/InterviewSetup";
import Login from "./pages/Login";
import Interview from "./pages/Interview";
import Results from "./pages/Results";
import InterviewHistory from "./pages/InterviewHistory";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <Link to="/" className="logo">
            AI-Mock-Interview
          </Link>

          <div className="nav-links">
            <Link to="/interviews" className="history-btn">
              My Interviews
            </Link>

            <Link to="/login" className="login-btn">
              Login
            </Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/interview/setup"
            element={<InterviewSetup />}
          />

          <Route
            path="/interview/:id"
            element={<Interview />}
          />

          <Route
            path="/interview/:id/results"
            element={<Results />}
          />

          <Route
            path="/interviews"
            element={<InterviewHistory />}
          />

          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;