import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import axios from "axios"; // Import axios

// Assets
import { IoRocketOutline } from "react-icons/io5";
import { AiOutlineCode } from "react-icons/ai";
import { GrCopy } from "react-icons/gr";
import { MdOutlineEmail } from "react-icons/md";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { TbMoodEdit } from "react-icons/tb";
import { axios_instance } from "../../Axios/axiosInstance";

const DeployModal = ({ isOpen, onClose, embedCode, projectId }) => {
  const [activeTab, setActiveTab] = useState("deploy");
  const [avatar, setAvatar] = useState(null);
  const [chatbotName, setChatbotName] = useState("");
  const [loading, setLoading] = useState(false);

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

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    e.stopPropagation();
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      alert("Embed code copied to clipboard!");
    } catch (err) {
      alert("Failed to copy embed code.");
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      if (avatar) {
        formData.append("chat_bot_avatar", avatar);
      }
      if (chatbotName) {
        formData.append("project_name", chatbotName);
      }

      console.log(projectId);
      const response = await axios_instance.post(
        `/api/customgpt/projects/update/${projectId}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);

      if (response.status === 200) {
        alert("Settings saved!");
      } else {
        alert(
          `Failed to save settings: ${response.statusText || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.data) {
        alert(`An error occurred: ${error.response.data.message}`);
      } else {
        alert("An error occurred while saving settings.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <div className={styles.left}>
            <IoRocketOutline size={20} />
            <p
              onClick={() => setActiveTab("deploy")}
              style={{
                cursor: "pointer",
                fontWeight: activeTab === "deploy" ? "bold" : "normal",
              }}
            >
              Deploy
            </p>
            <TbMoodEdit style={{ marginLeft: "20px" }} size={20} />
            <p
              onClick={() => setActiveTab("customise")}
              style={{
                cursor: "pointer",
                fontWeight: activeTab === "customise" ? "bold" : "normal",
              }}
            >
              Customise
            </p>
          </div>
          <button className={styles.modalClose} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={styles.modalBody}>
          {activeTab === "deploy" && (
            <>
              <div className={styles.top}>
                <IoIosInformationCircleOutline />
                <h2>Your Project</h2>
              </div>
              <div className={styles.bottom}>
                <p>
                  <AiOutlineCode /> Embed
                </p>
                <p style={{ fontSize: "14px", fontWeight: 400 }}>
                  Place your chatbot inside your webpage and it is ideal for all
                  the webpages and FAQ Section. Keeps user engaged with page
                  content along with answering all their queries.
                </p>
                <p style={{ marginTop: "12px", marginBottom: "12px" }}>
                  <GrCopy /> Copy and Paste
                </p>
                <p style={{ fontSize: "14px", fontWeight: 400 }}>
                  Copy the following code and paste it in your site’s{" "}
                  <code>&lt;body&gt;</code> section, where you want to use your
                  chatbot.
                </p>
                <textarea readOnly value={embedCode} />
                <div className={styles.buttons}>
                  <button onClick={copyToClipboard}>
                    <GrCopy />
                    Copy Link
                  </button>
                  <button>
                    <MdOutlineEmail />
                    Email Link
                  </button>
                </div>
              </div>
            </>
          )}
          {activeTab === "customise" && (
            <>
              <div className={styles.top}>
                <IoIosInformationCircleOutline />
                <h2>Customise Your Project</h2>
              </div>
              <div className={styles.bottom}>
                <p>
                  Customize the appearance of your chatbot to better fit your
                  website and brand.
                </p>
                <div className={styles.input__Container}>
                  <div style={{ display: "flex", gap: "16px" }}>
                    <label htmlFor="avatar">Chatbot Avatar:</label>
                    <input
                      type="file"
                      name="avatar"
                      id="avatar"
                      accept="image/*"
                      onChange={(e) => setAvatar(e.target.files[0])}
                    />
                  </div>
                  <div style={{ display: "flex", gap: "16px" }}>
                    <label htmlFor="chatbot_name">Chatbot Name:</label>
                    <input
                      type="text"
                      placeholder="Please Enter a Name"
                      id="chatbot_name"
                      value={chatbotName}
                      onChange={(e) => setChatbotName(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.buttons}>
                <button onClick={handleSaveSettings} disabled={loading}>
                  {loading ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeployModal;
