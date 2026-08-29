import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import InterviewSetup from "./pages/InterviewSetup";
import Login from "./pages/Login";
import Interview from "./pages/Interview";
import Results from "./pages/Results";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <Link to="/" className="logo">
            AI-Mock-Interview
          </Link>

          <Link to="/login" className="login-btn">
            Login
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/interview/setup" element={<InterviewSetup />} />

          <Route path="/interview/:id" element={<Interview />} />

          <Route path="/interview/:id/results" element={<Results />} />

          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
