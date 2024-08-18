// import React, { useState } from 'react';


// export const ChatInterface = () => {
//     const [messages, setMessages] = useState([]);
//     const [inputValue, setInputValue] = useState('');

//     const handleSendMessage = async () => {
//         try {
//             setMessages(prevMessages => [...prevMessages, { sender: 'user', text: inputValue }]);

//             const response = await axios.post('http://localhost:5000/generate-response', {
//                 userQuery: inputValue
//             });

//             setInputValue('');

//             const responseData = response.data.response; // Changed this line
//             setMessages(prevMessages => [...prevMessages, { sender: 'coach', text: responseData }]);
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     };

//     const handleInputChange = (e) => {
//         setInputValue(e.target.value);
//     };



//     return (
//         <div className="chat-container">
//             <header className="chat-header">
//                 {/* <img
//                     src="https://www.example.com/path_to_brendon_image.jpg" // Replace with actual image URL
//                     alt="Brendon Burchard"
//                     className="chat-header-image"
//                 /> */}
//                 <div className="chat-header-info">
//                     <h1 className="chat-header-title">Brendon Burchard - Trial</h1>
//                     <span className="chat-header-subtitle">Brendon AI Life Coach: Trial</span>
//                 </div>
//             </header>
//             <div className="chat-messages">
//                 {messages.map((message, index) => (
//                     <div
//                         key={index}
//                         className={`chat-message ${message.sender === 'coach' ? 'chat-message-coach' : 'chat-message-user'}`}
//                     >
//                         {/* <img
//                             src={message.sender === 'coach' ? "https://www.example.com/path_to_brendon_image.jpg" : "https://www.example.com/path_to_user_image.jpg"}
//                             alt={message.sender}
//                             className="chat-message-image"
//                         /> */}
//                         <div className="chat-message-text">{message.text}</div>
//                     </div>
//                 ))}
//             </div>
//             <div className="chat-footer">
//                 <input
//                     type="text"
//                     placeholder="Ask me any question"
//                     className="chat-input"
//                     value={inputValue}
//                     onChange={handleInputChange}
//                 />
//                 <button
//                     className="chat-button"
//                     onClick={handleSendMessage}
//                 >
//                     Send
//                 </button>
//             </div>
//         </div>
//     );
// };

// export const Chat = () => {
//     const [isChatVisible, setChatVisible] = useState(false);

//     const handleButtonClick = () => {
//         setChatVisible(true);
//     };

//     return (
//         <div className="profile-container">
//             <div className="profile-header">
//                 <img
//                     src="https://www.example.com/path_to_brendon_image.jpg" // Replace with actual image URL
//                     alt="Brendon Burchard"
//                     className="profile-image"
//                 />
//                 <div className="profile-name-container">
//                     <h1 className="profile-name">Brendon Burchard - Trial</h1>
//                     <span className="profile-subtitle">Brendon AI Life Coach: Trial</span>
//                 </div>
//             </div>
//             <div className="profile-about">
//                 <h2>About</h2>
//                 <p>
//                     Brendon Burchard is a 3-time New York Times bestselling author,
//                     a globally respected high performance coach, and one of the world’s
//                     most watched, followed, and quoted personal development trainers with
//                     over 10 million followers across his brands. Forbes.com named him
//                     “the world’s leading high performance coach.” O, the Oprah Magazine
//                     named him “one of the most influential leaders in personal growth.”
//                     Larry King called him “the world’s leading life coach.” Success Magazine
//                     ranks him in the Top 25 Most Influential success teachers along with
//                     Oprah Winfrey, Dr. Phil, Tony Robbins, Tim Ferriss, Arianna Huffington,
//                     and Deepak Chopra. An article in USA TODAY recently named him top 5 mindset
//                     and performance coach in the world. Over 3 million clients have taken his
//                     online courses and video series. No other person in the world has created
//                     more high-performance training and content.
//                 </p>
//             </div>
//             <div className="profile-footer">
//                 <input
//                     type="text"
//                     placeholder="Ask me any question"
//                     className="profile-input"
//                 />
//                 <button className="profile-button" onClick={handleButtonClick}>Start Talking</button>
//             </div>
//             {isChatVisible && <ChatInterface />}
//         </div>
//     );
// }
