import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import AnalysisPage from "./pages/AnalysisPage";

function ProtectedQuiz({ children }) {
  const location = useLocation();

  if (!location.state && !sessionStorage.getItem("quizData")) {
    return <Navigate to="/home" />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />

        <Route
          path="/quiz"
          element={
            <ProtectedQuiz>
              <QuizPage />
            </ProtectedQuiz>
          }
        />

        <Route path="/result" element={<ResultPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;