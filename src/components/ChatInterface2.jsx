import "./Chat.css";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./typing.css";
import { useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { faSave } from "@fortawesome/free-solid-svg-icons"; // Import the save icon
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ChatInterface = () => {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [userquestion, setUserQuestion] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isInitialMessageProcessed = useRef(false);
  const inputRef = useRef(null);
  const chatMessagesRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    let storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      storedUserId = uuidv4();
      localStorage.setItem("userId", storedUserId);
    }
    setUserId(storedUserId);

    const queryParams = new URLSearchParams(location.search);
    const userMessage = queryParams.get("message");
    if (userMessage && !isInitialMessageProcessed.current) {
      sendMessage(userMessage, storedUserId);
      isInitialMessageProcessed.current = true;
    }
  }, [location]);

  useEffect(() => {
    if (chatMessagesRef.current) {
      const chatContainer = chatMessagesRef.current;

      console.log("height: " + chatContainer.clientHeight);
      const elements = document.getElementsByClassName("user-message-content");

      let element_height; // Declare element_height outside the if...else block

      if (elements.length > 0) {
        const lastElement = elements[elements.length - 1];
        element_height = lastElement.clientHeight;
      } else {
        element_height = 80; // Assign a default height if no elements are found
      }
      // Adjust padding bottom if needed
      console.log("element height : " + element_height);
      chatContainer.style.paddingBottom = `${
        chatContainer.clientHeight + 200
      }px`;
      const messageElements = chatContainer.querySelectorAll(
        ".user-message-content"
      );
      // Get the current scrollTop position
      const currentScrollTop = chatContainer.scrollTop;

      // Scroll to the calculated position smoothly
      requestAnimationFrame(() => {
        chatContainer.scrollTo({
          top:
            chatContainer.scrollHeight -
            chatContainer.clientHeight -
            80 -
            element_height,
          behavior: "smooth",
        });
      });
    }
  }, [userquestion]);

  const sendMessage = async (message, userId) => {
    try {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: message },
      ]);
      setUserQuestion((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: message },
      ]);
      setIsLoading(true);

      const response = await fetch("http://127.0.0.1:8080/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: message, userid: userId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let responseData = "";
      let currentMessage = { sender: "coach", text: "" };
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        responseData += chunk;
        currentMessage.text += chunk;

        // Update the messages state with the current chunk
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          if (newMessages[newMessages.length - 1].sender === "coach") {
            newMessages[newMessages.length - 1] = currentMessage;
          } else {
            newMessages.push(currentMessage);
          }
          return newMessages;
        });
        await delay(75);
      }

      // Process the complete response
      const purchaseLinkRegex =
        /(You can purchase it from here: )(https?:\/\/[^\s]+)/g;
      const sourceLinkRegex = /(Source : )(https?:\/\/[^\s]+|www\.[^\s]+)/g;
      const specialMessageIdentifier = "gadgetstouse@gmail.com";

      let hasSpecialMessage = responseData.includes(specialMessageIdentifier);
      responseData = responseData.replace(/^\s*\.\s*$/, "").trim();

      if (responseData) {
        const sourceLinkMatch = sourceLinkRegex.exec(responseData);
        if (sourceLinkMatch) {
          const sourceLink = ensureHttp(sourceLinkMatch[2]);
          currentMessage.sourceLink = sourceLink;
          currentMessage.text = currentMessage.text
            .replace(sourceLinkRegex, "")
            .trim();
        }

        if (hasSpecialMessage) {
          currentMessage.isSpecialMessage = true;
          currentMessage.userQuery = message;
        }

        // Final update to the messages state
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          newMessages[newMessages.length - 1] = currentMessage;
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const ensureHttp = (link) => {
    if (!/^https?:\/\//i.test(link)) {
      return "http://" + link;
    }
    return link;
  };

  const saveUserMessage = async (userMessage) => {
    try {
      const response = await axios.post(
        "https://flaskbackend-f7gwexxg4q-el.a.run.app/save",
        {
          user_query: userMessage,
        }
      );

      if (response.status === 200) {
        console.log("User message saved successfully.");
        toast.success("Message successfully sent to creator!");
      } else {
        toast.error("Failed to save user message:");
      }
    } catch (err) {
      toast.error("Error saving user message:", err);
    }
  };

  const handleSendMessage = () => {
    if (inputValue.trim() && isInitialMessageProcessed.current) {
      sendMessage(inputValue, userId);
      setInputValue("");
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <img
          src="https://pbs.twimg.com/profile_images/1721227507893198848/goXiIldd_400x400.jpg"
          alt="Profile"
          className="chat-profile-pic"
        />
        <div className="chat-header-info">
          <h1 className="chat-header-title">Abhishek Bhatnagar</h1>
          <span className="chat-header-subtitle">
            Pro Blogger, Entrepreneur, AI Expert, Youtuber, Founder &
            Editor-in-chief of @gadgetstouse
          </span>
        </div>
      </header>
      <div className="chat-messages" ref={chatMessagesRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat-message ${
              message.sender === "coach"
                ? "chat-message-coach"
                : "chat-message-user"
            }`}
          >
            {message.sender === "coach" && (
              <div className="coach-message-content">
                <div className="coach-text">
                  <span dangerouslySetInnerHTML={{ __html: message.text }} />
                  {message.sourceLink && (
                    <a
                      href={message.sourceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="chat-message-icon"
                    >
                      <FontAwesomeIcon icon={faLink} />
                    </a>
                  )}
                  {message.isSpecialMessage && (
                    <FontAwesomeIcon
                      icon={faSave}
                      className="chat-message-icon"
                      onClick={() => saveUserMessage(message.userQuery)}
                    />
                  )}
                </div>
              </div>
            )}
            {message.sender === "user" && (
              <div className="user-message-content">
                <span dangerouslySetInnerHTML={{ __html: message.text }} />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="chat-message chat-message-coach typing-indicator">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        )}
      </div>
      <div className="floating-container2">
        <input
          type="text"
          className="floating-input2"
          placeholder="Ask Pluto"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          ref={inputRef}
        />
        <button className="floating-button2" onClick={handleSendMessage}>
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

      <ToastContainer />
    </div>
  );
};
