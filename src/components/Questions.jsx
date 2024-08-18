import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Questions.module.css";

const questions = [
  {
    question: "How comfortable are you with speaking in front of others?",
    options: [
      "I'm most comfortable in one-on-one conversations",
      "I'm comfortable speaking in small groups (2-3 people)",
      "I'm comfortable speaking in medium-sized groups (5-10 people)",
      "I'm comfortable with public speaking (larger audiences)",
    ],
  },
  {
    question:
      "Where will you rank yourself among your peers (batchmates, colleagues)?",
    options: ["Among top 10%", "Among top 25%", "Among top 50%", "Bottom 25%"],
  },
  {
    question: "How is your current financial condition",
    options: ["Stable", "Somewhat Stable", "Unstable", "Very Unstable"],
  },
  {
    question: "What describes your phase of life?",
    options: [
      "Stuck & anxious",
      "Unsure, going with the flow",
      "Trying but no growth",
      "Trying & growing",
    ],
  },
  {
    question: "What best describes your current status?",
    options: [
      "Working Professional",
      "Student",
      "Business Owner/Entrepreneur",
      "Other",
    ],
  },
];

const totalQuestions = questions.length + 6; // 4 is the number of descriptive questions

const Questions = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [answersData, setAnswersData] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    const newAnswersData = [...answersData];
    newAnswersData[currentQuestion] = {
      question: questions[currentQuestion].question,
      answer: answer,
    };
    setAnswersData(newAnswersData);
  };

  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Submitted answers:", answersData);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/gtu/next", { state: { answersData } });
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Processing your data...</p>
        <div className={styles.loader}></div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className={styles.container}>
      <div className={styles.progressBarContainer}>
        <div
          className={styles.progressBar}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className={styles.progressText}>
        Question {currentQuestion + 1} of {totalQuestions}
      </p>
      <p className={styles.question}>{questions[currentQuestion].question}</p>
      <div className={styles.optionsContainer}>
        {questions[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            className={`${styles.optionButton} ${
              answers[currentQuestion] === option ? styles.selectedOption : ""
            }`}
            onClick={() => handleAnswer(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <div className={styles.navigationButtons}>
        <button
          className={styles.navButton}
          onClick={goToPreviousQuestion}
          disabled={currentQuestion === 0}
        >
          Previous
        </button>
        {currentQuestion < questions.length - 1 ? (
          <button className={styles.navButton} onClick={goToNextQuestion}>
            Next
          </button>
        ) : (
          <button className={styles.submitButton} onClick={handleSubmit}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default Questions;
