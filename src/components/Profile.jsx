import { useState, useRef, useEffect } from "react";
import "./my.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";


const Waitlistclick = ()=>{
  window.location.href = 'https://tally.so/r/wbO221';
}

const Navbar = () => {
  return (
    <div className="navbar">
  <div className='logo'  onClick={Waitlistclick}> <svg fill="#FFFF" width="45px" height="45px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <path d="M511.328,20.8027c-11.60759,38.70264-34.30724,111.70173-61.30311,187.70077,6.99893,2.09372,13.4042,4,18.60653,5.59368a16.06158,16.06158,0,0,1,9.49854,22.906c-22.106,42.29635-82.69047,152.795-142.47819,214.40356-.99984,1.09373-1.99969,2.5-2.99954,3.49995A194.83046,194.83046,0,1,1,57.085,179.41009c.99985-1,2.40588-2,3.49947-3,61.59994-59.90549,171.97367-120.40473,214.37343-142.4982a16.058,16.058,0,0,1,22.90274,9.49988c1.59351,5.09368,3.49947,11.5936,5.5929,18.59351C379.34818,35.00565,452.43074,12.30281,491.12794.70921A16.18325,16.18325,0,0,1,511.328,20.8027ZM319.951,320.00207A127.98041,127.98041,0,1,0,191.97061,448.00046,127.97573,127.97573,0,0,0,319.951,320.00207Zm-127.98041-31.9996a31.9951,31.9951,0,1,1-31.9951-31.9996A31.959,31.959,0,0,1,191.97061,288.00247Zm31.9951,79.999a15.99755,15.99755,0,1,1-15.99755-15.9998A16.04975,16.04975,0,0,1,223.96571,368.00147Z"/>
        </svg>
        <h4>PLUTO</h4>
        </div>


            <div className='expert_profile'>
            <img
                src="https://pbs.twimg.com/profile_images/1721227507893198848/goXiIldd_400x400.jpg"
                alt="Abhishek Bhatnagar"
                className="navbar-image"
            />
            <div className="navbar-text">
                <h1 className="navbar-name">Abhishek Bhatnagar</h1>
                <span className="navbar-subtitle">Pro Blogger, AI Expert</span>
            </div>
            </div>
    </div>
  );
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const SuggestedQuestions = ({ onQuestionClick }) => {
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate=useNavigate()
  useEffect(() => {
    const userId = localStorage.getItem("userId") || `user_${Date.now()}`;
    localStorage.setItem("userId", userId);

    const { fromReelPage, topic } = location.state || {};

    const fetchQuestions = async () => {
      console.log(`we are calling api:`);
      setIsLoading(true);
      try {
        if (fromReelPage) {
          console.log("from reel page");
          const response = await axios.post(
            "https://flaskbackend-f7gwexxg4q-el.a.run.app/questions",
            {
              topic,
              userid: userId,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log(`api response received:`);
          await delay(2000)
          const questions = response.data.questions
            .split("\n")
            .map((q) => q.trim().slice(3));
          setSuggestedQuestions(questions.slice(0, 4));
        } else {
          console.log("normal user");
          const response = await axios.get(
            "https://flaskbackend-f7gwexxg4q-el.a.run.app/suggest-questions"
          );
          await delay(2000)
          const questions = response.data.questions
            .split("\n")
            .map((q) => q.trim().slice(3));
          setSuggestedQuestions(questions.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        setSuggestedQuestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [location.state]);

  return (
    <div className="suggested-questions">
      {isLoading
        ? Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="question-card-load">
              <SkeletonTheme baseColor="#202020" highlightColor="#444">
                <Skeleton count={8} containerClassName="max-container" />
              </SkeletonTheme>
            </div>
          ))
        : suggestedQuestions.map((question, index) => (
            <div
              key={index}
              className="question-card"
              onClick={() =>  navigate(`/gtu/chat?message=${encodeURIComponent(question)}`)}
            >
              <p>{question}</p>
              <span className="arrow">→</span>
            </div>
          ))}
    </div>
  );
};

const dummyQuestions = ["Health & Fitness"];

export const Profile = () => {
  const [message, setMessage] = useState("");
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [subtitle, setSubtitle] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const location = useLocation();

  // console.log(subtitle)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Get the subtitle from the location state
    if (location.state && location.state.subtitle) {
      setSubtitle(location.state.subtitle);
    }
  }, [location]);

  const handleButtonClick = () => {
    navigate(`/gtu/chat?message=${encodeURIComponent(message)}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleButtonClick();
    }
  };

  const handleSuggestedQuestionClick = (question) => {
    setMessage(question);
    inputRef.current.focus();
  };

  const Waitlistclick = () => {
    window.location.href = "https://tally.so/r/wbO221";
  };

  return (
    <div className="profile-container">
      <Navbar />
      <div className="main-content">
        <div className="left-column">
          <div className="profile-header">
            <h1 className="company-heading">
              Where curiosity meets credibility
            </h1>
            <p className="company-subtitle">
              Explore the knowledge of trusted experts, that was previously
              locked in various sources.
            </p>
          </div>
          <div className="ask-about-section">
            <h5 style={{ color: "#bbb" }}>
              Ask about Gadgets & application from GTU{" "}
            </h5>
            <div className="question-list">
              {subtitle && <div className="question-item">{subtitle}</div>}
            </div>
          </div>
        </div>
        <div className="right-column">
          <SuggestedQuestions onQuestionClick={handleSuggestedQuestionClick} />
        </div>
        <div></div>
        <div className="profile-content">
          <div className="profile-main">
            <div className="profile-ask">
              <div className="floating-container">
                <input
                  type="text"
                  className="floating-input"
                  placeholder="Ask me anything"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  ref={inputRef}
                />
                <button className="floating-button" onClick={handleButtonClick}>
                  <div className="button-circle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      fill="white"
                      viewBox="0 0 32 32"
                      className="icon-2xl"
                    >
                      <path
                        fill=""
                        fillRule="evenodd"
                        d="M15.192 8.906a1.143 1.143 0 0 1 1.616 0l5.143 5.143a1.143 1.143 0 0 1-1.616 1.616l-3.192-3.192v9.813a1.143 1.143 0 0 1-2.286 0v-9.813l-3.192 3.192a1.143 1.143 0 1 1-1.616-1.616z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div></div>
      <div>

<div className='Waitlist-container'>
    <h2 className='waitlist-header'>Are you a content creator or Domain Expert?</h2> 
    <div className='parent-waitlist'>
<h3 className='waitlist-sub'>Become an expert on Pluto</h3>
<button onClick={Waitlistclick} className='waitlist-button'>Join the waitlist →</button>
</div>
</div>
</div>
    </div>
  );
};