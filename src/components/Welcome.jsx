import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./Welcome.module.css";

const WelcomePage = () => {
  const navigate = useNavigate();
  const { name } = useParams();
  const message = `Hi ${name}, let's start your journey. Please answer a few questions to let us know more about you.`;

  const handleStart = () => {
    navigate("/gtu/questions");
  };

  return (
    <div className={styles.container}>
      <p className={styles.message}>{message}</p>
      <button className={styles.startButton} onClick={handleStart}>
        Let's Start
      </button>
    </div>
  );
};

export default WelcomePage;
