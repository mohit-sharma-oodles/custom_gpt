import React, { useEffect } from "react";
import styles from "./index.module.scss";

//assets
import { BsChatDots } from "react-icons/bs";
import { FiLink } from "react-icons/fi";
import placeholder_img from "../../assets/temp_share_chat.png";

const ShareChatModal = ({ isOpen, onClose, projectId, session_id }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const copyLinkToClipboard = () => {
    const dynamicLink = `https://customgpt-f.oodleslab.com/app/project/${projectId}/chat`;

    navigator.clipboard
      .writeText(dynamicLink)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy the link: ", err);
      });
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    e.stopPropagation();
  };
  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <header className={styles.header}>
          <div className={styles.left}>
            <BsChatDots size={20} />
            <p>Share Chat </p>
          </div>
          <button className={styles.modalClose} onClick={onClose}>
            &times;
          </button>
        </header>
        <div className={styles.chatSection}>
          <img
            src={placeholder_img}
            width={"90%"}
            style={{ display: "block", margin: "0 auto" }}
          />
        </div>
        <div className={styles.shareSection}>
          <p>You can copy the link to share the chat with someone else.</p>
          <button className={styles.link_btn} onClick={copyLinkToClipboard}>
            <FiLink /> Copy Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareChatModal;
