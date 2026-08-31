import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Home";
import InterviewSetup from "./pages/InterviewSetup";
import Login from "./pages/Login";
import Interview from "./pages/Interview";
import Results from "./pages/Results";
import InterviewHistory from "./pages/InterviewHistory";

import "./App.css";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <Link to="/" className="logo">
            AI-Mock-Interview
          </Link>

          <div className="nav-links">
            {isLoggedIn ? (
              <>
                <Link to="/interviews" className="nav-link">
                  My Interviews
                </Link>

                <Link to="/interview/setup" className="nav-start-btn">
                  Start Interview
                </Link>

                <button
                  onClick={handleLogout}
                  className="login-btn"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="login-btn">
                Login
              </Link>
            )}
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/interviews"
            element={
              <ProtectedRoute>
                <InterviewHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/interview/setup"
            element={
              <ProtectedRoute>
                <InterviewSetup />
              </ProtectedRoute>
            }
          />

          <Route
            path="/interview/:id"
            element={
              <ProtectedRoute>
                <Interview />
              </ProtectedRoute>
            }
          />

          <Route
            path="/interview/:id/results"
            element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;