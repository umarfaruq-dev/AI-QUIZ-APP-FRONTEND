//const BASE_URL = "http://127.0.0.1:8000/api";
const BASE_URL = "https://ai-quiz-app-quwj.onrender.com/api"

// -----------------------------
// 🔐 AUTH APIs
// -----------------------------
export async function sendOTP(name, email) {
  const res = await fetch(`${BASE_URL}/auth/send-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "OTP failed");

  return data;
}

export async function verifyOTP(email, otp) {
  const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, otp })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "OTP verify failed");

  return data;
}

// -----------------------------
// 🧠 HELPER (AUTO TOKEN)
// -----------------------------
function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}

// -----------------------------
// 🧠 QUIZ APIs
// -----------------------------
export async function generateQuiz(topic) {
  const res = await fetch(
    `${BASE_URL}/quiz/generate?topic=${encodeURIComponent(topic)}`,
    {
      headers: getAuthHeaders()
    }
  );

  if (!res.ok) throw new Error("Request failed");

  return await res.json();
}

export async function generateFromPDF(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/quiz/generate-from-pdf`, {
    method: "POST",
    body: formData,
    headers: getAuthHeaders()
  });

  if (!res.ok) throw new Error("PDF request failed");

  return await res.json();
}

// -----------------------------
// 💾 SUBMIT QUIZ
// -----------------------------
export async function submitQuiz(score) {
  const res = await fetch(
    `${BASE_URL}/quiz/submit-quiz?score=${score}`,
    {
      method: "POST",
      headers: getAuthHeaders()
    }
  );

  return await res.json();
}

// -----------------------------
// 📊 STATS
// -----------------------------
export async function getStats() {
  const res = await fetch(`${BASE_URL}/user/stats`, {
    headers: getAuthHeaders()
  });

  return await res.json();
}