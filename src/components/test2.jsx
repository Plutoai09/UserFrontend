import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './test.css'; // Import the CSS file

export const Test2 = () => {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleButtonClick = () => {
        navigate(`/gtu/chat?message=${encodeURIComponent(message)}`);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleButtonClick();
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-content">
                <div className="profile-header">
                    <img
                        src="https://pbs.twimg.com/profile_images/1721227507893198848/goXiIldd_400x400.jpg"
                        alt="Abhishek Bhatnagar"
                        className="profile-image"
                    />
                    <div className="profile-text">
                        <h1 className="profile-name">Abhishek Bhatnagar</h1>
                        <span className="profile-subtitle">Pro Blogger, Entrepreneur, AI Expert, Youtuber, Founder & Editor-in-chief of @gadgetstouse</span>
                    </div>
                </div>
                <div className="profile-about">
                    <h2>About</h2>
                    <p>
                        Abhishek Bhatnagar is the founder and editor-in-chief of the tech website and media publication "Gadgets To Use." As a popular YouTuber and tech blogger from India, his professional profile highlights his leadership role at "Gadgets To Use," where he combines his engineering background with his entrepreneurial spirit. He is currently exploring the latest advancements in AI technologies.
                    </p>
                </div>
                <div className="profile-welcome">
                    <h3>Welcome Message</h3>
                    <div className="welcome-popup">
                        <p className="welcome-message">
                            Hi there! I'm here to help you with any questions you have about technology, gadgets, AI advancements, and more. Feel free to ask me anything by typing your question below.
                        </p>
                    </div>
                </div>
                <div className="profile-footer">
                    <input
                        type="text"
                        placeholder="Ask me any question"
                        className="profile-input"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        ref={inputRef}
                    />
                    <button className="profile-button" onClick={handleButtonClick}>Start Talking</button>
                </div>
            </div>
        </div>
    );
};
