import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const BASE_URL = "https://ai-quiz-app-quwj.onrender.com/api/auth";

export default function AuthPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);


  const handleSendOTP = async () => {
    if (!email) {
      alert("Entering email is required for log in");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email })
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Failed to send OTP ! Enter a valid email");
        return;
      }

      alert("OTP sent");
      setStep("otp");

    } catch {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      alert("Enter OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, otp })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Invalid OTP");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);
      localStorage.setItem("name", data.name);

      navigate("/home");

    } catch {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>AI Quiz App</h1>

      {step === "email" ? (
        <>
          <input
            placeholder="Name (Optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button onClick={handleSendOTP}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </>
      ) : (
        <>
          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button onClick={handleVerifyOTP}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}

      <br /><br />

      <button
        onClick={() => {
          // 🔥 CLEAR ALL USER DATA
          localStorage.removeItem("token");
          localStorage.removeItem("email");
          localStorage.removeItem("name");

          navigate("/home");
        }}
      >
        Continue as Guest
      </button>
    </div>
  );
}
