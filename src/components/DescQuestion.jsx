import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./DescQuestions.module.css";

const descQuestions = [
  "What is your short term and long term goal?",
  "What has been your biggest achievement?",
  "What has been your biggest regret?",
];

const fallbackQuotes = [
  "Success is the sum of small efforts, repeated day in and day out. — Robert Collier",
  "The true measure of a person is not in how they avoid obstacles, but in how they face them with courage and resilience.",
  "The strength of your character is reflected in the way you treat others, for it is through connection that true greatness is revealed.",
];

const DescQuestions = () => {
  const location = useLocation();
  const previousAnswers = location.state?.answersData || [];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(
    Array(descQuestions.length + 2).fill("")
  );
  const [mergedAnswers, setMergedAnswers] = useState([]);
  const [remainingDescQuestions, setRemainingDescQuestions] = useState([]);
  const [showQuote, setShowQuote] = useState(false);
  const [currentQuote, setCurrentQuote] = useState("");
  const [bookRecommendations, setBookRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);

  const [becomingQuestion, setBecomingQuestion] = useState("");
  const [becomingOptions, setBecomingOptions] = useState([]);
  const [selectedBecomingOption, setSelectedBecomingOption] = useState("");
  const [explanationQuestion, setExplanationQuestion] = useState("");

  const totalQuestions = previousAnswers.length + descQuestions.length + 2;

  useEffect(() => {
    if (descQuestions.length > 0) {
      setMergedAnswers([
        ...previousAnswers,
        { question: descQuestions[0], answer: "" },
      ]);
      setRemainingDescQuestions(descQuestions.slice(1));
    }
  }, []);

  useEffect(() => {
    if (showQuote) {
      const timer = setTimeout(() => {
        setShowQuote(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showQuote]);

  const generateFollowUpQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8080/generate_followup_questions",
        {
          goals: answers[0],
        }
      );
      setBecomingQuestion(response.data.becoming_question);
      setBecomingOptions(response.data.becoming_options);
    } catch (error) {
      console.error("Error generating follow-up questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateExplanationQuestion = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8080/generate_explanation_question",
        {
          becoming_question: becomingQuestion,
          selected_option: selectedBecomingOption,
        }
      );
      setExplanationQuestion(response.data.explanation_question);
    } catch (error) {
      console.error("Error generating explanation question:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (e) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = e.target.value;
    setAnswers(newAnswers);

    if (currentQuestion === 0) {
      const newMergedAnswers = [...mergedAnswers];
      newMergedAnswers[newMergedAnswers.length - 1].answer = e.target.value;
      setMergedAnswers(newMergedAnswers);
      generateFollowUpQuestions();
    }
  };

  const handleBecomingOptionSelect = (option) => {
    setSelectedBecomingOption(option);
    const newAnswers = [...answers];
    newAnswers[1] = option;
    setAnswers(newAnswers);
    generateExplanationQuestion();
  };

  const handleNext = async () => {
    setIsNextLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8080/getquote", {
        answer: answers[currentQuestion],
      });
      setCurrentQuote(response.data.quote);
      setShowQuote(true);
      setTimeout(() => {
        if (currentQuestion < totalQuestions - 1) {
          setCurrentQuestion(currentQuestion + 1);
        }
        setIsNextLoading(false);
      }, 3000);
    } catch (error) {
      console.error("Error fetching quote:", error);
      setCurrentQuote(fallbackQuotes[currentQuestion % fallbackQuotes.length]);
      setShowQuote(true);
      setTimeout(() => {
        if (currentQuestion < totalQuestions - 1) {
          setCurrentQuestion(currentQuestion + 1);
        }
        setIsNextLoading(false);
      }, 3000);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const allAnswers = [
        ...mergedAnswers,
        { question: becomingQuestion, answer: selectedBecomingOption },
        { question: explanationQuestion, answer: answers[2] },
        ...remainingDescQuestions.map((q, i) => ({
          question: q,
          answer: answers[i + 3],
        })),
      ];

      // Send all QA pairs to Airtable
      await axios.post("http://127.0.0.1:8080/store_all_qa", {
        userid: "user123", // You should replace this with the actual user ID
        qa_pairs: allAnswers,
      });

      // Get book recommendations
      const response = await axios.post(
        "http://127.0.0.1:8080/recommend_book",
        {
          mergedAnswers: allAnswers,
        }
      );
      setBookRecommendations(response.data);
      setShowRecommendations(true);
    } catch (error) {
      console.error("Error processing submission:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderBookRecommendations = () => {
    return (
      <div className={styles.bookRecommendationsContainer}>
        <h2 className={styles.recommendationsTitle}>
          Recommended Books for You
        </h2>
        <div className={styles.bookCards}>
          {bookRecommendations.map((book, index) => (
            <div key={index} className={styles.bookCard}>
              <h3 className={styles.bookTitle}>{book.title}</h3>
              <p className={styles.bookSummary}>{book.summary}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderQuestion = () => {
    if (currentQuestion === 0) {
      return (
        <>
          <h2 className={styles.question}>{descQuestions[0]}</h2>
          <textarea
            className={styles.answerInput}
            value={answers[0]}
            onChange={handleAnswer}
            placeholder="Type your answer here..."
          />
        </>
      );
    } else if (currentQuestion === 1) {
      return (
        <>
          <p className={styles.question}>{becomingQuestion}</p>
          <div className={styles.optionsContainer}>
            {becomingOptions.map((option, index) => (
              <button
                key={index}
                className={`${styles.optionButton} ${
                  answers[currentQuestion] === option
                    ? styles.selectedOption
                    : ""
                }`}
                onClick={() => handleBecomingOptionSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      );
    } else if (currentQuestion === 2) {
      return (
        <>
          <h2 className={styles.question}>{explanationQuestion}</h2>
          <textarea
            className={styles.answerInput}
            value={answers[2]}
            onChange={handleAnswer}
            placeholder="Type your answer here..."
          />
        </>
      );
    } else {
      const index = currentQuestion - 3;
      return (
        <>
          <h2 className={styles.question}>{descQuestions[index + 1]}</h2>
          <textarea
            className={styles.answerInput}
            value={answers[currentQuestion]}
            onChange={handleAnswer}
            placeholder="Type your answer here..."
          />
        </>
      );
    }
  };

  const progress =
    ((previousAnswers.length + currentQuestion + 1) / totalQuestions) * 100;

  if (showQuote) {
    return (
      <div className={styles.quoteContainer}>
        <p className={styles.quote}>{currentQuote}</p>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      {!showRecommendations && (
        <>
          <div className={styles.progressBarContainer}>
            <div
              className={styles.progressBar}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className={styles.progressText}>
            Question {previousAnswers.length + currentQuestion + 1} of{" "}
            {totalQuestions}
          </p>
        </>
      )}
      <div className={styles.container}>
        {!showRecommendations ? (
          <>
            {renderQuestion()}
            <div className={styles.buttonContainer}>
              <button
                className={styles.prevButton}
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </button>
              {currentQuestion + previousAnswers.length < totalQuestions - 1 ? (
                <button
                  className={styles.nextButton}
                  onClick={handleNext}
                  disabled={
                    isNextLoading ||
                    (currentQuestion === 1 && !selectedBecomingOption)
                  }
                >
                  {isNextLoading ? "Processing..." : "Next"}
                </button>
              ) : (
                <button
                  className={styles.submitButton}
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Get Book Recommendations"}
                </button>
              )}
            </div>
          </>
        ) : (
          renderBookRecommendations()
        )}
      </div>
    </div>
  );
};

export default DescQuestions;
