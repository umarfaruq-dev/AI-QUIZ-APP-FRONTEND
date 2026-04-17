import { useEffect, useState } from "react";

export default function StatsModal({ onClose }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setData({ guest: true });
        return;
      }

      try {
        const res = await fetch("http://localhost:8000/api/stats", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error(err);
        setData({ guest: true });
      }
    };

    fetchStats();
  }, []);

  if (!data) return <div className="modal">Loading...</div>;

  // 🧠 CALCULATIONS
  let totalQuizzes = 0;
  let totalCorrect = 0;
  let totalWrong = 0;
  let accuracy = 0;

  if (!data.guest && data.history) {
    totalQuizzes = data.history.length;

    totalCorrect = data.history.reduce(
      (sum, h) => sum + (h.marks || 0),
      0
    );

    totalWrong = totalQuizzes * 5 - totalCorrect; // assuming 5 Qs

    accuracy =
      totalQuizzes > 0
        ? ((totalCorrect / (totalQuizzes * 5)) * 100).toFixed(1)
        : 0;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">

        <h2> Stats</h2>

        {data.guest ? (
          <p>Please login to view stats</p>
        ) : (
          <>
            {/* 📈 SUMMARY */}
            <div className="stats-summary">
              <div className="stat-box">
                <span>Total Marks</span>
                <strong>{totalQuizzes * 5}</strong>
              </div>

              <div className="stat-box correct">
                <span>Correct</span>
                <strong>{totalCorrect}</strong>
              </div>

              <div className="stat-box wrong">
                <span>Wrong</span>
                <strong>{totalWrong}</strong>
              </div>

              <div className="stat-box accuracy">
                <span>Accuracy</span>
                <strong>{accuracy}%</strong>
              </div>
            </div>

            <hr />

            {/* 📜 HISTORY */}
            {data.history.length === 0 ? (
              <p>No quizzes yet</p>
            ) : (
              data.history.map((h, i) => (
                <div key={i} className="stat-card">
                  <div>Marks: {h.marks}/5</div>
                  <div>
                    {new Date(h.time).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </>
        )}

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}