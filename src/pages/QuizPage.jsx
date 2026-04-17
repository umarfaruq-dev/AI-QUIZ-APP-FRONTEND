import { redirect, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { generateQuiz, generateFromPDF, submitQuiz } from "../services/api";

export default function QuizPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState(null);
  const [error, setError] = useState(null);

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState([]);

  const [timePerQuestion, setTimePerQuestion] = useState([]);
  const [startTime, setStartTime] = useState(Date.now());

  // 🔥 FETCH QUIZ (YOU REMOVED THIS — ADD BACK)
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        if (!state) {
          navigate("/home");
        };

        let data;

        if (state.file) {
          data = await generateFromPDF(state.file);
        } else {
          data = await generateQuiz(state.topic);
        }

        if (!data || data.error) {
          throw new Error(data?.error || "Invalid response");
        }

        let quiz = data.quiz || data;

        if (typeof quiz === "string") {
          quiz = JSON.parse(quiz);
        }

        setQuizData(quiz);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [state]);

 if (loading) {
  return (
    <div className="container">
      <div className="spinner"></div>
      <p>Generating Quiz...</p>
    </div>
  );
 }
  if (!quizData) return <h2>Error: {error}</h2>;

  const { questions, options, answers } = quizData;

  const handleSelect = (index) => {
    const timeSpent = Date.now() - startTime;

    const newSelected = [...selected];
    newSelected[current] = index;

    const newTime = [...timePerQuestion];
    newTime[current] = timeSpent;

    setSelected(newSelected);
    setTimePerQuestion(newTime);
  };

  const handleNext = () => {
    if (selected[current] === undefined) {
      alert("Select an option");
      return;
    }

    setCurrent((prev) => prev + 1);
    setStartTime(Date.now());
  };

  const handleSubmit = async () => {
    let score = 0;

    selected.forEach((ans, i) => {
      if (ans === answers[i]) score++;
    });

    try {
      await submitQuiz(score);
    } catch { }

    navigate("/result", {
      state: {
        score,
        total: questions.length,
        questions,
        options,
        correctAnswers: answers,
        userAnswers: selected,
        timePerQuestion
      }
    });
  };

  return (
    <div className="container">
      <h2>Q{current + 1}</h2>

      <p>{questions[current]}</p>

      {options[current].map((opt, i) => (
        <button
          key={i}
          onClick={() => handleSelect(i)}
          className={`option-btn ${selected[current] === i ? "selected" : ""
            }`}
        >
          {opt}
        </button>
      ))}

      <br />

      {current < questions.length - 1 ? (
        <button onClick={handleNext}>
          Next
        </button>
      ) : (
        <button onClick={handleSubmit}>
          Submit
        </button>
      )}
    </div>
  );
}