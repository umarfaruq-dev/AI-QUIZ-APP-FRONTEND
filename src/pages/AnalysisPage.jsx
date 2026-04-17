import { useLocation, useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export default function AnalysisPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="container">
        <h2>No Analysis Data</h2>
        <button onClick={() => navigate("/home")}>
          Go Home
        </button>
      </div>
    );
  }

  const {
    questions,
    options,
    correctAnswers,
    userAnswers,
    timePerQuestion
  } = state;

  // ✅ Prepare bar chart data
  const timeData = timePerQuestion.map((t, i) => ({
    name: `Q${i + 1}`,
    time: Number(((t || 0) / 1000).toFixed(2)) // seconds
  }));

  // ✅ Total time
  const totalTime = timePerQuestion.reduce((a, b) => a + (b || 0), 0);

  return (
    <div className="container">
      <h2>Analysis</h2>

      {/* 🔥 TIME CHART */}
      <h3>Time Spent per Question</h3>

      <BarChart width={400} height={250} data={timeData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis label={{ value: "Seconds", angle: -90, position: "insideLeft" }} />
        <Tooltip formatter={(value) => `${value} sec`} />
        <Bar dataKey="time" />
      </BarChart>

      <p><b>Total Time:</b> {(totalTime / 1000).toFixed(2)} sec</p>

      <hr />

      {/* 🔥 QUESTION ANALYSIS */}
      {questions?.map((q, i) => {
        const isCorrect = userAnswers[i] === correctAnswers[i];

        return (
          <div key={i} style={{ marginBottom: "15px" }}>
            <p><b>Q{i + 1}:</b> {q}</p>

            <p>
              Your Answer:{" "}
              {userAnswers[i] !== undefined
                ? options[i][userAnswers[i]]
                : "Not answered"}
            </p>

            <p>
              Correct Answer: {options[i][correctAnswers[i]]}
            </p>

            <p>
              Time: {((timePerQuestion[i] || 0) / 1000).toFixed(2)} sec
            </p>

            <p style={{ color: isCorrect ? "green" : "red" }}>
              {isCorrect ? "Correct ✅" : "Wrong ❌"}
            </p>

            <hr />
          </div>
        );
      })}

      <button onClick={() => navigate("/home")}>
        Back to Home
      </button>
    </div>
  );
}