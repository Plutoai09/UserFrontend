import "./Chat.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./typing.css";
import { useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ChatInterface = () => {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
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

  useEffect(() => {}, [messages, isLoading]);

  const sendMessage = async (message, userId) => {
    try {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: message },
      ]);
      setIsLoading(true);

      const response = await axios.post(
        "https://flaskbackend-f7gwexxg4q-el.a.run.app/query",
        {
          query: message,
          userid: userId,
        }
      );

      console.log(response);

      let responseData = response.data.response;
      const purchaseLinkRegex =
        /(You can purchase it from here: )(https?:\/\/[^\s]+)/g;
      const sourceLinkRegex = /(Source : )(https?:\/\/[^\s]+|www\.[^\s]+)/g;
      const specialMessageIdentifier = "gadgetstouse@gmail.com";

      let messagesToAdd = [];
      let hasSpecialMessage = false;

      if (responseData.includes(specialMessageIdentifier)) {
        hasSpecialMessage = true;
      }
      responseData = responseData.replace(/^\s*\.\s*$/, "").trim();

      if (responseData) {
        const purchaseLinkMatch = purchaseLinkRegex.exec(responseData);
        if (purchaseLinkMatch) {
          const beforeLinkText = responseData
            .slice(0, purchaseLinkMatch.index)
            .trim();
          const linkText = `<strong>${
            purchaseLinkMatch[1]
          }</strong><a href="${ensureHttp(
            purchaseLinkMatch[2]
          )}" target="_blank">${purchaseLinkMatch[2]}</a>`;
          const afterLinkText = responseData
            .slice(purchaseLinkMatch.index + purchaseLinkMatch[0].length)
            .trim();

          if (beforeLinkText)
            messagesToAdd.push({ sender: "coach", text: beforeLinkText });
          messagesToAdd.push({
            sender: "coach",
            text: linkText,
            isPurchaseMessage: true,
          });
          if (afterLinkText)
            messagesToAdd.push({ sender: "coach", text: afterLinkText });
        } else {
          messagesToAdd.push({ sender: "coach", text: responseData });
        }

        const sourceLinkMatch = sourceLinkRegex.exec(responseData);
        if (sourceLinkMatch && messagesToAdd.length > 0) {
          const sourceLink = ensureHttp(sourceLinkMatch[2]);
          messagesToAdd[0].sourceLink = sourceLink;
          messagesToAdd[0].text = messagesToAdd[0].text
            .replace(sourceLinkRegex, "")
            .trim();
        }
      }

      messagesToAdd = messagesToAdd.filter((msg) => msg.text.trim() !== "");

      if (hasSpecialMessage) {
        messagesToAdd[messagesToAdd.length - 1].isSpecialMessage = true;
        messagesToAdd[messagesToAdd.length - 1].userQuery = message; // Attach original user query
      }

      if (messagesToAdd.length > 0) {
        setMessages((prevMessages) => [...prevMessages, ...messagesToAdd]);
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
    <>
      <div className="chat-header">
        <svg
          fill="#000000"
          width="800px"
          height="800px"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M511.328,20.8027c-11.60759,38.70264-34.30724,111.70173-61.30311,187.70077,6.99893,2.09372,13.4042,4,18.60653,5.59368a16.06158,16.06158,0,0,1,9.49854,22.906c-22.106,42.29635-82.69047,152.795-142.47819,214.40356-.99984,1.09373-1.99969,2.5-2.99954,3.49995A194.83046,194.83046,0,1,1,57.085,179.41009c.99985-1,2.40588-2,3.49947-3,61.59994-59.90549,171.97367-120.40473,214.37343-142.4982a16.058,16.058,0,0,1,22.90274,9.49988c1.59351,5.09368,3.49947,11.5936,5.5929,18.59351C379.34818,35.00565,452.43074,12.30281,491.12794.70921A16.18325,16.18325,0,0,1,511.328,20.8027ZM319.951,320.00207A127.98041,127.98041,0,1,0,191.97061,448.00046,127.97573,127.97573,0,0,0,319.951,320.00207Zm-127.98041-31.9996a31.9951,31.9951,0,1,1-31.9951-31.9996A31.959,31.959,0,0,1,191.97061,288.00247Zm31.9951,79.999a15.99755,15.99755,0,1,1-15.99755-15.9998A16.04975,16.04975,0,0,1,223.96571,368.00147Z" />
        </svg>
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
      </div>
      <div className="chat-container">
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
    </>
  );
};
