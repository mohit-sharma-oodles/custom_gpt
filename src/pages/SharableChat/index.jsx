import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import styles from "./index.module.scss";
import { axios_instance } from "../../Axios/axiosInstance";
import logo_small from "../../assets/compnay_icon_small.svg";
import { LuSendHorizonal } from "react-icons/lu";

const SharableChat = () => {
  const { projectId } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [session, setSession] = useState("");
  const messageEndRef = useRef(null);
  const [messageLoading, setMessageLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true); // Added to handle session loading
  const [error, setError] = useState(null);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const getSessionId = async () => {
      try {
        const response = await axios_instance.post(
          `/api/customgpt/projects/conversation/${projectId}/`
        );
        setSession(response.data.session_id);
        setAvatar(response.data.project.avatar_image_url);
      } catch (error) {
        console.log(error);
        setError("Failed to initialize chat session.");
      } finally {
        setSessionLoading(false); // Session initialization complete
      }
    };
    getSessionId();
  }, [projectId]); // Added projectId as a dependency

  const sendMessage = async () => {
    if (inputMessage.trim() === "") return;
    if (!session) {
      console.error("Session not initialized yet.");
      return;
    }

    // Add the user's message to the messages state
    const newMessage = { type: "user", content: inputMessage };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    setMessageLoading(true);
    setInputMessage("");

    try {
      // Make the API call to fetch the server response
      const response = await axios_instance.post(
        `/api/customgpt/projects/${projectId}/chat/${session}/sharablebot/`,
        { prompt: inputMessage }
      );

      // Extract data from the server response
      const { openai_response, url, title } = response.data.message;

      // Create the server response object
      const serverResponse = {
        type: "server",
        content: openai_response,
        url: url || null,
        title: title || null,
      };

      // Add the server response to the messages state
      setMessages((prevMessages) => [...prevMessages, serverResponse]);
    } catch (e) {
      console.log(e);

      // Handle any errors by adding an error message to the messages state
      const errorMessage = {
        type: "server",
        content: "Error fetching response.",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setMessageLoading(false);
    }
  };

  const handleInputChange = (e) => setInputMessage(e.target.value);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (sessionLoading) {
    // Show a loading indicator while session is being initialized
    return <div className={styles.chatContainer}>Initializing chat...</div>;
  }

  if (error) {
    // Show error message if session failed to initialize
    return <div className={styles.chatContainer}>{error}</div>;
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesContainer}>
        <div className={styles.messageList}>
          {messages.map((message, index) => (
            <>
              {message.type === "server" && (
                <img
                  src={avatar ? avatar : logo_small}
                  style={{
                    width: "30px",
                    height: "30px",
                    marginBottom: "10px",
                    borderRadius: "50%",
                  }}
                  alt=""
                />
              )}
              <div
                key={index}
                className={
                  message.type === "user"
                    ? styles.userMessage
                    : styles.serverMessage
                }
              >
                {message.type === "server" ? (
                  <>
                    <div className={styles.markdown_content}>
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                    {message.url && message.title && (
                      <div style={{ marginTop: "10px" }}>
                        &#9432; Related Documents: <br />
                        <a
                          style={{ color: "black" }}
                          href={message.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {message.title}
                        </a>
                      </div>
                    )}
                  </>
                ) : (
                  <p>{message.content}</p>
                )}
              </div>
            </>
          ))}

          {messageLoading && <div className={styles.temp_loader}></div>}
          <div ref={messageEndRef} />
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <div className={styles.inputContainer}>
          <div className={styles.left_side}>
            <input
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              placeholder="Type a message"
              disabled={!session || messageLoading}
            />
          </div>
          <button
            type="submit"
            disabled={!inputMessage.trim() || messageLoading}
            className={styles.sendButton}
          >
            <LuSendHorizonal size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SharableChat;
