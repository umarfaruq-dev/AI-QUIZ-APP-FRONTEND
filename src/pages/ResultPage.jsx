import { useLocation, useNavigate } from "react-router-dom";

export default function ResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return <div>No result data</div>;
  }

  const { score, total } = state;

  return (
    <div className="container">
      <h2>Quiz Result</h2>

      <h3>Score: {score} / {total}</h3>

      {/* ✅ ALWAYS SHOW */}
      <button onClick={() => navigate("/analysis", { state })}>
        View Analysis
      </button>

      <br /><br />

      <button onClick={() => navigate("/home")}>
        Go Home
      </button>

      <br /><br />

      <button onClick={() => navigate("/home")}>
        Try Again
      </button>
    </div>
  );
}