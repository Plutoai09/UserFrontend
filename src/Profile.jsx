import React, { useState, useRef, useEffect } from 'react';
import './my.css'
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';





const Navbar = () => {
    return (
        <div className="navbar">
            <img
                src="https://pbs.twimg.com/profile_images/1721227507893198848/goXiIldd_400x400.jpg"
                alt="Abhishek Bhatnagar"
                className="navbar-image"
            />
            <div className="navbar-text">
                <h1 className="navbar-name">Abhishek Bhatnagar</h1>
                <span className="navbar-subtitle">Pro Blogger, Entrepreneur, AI Expert</span>
            </div>
        </div>
    );
};





const SuggestedQuestions = ({ onQuestionClick }) => {
    const [suggestedQuestions, setSuggestedQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const userId = localStorage.getItem('userId') || `user_${Date.now()}`;
        localStorage.setItem('userId', userId);

        const { fromReelPage, topic } = location.state || {};

        const fetchQuestions = async () => {
            console.log(`we are calling api:`)
            setIsLoading(true);
            try {
                if (fromReelPage) {
                    console.log('from reel page');
                    const response = await axios.post('https://flaskbackend-f7gwexxg4q-el.a.run.app/questions', {
                        topic,
                        userid: userId
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    console.log(`api response received:`)
                    const questions = response.data.questions.split('\n').map(q => q.trim().slice(3));
                    setSuggestedQuestions(questions.slice(0, 4));
                } else {
                    console.log('normal user');
                    const response = await axios.get('https://flaskbackend-f7gwexxg4q-el.a.run.app/suggest-questions');
                    const questions = response.data.questions.split('\n').map(q => q.trim().slice(3));
                    setSuggestedQuestions(questions.slice(0, 4));
                }
            } catch (error) {
                console.error('Error fetching questions:', error);
                setSuggestedQuestions([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuestions();
    }, [location.state]);

    return (
        <div className="suggested-questions">
            {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="question-card-load">
                       <SkeletonTheme baseColor="#202020" highlightColor="#444">
                        <Skeleton   count={8} containerClassName="max-container" />
                        </SkeletonTheme>
                    
                    </div>
                ))
            ) : (
                suggestedQuestions.map((question, index) => (
                    <div key={index} className="question-card" onClick={() => onQuestionClick(question)}>
                        <p>{question}</p>
                        <span className="arrow">→</span>
                    </div>
                ))
            )}
        </div>
    );
};


// export const Profile = () => {
//     const [message, setMessage] = useState('');
//     const [isAboutVisible, setIsAboutVisible] = useState(false);
//     const navigate = useNavigate();
//     const inputRef = useRef(null);

//     useEffect(() => {
//         if (inputRef.current) {
//             inputRef.current.focus();
//         }
//     }, []);

//     const handleButtonClick = () => {
//         navigate(`/chat?message=${encodeURIComponent(message)}`);
//     };

//     const handleKeyPress = (e) => {
//         if (e.key === 'Enter') {
//             handleButtonClick();
//         }
//     };

//     const handleSuggestedQuestionClick = (question) => {
//         setMessage(question);
//         inputRef.current.focus();
//     };

//     return (
//         <div className="profile-container">
//             <Navbar />
//             <div className="main-content">
//                 <div className="profile-header">
//                     <h1 className="company-heading">Where curiosity meets credibility</h1>
//                     <p className="company-subtitle">Explore the knowledge of trusted experts, that was previously locked in podcasts.</p>
//                 </div>





//                 <SuggestedQuestions onQuestionClick={handleSuggestedQuestionClick} />

//             </div>
//             <div className="profile-content">
//                 <div className="profile-main">
//                     <div className="profile-ask">
//                         <div className="floating-container">
//                             <input
//                                 type="text"
//                                 className="floating-input"
//                                 placeholder="Ask me anything"
//                                 value={message}
//                                 onChange={(e) => setMessage(e.target.value)}
//                                 onKeyPress={handleKeyPress}
//                                 ref={inputRef}
//                             />
//                             <button className="floating-button" onClick={handleButtonClick}>
//                                 <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" fill="none" viewBox="0 0 32 32" className="icon-2xl">
//                                     <path fill="currentColor" fillRule="evenodd" d="M15.192 8.906a1.143 1.143 0 0 1 1.616 0l5.143 5.143a1.143 1.143 0 0 1-1.616 1.616l-3.192-3.192v9.813a1.143 1.143 0 0 1-2.286 0v-9.813l-3.192 3.192a1.143 1.143 0 1 1-1.616-1.616z" clipRule="evenodd"></path>
//                                 </svg>
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };



const dummyQuestions = [
    "Health & Fitness",
];


export const Profile = () => {
    const [message, setMessage] = useState('');
    const [isAboutVisible, setIsAboutVisible] = useState(false);
    const [subtitle, setSubtitle] = useState('');
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
        navigate(`/chat?message=${encodeURIComponent(message)}`);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleButtonClick();
        }
    };

    const handleSuggestedQuestionClick = (question) => {
        setMessage(question);
        inputRef.current.focus();
    };

    return (
        <div className="profile-container">
            <Navbar />
            <div className="main-content">
                <div className="left-column">
                    <div className="profile-header">
                        <h1 className="company-heading">Where curiosity meets credibility</h1>
                        <p className="company-subtitle">Explore the knowledge of trusted experts, that was previously locked in podcasts.</p>
                    </div>
                    <div className="ask-about-section">
                        <h5 style={{ color: '#bbb' }} >Ask about...</h5>
                        <div className="question-list">
                            {subtitle && (
                                <div
                                    className="question-item"
                                >
                                    {subtitle}
                                </div>
                            )}
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
                                    <div className='button-circle'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="white" viewBox="0 0 32 32" className="icon-2xl">
                                            <path fill="" fillRule="evenodd" d="M15.192 8.906a1.143 1.143 0 0 1 1.616 0l5.143 5.143a1.143 1.143 0 0 1-1.616 1.616l-3.192-3.192v9.813a1.143 1.143 0 0 1-2.286 0v-9.813l-3.192 3.192a1.143 1.143 0 1 1-1.616-1.616z" clipRule="evenodd"></path>
                                        </svg>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
};