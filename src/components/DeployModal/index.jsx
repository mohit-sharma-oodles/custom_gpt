import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { axios_instance } from "../../Axios/axiosInstance";

// Assets
import { IoRocketOutline } from "react-icons/io5";
import { AiOutlineCode } from "react-icons/ai";
import { GrCopy } from "react-icons/gr";
import { MdOutlineEmail, MdShare } from "react-icons/md";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { TbMoodEdit } from "react-icons/tb";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import { SiLivechat } from "react-icons/si";
import { GoCopilot } from "react-icons/go";
import { RiAiGenerate } from "react-icons/ri";

const DeployModal = ({
  changesMade,
  isOpen,
  onClose,
  embedCode,
  projectId,
  defaultOpen = "deploy",
  setChangesMade,
  placeholderPrompt,
  setPlaceholderPrompt,
  responseSource,
  setResponseSource,
  backgroundImage,
  setBackgroundImage,
  noAnswerMessage,
  setNoAnswerMessage,
}) => {
  const [activeTab, setActiveTab] = useState(defaultOpen);
  const [loading, setLoading] = useState(false);

  // Customisation
  const [chatbotName, setChatbotName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [loadingIndicatorText, setLoadingIndicatorText] = useState("");

  // Agent Settings
  const [persona, setPersona] = useState("");

  // Customisation

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultOpen); // Update activeTab when modal opens
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, defaultOpen]);

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

  const handleShreLinkCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `https://chattodata.com/app/project/${projectId}/chat`
      );
      alert("Share link copied to clipboard!");
    } catch (err) {
      alert("Failed to copy share link.");
    }
  };

  // const copyLinkToClipboard = () => {
  //   const dynamicLink = `https://customgpt-f.oodleslab.com/app/project/${projectId}/chat`;

  //   navigator.clipboard
  //     .writeText(dynamicLink)
  //     .then(() => {
  //       alert("Link copied to clipboard!");
  //     })
  //     .catch((err) => {
  //       console.error("Failed to copy the link: ", err);
  //     });
  // };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      if (
        !avatar &&
        !chatbotName &&
        !persona &&
        !placeholderPrompt &&
        !backgroundImage &&
        !noAnswerMessage
      ) {
        alert("Please enter at least one field to save settings");
        return;
      }
      const formData = new FormData();
      if (avatar) {
        formData.append("chat_bot_avatar", avatar);
      }
      // if (chatbotName) {
      //   formData.append("project_name", chatbotName);
      // }
      if (persona) {
        formData.append("persona_instructions", persona);
      }
      if (placeholderPrompt) {
        formData.append("default_prompt", placeholderPrompt);
      }
      if (backgroundImage) {
        formData.append("chat_bot_bg", backgroundImage);
      }
      if (noAnswerMessage) {
        formData.append("no_answer_message", noAnswerMessage);
      }
      formData.append("response_source", responseSource);

      const response = await axios_instance.post(
        `/api/customgpt/projects/update/settings/${projectId}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert("Settings saved!");
        setChangesMade(true);
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
            {/*  */}
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
            {/*  */}
            <HiOutlineCog6Tooth style={{ marginLeft: "20px" }} size={20} />
            <p
              onClick={() => setActiveTab("settings")}
              style={{
                cursor: "pointer",
                fontWeight: activeTab === "settings" ? "bold" : "normal",
              }}
            >
              Agent Settings
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
                  <GrCopy /> Copy and Paste
                </p>
                <p style={{ fontSize: "14px", fontWeight: 400 }}>
                  Copy the following code and paste it into your site’s{" "}
                  {"< body >"} section, where you want to include the features..
                </p>
                <p style={{ marginTop: "12px", marginBottom: "12px" }}>
                  <AiOutlineCode /> Embed
                </p>
                <p style={{ fontSize: "14px", fontWeight: 400 }}>
                  Place your chatbot inside your webpage and it is ideal for all
                  the webpages and FAQ Section. Keeps user engaged with page
                  content along with answering all their queries.
                </p>
                {/* <p style={{ fontSize: "14px", fontWeight: 400 }}>
                  Copy the following code and paste it in your site’s{" "}
                  <code>&lt;body&gt;</code> section, where you want to use your
                  chatbot.
                </p> */}
                <textarea readOnly value={embedCode} />
                <p style={{ marginTop: "12px", marginBottom: "12px" }}>
                  <SiLivechat /> Live Chat
                </p>
                <p style={{ fontSize: "14px", fontWeight: 400 }}>
                  Agent will open when user clicks on icon in the corner of the
                  screen. It is most effective for general inquiries, quick
                  customer support, or pre-sales questions while browsing the
                  site.{" "}
                </p>
                <textarea
                  readOnly
                  value={`https://customgpt-f.oodleslab.com/app/project/${projectId}/chat +++++ need to get the link from backend`}
                />
                {/*  */}
                <p style={{ marginTop: "12px", marginBottom: "12px" }}>
                  <GoCopilot /> Website Copilot
                </p>
                <p style={{ fontSize: "14px", fontWeight: 400 }}>
                  Button to open agent which can be placed anywhere on the
                  webpage. It provides a balance between visibility and user
                  control over the interaction, allowing for deep dives into
                  conversations when the user is ready.{" "}
                </p>
                <textarea
                  readOnly
                  value={`https://customgpt-f.oodleslab.com/app/project/${projectId}/chat+++++ need to get the link from backend`}
                />
                {/*  */}
                <p style={{ marginTop: "12px", marginBottom: "12px" }}>
                  <RiAiGenerate /> Search Generative Experience
                </p>
                <p style={{ fontSize: "14px", fontWeight: 400 }}>
                  Embed agent on your search results page to get Search
                  Generative Experience — a new way to search your website with
                  Generative AI. This gives your users much better responses
                  than classic search, as your agent is able to provide quality
                  and digested responses, together with sources.{" "}
                </p>
                <textarea
                  readOnly
                  value={`https://customgpt-f.oodleslab.com/app/project/${projectId}/chat+++++ need to get the link from backend`}
                />
                {/*  */}

                <p style={{ marginTop: "12px", marginBottom: "12px" }}>
                  <MdShare /> Share your chatbot
                </p>
                <p style={{ fontSize: "14px", fontWeight: 400 }}>
                  Please copy the following link and share it with your
                  colleagues so they can use this chatbot.{" "}
                </p>
                <textarea
                  readOnly
                  value={`https://customgpt-f.oodleslab.com/app/project/${projectId}/chat`}
                />

                {/* <p style={{ marginTop: "12px", marginBottom: "12px" }}>
                  <MdShare /> Share your chatbot
                </p> */}
                {/* <p style={{ fontSize: "14px", fontWeight: 400 }}>
                  Please copy the following link and share it with your
                  colleagues so they can use this chatbot.{" "}
                </p>
                <textarea
                  readOnly
                  value={`https://customgpt-f.oodleslab.com/app/project/${projectId}/chat`}
                /> */}
                <div className={styles.buttons}>
                  <button onClick={copyToClipboard}>
                    <GrCopy />
                    Copy Embeding Link
                  </button>
                  <button>
                    <MdOutlineEmail />
                    Email Link
                  </button>
                  <button onClick={handleShreLinkCopy}>
                    <MdShare />
                    Copy Share Link
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
                    <label htmlFor="avatar">Chatbot Background:</label>
                    <input
                      type="file"
                      name="background"
                      id="backgound"
                      accept="image/*"
                      onChange={(e) => {
                        setBackgroundImage(e.target.files[0]);
                        console.log(backgroundImage);
                      }}
                    />
                    <div
                      style={{
                        backgroundImage: `url(${backgroundImage})`,
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  {/* Placeholder Prompt */}
                  <div className={styles.input_wrapper}>
                    <label
                      htmlFor="responseOption"
                      style={{
                        fontSize: "16px",
                        fontWeight: 400,
                        // display: "flex",
                        // alignItems: "center",
                        // flexGrow: 0,
                      }}
                    >
                      Placeholder Prompt :
                    </label>
                    <input
                      type="text"
                      placeholder={placeholderPrompt}
                      onChange={(e) => setPlaceholderPrompt(e.target.value)}
                    />
                  </div>
                  {/* <div style={{ display: "flex", gap: "16px" }}>
                    <label htmlFor="chatbot_name">Chatbot Name:</label>
                    <input
                      type="text"
                      placeholder="Please Enter a Name"
                      id="chatbot_name"
                      value={chatbotName}
                      onChange={(e) => setChatbotName(e.target.value)}
                    />
                  </div> */}
                  {/* <div style={{ display: "flex", gap: "16px" }}>
                    <label htmlFor="chatbot_name">Loading Indicator</label>
                    <input
                      type="text"
                      placeholder="Please Enter a Name"
                      id="chatbot_name"
                      value={loadingIndicatorText}
                      onChange={(e) => setLoadingIndicatorText(e.target.value)}
                    />
                  </div> */}
                  {/* <div style={{ display: "flex", gap: "16px" }}>
                    <label htmlFor="chatbot_name">Place Holder Prompt:</label>
                    <input
                      type="text"
                      placeholder={placeholderPrompt}
                      id="placeholder_prompt"
                      // value={placeholderPrompt}
                      onChange={(e) => setPlaceholderPrompt(e.target.value)}
                    />
                  </div> */}
                </div>
              </div>
              <div className={styles.buttons}>
                <button onClick={handleSaveSettings} disabled={loading}>
                  {loading ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </>
          )}
          {activeTab === "settings" && (
            <>
              <div className={styles.top}>
                <IoIosInformationCircleOutline />
                <h2>Customize your agent</h2>
              </div>
              <div className={styles.bottom}>
                <p>
                  Customize your agent behavior to control its personality
                  traits and role to fit your use case.
                </p>
                <div className={styles.personaSettings__Area}>
                  {/* Persona */}
                  <label
                    htmlFor="persona"
                    style={{
                      fontSize: "16px",
                      fontWeight: 400,
                      // display: "flex",
                      // alignItems: "center",
                      // flexGrow: 0,
                    }}
                  >
                    Agent Persona:
                    <textarea
                      name=""
                      value={persona}
                      placeholder="Please describe your agent's peronality."
                      onChange={(e) => setPersona(e.target.value)}
                      id="persona"
                    ></textarea>
                  </label>

                  {/* Response option */}
                  <div className={styles.input_wrapper}>
                    <label
                      htmlFor="responseOption"
                      style={{
                        fontSize: "16px",
                        fontWeight: 400,
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      Response Source{" "}
                      <abbr
                        style={{
                          textDecoration: "none",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        title="You can alter the source of responses."
                      >
                        {" "}
                        <IoIosInformationCircleOutline />{" "}
                      </abbr>{" "}
                      :
                    </label>
                    <select
                      id="responseOption"
                      value={responseSource}
                      onChange={(e) => setResponseSource(e.target.value)}
                    >
                      <option value="own_content">My Content</option>
                      <option value="openai_content">
                        My Content + General Knowledge
                      </option>
                    </select>
                  </div>

                  {/*  */}
                  <div className={styles.input_wrapper}>
                    <label
                      htmlFor="citationOption"
                      style={{
                        fontSize: "16px",
                        fontWeight: 400,
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      Show Citations{" "}
                      <abbr
                        style={{
                          textDecoration: "none",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        title="You can choose whether to show the source of outcome or not."
                      >
                        {" "}
                        <IoIosInformationCircleOutline />{" "}
                      </abbr>{" "}
                      :
                    </label>
                    <select
                      id="citationOption"
                      value={responseSource}
                      onChange={(e) => setResponseSource(e.target.value)}
                    >
                      <option value="3">Show citations</option>
                      <option value="0">Don't show citations</option>
                    </select>
                  </div>
                  {/* I dont know message */}
                  <div className={styles.input_wrapper}>
                    <label
                      htmlFor="idontknowmessage"
                      style={{
                        fontSize: "16px",
                        fontWeight: 400,
                        whiteSpace: "nowrap",
                        // flexGrow: 0,
                      }}
                    >
                      I don't know message :
                    </label>
                    <input
                      type="text"
                      id="idontknowmessage"
                      placeholder={noAnswerMessage}
                      onChange={(e) => setNoAnswerMessage(e.target.value)}
                    />
                  </div>
                  {/* I dont know message */}
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
