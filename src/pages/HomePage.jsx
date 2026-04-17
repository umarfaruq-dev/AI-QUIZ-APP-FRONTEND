import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatsModal from "./StatsModal"; // ✅ import

export default function HomePage() {
  const [mode, setMode] = useState("pdf");
  const [topic, setTopic] = useState("");
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [showStats, setShowStats] = useState(false); // ✅ FIX

  const navigate = useNavigate();

  // 👤 Load user name
  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setName(storedName);
    } else {
      setName("Guest"); // ✅ fallback
    }
  }, []);

  // 🔴 Logout
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
  };

  const handleGenerate = () => {
    navigate("/quiz", {
      state: { topic, file, mode }
    });
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedTypes.includes(selected.type)) {
      alert("Only PDF, DOC, DOCX files are allowed");
      return;
    }

    setFile(selected);
  };

  return (
    <div className="container">

      {/* 👤 PROFILE */}
      <div className="profile-bar">
        <div>
          <div className="profile-sub">Welcome</div>
          <div className="profile-name">
            {name}
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="stats-btn"
            onClick={() => setShowStats(true)}
          >
             Stats
          </button>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* 📊 MODAL */}
      {showStats && (
        <StatsModal onClose={() => setShowStats(false)} />
      )}

      <h1>Generate Quiz</h1>

      {/* 🔄 Mode Switch */}
      <div className="mode-switch">
        <button
          className={mode === "pdf" ? "active" : ""}
          onClick={() => setMode("pdf")}
        >
          File Mode ⭐
        </button>

        <button
          className={mode === "topic" ? "active" : ""}
          onClick={() => setMode("topic")}
        >
          Topic Mode
        </button>
      </div>

      <br />

      {/* 🔁 Input */}
      {mode === "topic" ? (
        <input
          type="text"
          placeholder="Enter topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
      ) : (
        <>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
          />

          {file && (
            <div className="file-card">
              <div className="file-info">
                📄
                <div>
                  <div className="file-name">{file.name}</div>
                  <div className="file-size">
                    {(file.size / 1024).toFixed(1)} KB
                  </div>
                </div>
              </div>

              <button
                className="remove-btn"
                onClick={() => setFile(null)}
              >
                ❌
              </button>
            </div>
          )}
        </>
      )}

      <br /><br />

      {/* 🚀 Generate */}
      <button
        onClick={handleGenerate}
        disabled={mode === "pdf" ? !file : !topic}
        className="generate-btn"
      >
        Generate Quiz
      </button>
    </div>
  );
}