import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { axios_instance } from "../../Axios/axiosInstance";

// Assets
import { IoRocketOutline } from "react-icons/io5";
import { AiOutlineCode } from "react-icons/ai";
import { GrCopy } from "react-icons/gr";
import {
  MdOutlineEmail,
  MdShare,
  MdOutlineIntegrationInstructions,
} from "react-icons/md";
import { IoIosInformationCircleOutline, IoLogoWordpress } from "react-icons/io";
import { TbMoodEdit } from "react-icons/tb";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import { SiLivechat } from "react-icons/si";
import { GoCopilot } from "react-icons/go";
import { RiAiGenerate } from "react-icons/ri";
import { toast } from "react-toastify";

const languages = [
  { code: "sq", name: "Albanian" },
  { code: "ar", name: "Arabic" },
  { code: "hy", name: "Armenian" },
  { code: "az", name: "Azerbaijani" },
  { code: "ba", name: "Bashkir" },
  { code: "eu", name: "Basque" },
  { code: "be", name: "Belarusian" },
  { code: "bn", name: "Bengali" },
  { code: "bh", name: "Bihari" },
  { code: "bs", name: "Bosnian" },
  { code: "pt-BR", name: "Portuguese (Brazil)" },
  { code: "bg", name: "Bulgarian" },
  { code: "yue", name: "Cantonese" },
  { code: "ca", name: "Catalan" },
  { code: "hne", name: "Chhattisgarhi" },
  { code: "hr", name: "Croatian" },
  { code: "cs", name: "Czech" },
  { code: "da", name: "Danish" },
  { code: "doi", name: "Dogri" },
  { code: "nl", name: "Dutch" },
  { code: "en", name: "English" },
  { code: "et", name: "Estonian" },
  { code: "fo", name: "Faroese" },
  { code: "fi", name: "Finnish" },
  { code: "fr", name: "French" },
  { code: "gl", name: "Galician" },
  { code: "ka", name: "Georgian" },
  { code: "de", name: "German" },
  { code: "el", name: "Greek" },
  { code: "gu", name: "Gujarati" },
  { code: "hry", name: "Haryanvi" },
  { code: "he", name: "Hebrew" },
  { code: "hi", name: "Hindi" },
  { code: "hu", name: "Hungarian" },
  { code: "id", name: "Indonesian" },
  { code: "ga", name: "Irish" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "jv", name: "Javanese" },
  { code: "kn", name: "Kannada" },
  { code: "ks", name: "Kashmiri" },
  { code: "kk", name: "Kazakh" },
  { code: "kok", name: "Konkani" },
  { code: "ko", name: "Korean" },
  { code: "ky", name: "Kyrgyz" },
  { code: "lv", name: "Latvian" },
  { code: "lt", name: "Lithuanian" },
  { code: "mk", name: "Macedonian" },
  { code: "mai", name: "Maithili" },
  { code: "ms", name: "Malay" },
  { code: "mt", name: "Maltese" },
  { code: "cmn", name: "Mandarin" },
  { code: "mr", name: "Marathi" },
  { code: "mwr", name: "Marwari" },
  { code: "nan", name: "Min Nan" },
  { code: "mo", name: "Moldavian" },
  { code: "mn", name: "Mongolian" },
  { code: "me", name: "Montenegrin" },
  { code: "ne", name: "Nepali" },
  { code: "no", name: "Norwegian" },
  { code: "or", name: "Odia" },
  { code: "ps", name: "Pashto" },
  { code: "fa", name: "Persian" },
  { code: "pl", name: "Polish" },
  { code: "pt", name: "Portuguese" },
  { code: "pa", name: "Punjabi" },
  { code: "raj", name: "Rajasthani" },
  { code: "ro", name: "Romanian" },
  { code: "ru", name: "Russian" },
  { code: "sa", name: "Sanskrit" },
  { code: "sat", name: "Santali" },
  { code: "sr", name: "Serbian" },
  { code: "sd", name: "Sindhi" },
  { code: "si", name: "Sinhala" },
  { code: "sk", name: "Slovak" },
  { code: "sl", name: "Slovenian" },
  { code: "es", name: "Spanish" },
  { code: "sw", name: "Swahili" },
  { code: "sv", name: "Swedish" },
  { code: "tg", name: "Tajik" },
  { code: "ta", name: "Tamil" },
  { code: "tt", name: "Tatar" },
  { code: "te", name: "Telugu" },
  { code: "th", name: "Thai" },
  { code: "tr", name: "Turkish" },
  { code: "tk", name: "Turkmen" },
  { code: "uk", name: "Ukrainian" },
  { code: "ur", name: "Urdu" },
  { code: "uz", name: "Uzbek" },
  { code: "vi", name: "Vietnamese" },
  { code: "cy", name: "Welsh" },
  { code: "wuu", name: "Wu Chinese" },
];

const DeployModal = ({
  changesMade,
  isOpen,
  onClose,
  embedCode,
  liveChatCode,
  WebsiteCopilotCode,
  SGECode,
  projectId,
  projectKey,
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
  chatbot_model,
  setChatbot_model,
  reCaptcha,
  setReCaptcha,
  selectedLanguage,
  setSelectedLanguage,
  enableCitations,
  setEnableCitations,
  chatbotBubbleColor,
  setChatbotBubbleColor,
  toolbarColor,
  setToolbarColor,
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

  const copyToClipboardIntegrations = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Copied to clipboard!"))
      .catch((err) => toast.error("Failed to copy text"));
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
      if (chatbotBubbleColor) {
        formData.append("chatbot_color", chatbotBubbleColor);
      }
      if (toolbarColor) {
        formData.append("chatbot_toolbar_color", toolbarColor);
      }
      // if (chatbot_model) {
      //   formData.append("chatbot_model", chatbot_model);
      // }
      formData.append("enable_citations", enableCitations);
      formData.append("response_source", responseSource);
      formData.append("chatbot_msg_lang", selectedLanguage);
      formData.append("enable_recaptcha_for_public_chatbots", reCaptcha);

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
            {/*  */}
            <HiOutlineCog6Tooth style={{ marginLeft: "20px" }} size={20} />
            <p
              onClick={() => setActiveTab("security")}
              style={{
                cursor: "pointer",
                fontWeight: activeTab === "security" ? "bold" : "normal",
              }}
            >
              Security Settings
            </p>
            {/*  */}
            <MdOutlineIntegrationInstructions
              style={{ marginLeft: "20px" }}
              size={20}
            />
            <p
              onClick={() => setActiveTab("integrations")}
              style={{
                cursor: "pointer",
                fontWeight: activeTab === "integrations" ? "bold" : "normal",
              }}
            >
              Integrations
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
                  {"<body>"} section, where you want to include the features.
                </p>
                <p style={{ marginTop: "12px", marginBottom: "12px" }}>
                  <AiOutlineCode /> Embed
                </p>
                <p style={{ fontSize: "14px", fontWeight: 400 }}>
                  Place your chatbot inside your webpage and it is ideal for all
                  the webpages and FAQ Section. Keeps user engaged with page
                  content along with answering all their queries.
                </p>
                <textarea readOnly value={embedCode} />
                <p style={{ marginTop: "12px", marginBottom: "12px" }}>
                  <SiLivechat /> Live Chat
                </p>
                <p style={{ fontSize: "14px", fontWeight: 400 }}>
                  Agent will open when user clicks on icon in the corner of the
                  screen. It is most effective for general inquiries, quick
                  customer support, or pre-sales questions while browsing the
                  site.
                </p>
                <textarea readOnly value={liveChatCode} />
                {/*  */}
                <p style={{ marginTop: "12px", marginBottom: "12px" }}>
                  <GoCopilot /> Website Copilot
                </p>
                <p style={{ fontSize: "14px", fontWeight: 400 }}>
                  Button to open agent which can be placed anywhere on the
                  webpage. It provides a balance between visibility and user
                  control over the interaction, allowing for deep dives into
                  conversations when the user is ready.
                </p>
                <textarea readOnly value={WebsiteCopilotCode} />
                {/*  */}
                <p style={{ marginTop: "12px", marginBottom: "12px" }}>
                  <RiAiGenerate /> Search Generative Experience
                </p>
                <p style={{ fontSize: "14px", fontWeight: 400 }}>
                  Embed agent on your search results page to get Search
                  Generative Experience — a new way to search your website with
                  Generative AI. This gives your users much better responses
                  than classic search, as your agent is able to provide quality
                  and digested responses, together with sources.
                </p>
                <textarea readOnly value={SGECode} />
                {/*  */}

                <p style={{ marginTop: "12px", marginBottom: "12px" }}>
                  <MdShare /> Share your chatbot
                </p>
                <p style={{ fontSize: "14px", fontWeight: 400 }}>
                  Please copy the following link and share it with your
                  colleagues so they can use this chatbot.
                </p>
                <textarea
                  readOnly
                  value={`https://chattodata.com/app/project/${projectId}/chat`}
                />

                <div className={styles.buttons}>
                  <button onClick={copyToClipboard}>
                    <GrCopy />
                    Copy Embedding Link
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
                  <div className={styles.input_wrapper}>
                    <label htmlFor="avatar">Chatbot Avatar:</label>
                    <input
                      type="file"
                      name="avatar"
                      id="avatar"
                      accept="image/*"
                      onChange={(e) => setAvatar(e.target.files[0])}
                    />
                  </div>
                  <div className={styles.input_wrapper}>
                    <label htmlFor="background">Chatbot Background:</label>
                    <input
                      type="file"
                      name="background"
                      id="background"
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
                  {/* I don't know message */}
                  <div className={styles.input_wrapper}>
                    <label
                      style={{ width: "12%" }}
                      className={styles.label}
                      htmlFor="noAnswerMessage"
                    >
                      I don't know message:
                    </label>
                    <input
                      type="text"
                      id="noAnswerMessage"
                      placeholder={noAnswerMessage}
                      onChange={(e) => setNoAnswerMessage(e.target.value)}
                    />
                  </div>
                  {/* Placeholder Prompt */}
                  <div className={styles.input_wrapper}>
                    <label htmlFor="placeholderPrompt">
                      Placeholder Prompt:
                    </label>
                    <input
                      type="text"
                      id="placeholderPrompt"
                      placeholder={placeholderPrompt}
                      onChange={(e) => setPlaceholderPrompt(e.target.value)}
                    />
                  </div>
                  <div className={styles.input_wrapper}>
                    <label htmlFor="languageOption">Agent Language:</label>
                    <select
                      id="languageOption"
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                    >
                      {languages.map((language) => (
                        <option key={language.code} value={language.code}>
                          {language.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Chatbot bubble color */}
                  <div className={styles.input_wrapper}>
                    <label htmlFor="chatbot_bubble_color">
                      Chatbot Bubble Color:
                    </label>

                    <input
                      id="chatbot_bubble_color"
                      value={chatbotBubbleColor}
                      onChange={(e) => setChatbotBubbleColor(e.target.value)}
                      type="color"
                    />
                  </div>
                  {/* Chatbot toolbar color */}
                  <div className={styles.input_wrapper}>
                    <label htmlFor="chatbot_toolbar_color">
                      Chatbot Toolbar Color:
                    </label>

                    <input
                      id="chatbot_toolbar_color"
                      value={toolbarColor}
                      onChange={(e) => setToolbarColor(e.target.value)}
                      type="color"
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
                <div
                  className={
                    (styles.personaSettings__Area, styles.input__Container)
                  }
                >
                  {/* Persona */}
                  <div className={styles.input_wrapper}>
                    <label
                      style={{ width: "12%" }}
                      className={styles.label}
                      htmlFor="persona"
                    >
                      Agent Persona:
                    </label>
                    <textarea
                      style={{ width: "20%" }}
                      id="persona"
                      value={persona}
                      placeholder="Please describe your agent's personality."
                      onChange={(e) => setPersona(e.target.value)}
                    ></textarea>
                  </div>

                  {/* Response option */}
                  <div className={styles.input_wrapper}>
                    <label
                      style={{ width: "12%" }}
                      className={styles.label}
                      htmlFor="responseOption"
                    >
                      Response Source:
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

                  {/* Citation Option */}
                  <div className={styles.input_wrapper}>
                    <label
                      style={{ width: "12%" }}
                      className={styles.label}
                      htmlFor="citationOption"
                    >
                      Show Citations:
                    </label>
                    <select
                      id="citationOption"
                      value={enableCitations}
                      onChange={(e) => setEnableCitations(e.target.value)}
                    >
                      <option value="0">Don't display citations</option>
                      <option value="1">After agent's response</option>
                      <option value="2">
                        Numbered references inside agent's response
                      </option>
                      <option value="3">
                        After the agent's response + Numbered references
                      </option>
                    </select>
                  </div>

                  {/* GPT Model Choice */}
                  <div className={styles.input_wrapper}>
                    <label
                      style={{ width: "12%" }}
                      className={styles.label}
                      htmlFor="chatbot_model"
                    >
                      Select your GPT Model:
                    </label>
                    <select
                      id="chatbot_model"
                      value={chatbot_model}
                      onChange={(e) => setChatbot_model(e.target.value)}
                    >
                      <option value="gpt-4-o">GPT 4o</option>
                      <option value="gpt-4-turbo">GPT 4 Turbo</option>
                      <option value="gpt-4">GPT 4</option>
                      <option value="gpt-4o-mini">GPT 4o Mini</option>
                      <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                      <option value="claude-3.5-sonnet">
                        Claude 3.5 Sonnet
                      </option>
                      <option value="fast_response">Fast Response</option>
                    </select>
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
          {activeTab === "security" && (
            <>
              <div className={styles.top}>
                <IoIosInformationCircleOutline />
                <h2>Customize your agent settings</h2>
              </div>
              <div className={styles.bottom}>
                <p>
                  Customize your agent behavior to control its personality
                  traits and role to fit your use case.
                </p>
                <div
                  className={
                    (styles.personaSettings__Area, styles.input__Container)
                  }
                >
                  {/* Anti Hallucination */}
                  <div className={styles.input_wrapper}>
                    <label style={{ width: "11%" }} htmlFor="antiHallucination">
                      Anti Hallucination:
                    </label>
                    <select
                      id="antiHallucination"
                      // value={antiHallucination}
                      // onChange={(e) => setAntiHallucination(e.target.value)}
                    >
                      <option value="true">Enable</option>
                      <option value="false" disabled>
                        Disable
                      </option>
                    </select>
                  </div>
                  {/* reCAPTCHA */}
                  <div className={styles.input_wrapper}>
                    <label style={{ width: "11%" }} htmlFor="reCaptcha">
                      reCAPTCHA:
                    </label>
                    <select
                      id="reCaptcha"
                      value={reCaptcha}
                      onChange={(e) => setReCaptcha(e.target.value)}
                    >
                      <option value="true">Enable</option>
                      <option value="false">Disable</option>
                    </select>
                  </div>
                  {/* Whitelisted Domains */}
                  <div className={styles.input_wrapper}>
                    <label
                      style={{ width: "11%" }}
                      htmlFor="whitelistedDomains"
                    >
                      Whitelisted Domains:
                    </label>
                    <textarea
                      style={{ width: "20%" }}
                      id="whitelistedDomains"
                      // value={whitelistedDomains}
                      // onChange={(e) => setWhitelistedDomains(e.target.value)}
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
          {activeTab === "integrations" && (
            <div className={styles.integrations_container}>
              <h2 style={{ display: "flex", alignItems: "center" }}>
                <IoLogoWordpress /> Wordpress Integrations Steps
              </h2>

              <div className={styles.steps_container}>
                {/* Step 1 */}
                <div className={styles.step}>
                  <div className={styles.text}>
                    <h3 className={styles.title}>
                      Step 1: Go to your WordPress Website
                    </h3>
                    <p>
                      Go to your WordPress Website and make sure you’re logged
                      in as an administrator.
                    </p>
                  </div>
                </div>
                {/* Step 2 */}
                <div className={styles.step}>
                  <div className={styles.text}>
                    <h3 className={styles.title}>Step 2: Go to Plugins Page</h3>
                    <p>
                      On the left sidebar find Plugins and click on Add New.
                    </p>
                  </div>
                  <img
                    className={styles.img}
                    src="https://app.customgpt.ai/assets/imgs/integrations/tutorials/wordpress/1.jpg"
                    alt=""
                  />
                </div>
                {/* Step 3 */}
                <div className={styles.step}>
                  <div className={styles.text}>
                    <h3 className={styles.title}>
                      Step 3: Search for CustomGPT.ai plugin
                    </h3>
                    <p>Type “CustomGPT” in the search bar.</p>
                  </div>
                  <img
                    className={styles.img}
                    src="https://app.customgpt.ai/assets/imgs/integrations/tutorials/wordpress/2.jpg"
                    alt=""
                  />
                </div>
                {/* Step 4 */}
                <div className={styles.step}>
                  <div className={styles.text}>
                    <h3 className={styles.title}>
                      Step 4: Activate the Plugin
                    </h3>
                    <p>Once installation is complete, click on Activate.</p>
                  </div>
                  <img
                    className={styles.img}
                    src="https://app.customgpt.ai/assets/imgs/integrations/tutorials/wordpress/3.jpg"
                    alt=""
                  />
                </div>
                {/* Step 5 */}
                <div className={styles.step}>
                  <div className={styles.text}>
                    <h3 className={styles.title}>Step 5: Open the Plugin</h3>
                    <p>
                      Once the plugin is activated, go to the left sidebar,
                      navigate to Settings and select CustomGPT.ai
                    </p>
                  </div>
                  <img
                    className={styles.img}
                    src="https://app.customgpt.ai/assets/imgs/integrations/tutorials/wordpress/4.jpg"
                    alt=""
                  />
                </div>
                {/* Step 6 */}
                <div className={styles.step}>
                  <div className={styles.text}>
                    <h3 className={styles.title}>
                      Step 6: Enter Project Details
                    </h3>
                    <p style={{ marginBottom: "1rem" }}>
                      Enter these two values:
                    </p>
                    <div style={{ marginBottom: "0.7rem" }}>
                      <label htmlFor="projectId">Project ID:</label>
                      <input
                        style={{ marginLeft: "29px" }}
                        disabled
                        type="text"
                        id="projectId"
                        value={projectId}
                      />
                      <button
                        className={styles.copyButton}
                        onClick={() => copyToClipboardIntegrations(projectId)}
                      >
                        Copy
                      </button>
                    </div>
                    <div>
                      <label htmlFor="projectKey">Project Key:</label>
                      <input
                        style={{ marginLeft: "16px" }}
                        disabled
                        type="text"
                        id="projectKey"
                        value={projectKey}
                      />
                      <button
                        className={styles.copyButton}
                        onClick={() => copyToClipboardIntegrations(projectKey)}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <img
                    className={styles.img}
                    src="https://app.customgpt.ai/assets/imgs/integrations/tutorials/wordpress/5.jpg"
                    alt=""
                  />
                </div>
                {/* Step 7 */}
                <div className={styles.step}>
                  <div className={styles.text}>
                    <h3 className={styles.title}>
                      Step 7: After you’re done, click Save Changes.
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeployModal;
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// import React, { useEffect, useState } from "react";
// import styles from "./index.module.scss";
// import { axios_instance } from "../../Axios/axiosInstance";

// // Assets
// import { IoRocketOutline } from "react-icons/io5";
// import { AiOutlineCode } from "react-icons/ai";
// import { GrCopy } from "react-icons/gr";
// import { MdOutlineEmail, MdShare } from "react-icons/md";
// import { IoIosInformationCircleOutline } from "react-icons/io";
// import { TbMoodEdit } from "react-icons/tb";

// const DeployModal = ({
//   isOpen,
//   onClose,
//   embedCode,
//   projectId,
//   defaultOpen = "deploy",
//   setChangesMade,
// }) => {
//   const [activeTab, setActiveTab] = useState(defaultOpen);
//   const [avatar, setAvatar] = useState(null);
//   const [chatbotName, setChatbotName] = useState("");
//   const [loading, setLoading] = useState(false);
//   console.log(defaultOpen, activeTab, projectId);

//   useEffect(() => {
//     if (isOpen) {
//       setActiveTab(defaultOpen); // Update activeTab when modal opens
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "unset";
//     }

//     return () => {
//       document.body.style.overflow = "unset";
//     };
//   }, [isOpen, defaultOpen]);

//   if (!isOpen) return null;

//   const handleOverlayClick = (e) => {
//     e.stopPropagation();
//   };

//   const copyToClipboard = async () => {
//     try {
//       await navigator.clipboard.writeText(embedCode);
//       alert("Embed code copied to clipboard!");
//     } catch (err) {
//       alert("Failed to copy embed code.");
//     }
//   };
//   const handleShreLinkCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(
//         `https://chattodata.com/app/project/${projectId}/chat`
//       );
//       alert("Share link copied to clipboard!");
//     } catch (err) {
//       alert("Failed to copy share link.");
//     }
//   };

//   // const handleEmailClick = () => {
//   //   const recipient = localStorage.getItem("user").email;
//   //   const subject = encodeURIComponent("Hey There, check this out!");
//   //   const body = encodeURIComponent(
//   //     `This is the message I want to include in the email body. ${projectId}`
//   //   );
//   //   // Construct the mailto link
//   //   const mailtoLink = `mailto:${recipient}?subject=${subject}&body=${body}`;
//   //   const link = document.createElement("a");
//   //   link.href = mailtoLink;

//   //   // Simulate a click to open in a new tab
//   //   link.target = "_blank"; // Opens in a new tab
//   //   link.click();
//   // };

//   // const copyLinkToClipboard = () => {
//   //   const dynamicLink = `https://customgpt-f.oodleslab.com/app/project/${projectId}/chat`;

//   //   navigator.clipboard
//   //     .writeText(dynamicLink)
//   //     .then(() => {
//   //       alert("Link copied to clipboard!");
//   //     })
//   //     .catch((err) => {
//   //       console.error("Failed to copy the link: ", err);
//   //     });
//   // };

//   const handleSaveSettings = async () => {
//     setLoading(true);
//     try {
//       if (
//         !avatar
//         // !chatbotName &&
//         // !persona &&
//         // !placeholderPrompt &&
//         // !backgroundImage &&
//         // !noAnswerMessage
//       ) {
//         alert("Please enter at least one field to save settings");
//         return;
//       }
//       const formData = new FormData();
//       if (avatar) {
//         formData.append("chat_bot_avatar", avatar);
//       }
//       // if (chatbotName) {
//       //   formData.append("project_name", chatbotName);
//       // }
//       // if (persona) {
//       //   formData.append("persona_instructions", persona);
//       // }
//       // if (placeholderPrompt) {
//       //   formData.append("default_prompt", placeholderPrompt);
//       // }
//       // if (backgroundImage) {
//       //   formData.append("chat_bot_bg", backgroundImage);
//       // }
//       // if (noAnswerMessage) {
//       //   formData.append("no_answer_message", noAnswerMessage);
//       // }
//       // formData.append("response_source", responseSource);

//       const response = await axios_instance.post(
//         `/api/customgpt/projects/update/settings/${projectId}/`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (response.status === 200) {
//         alert("Settings saved!");
//         setChangesMade(true);
//       } else {
//         alert(
//           `Failed to save settings: ${response.statusText || "Unknown error"}`
//         );
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       if (error.response && error.response.data) {
//         alert(`An error occurred: ${error.response.data.message}`);
//       } else {
//         alert("An error occurred while saving settings.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles.modalOverlay} onClick={handleOverlayClick}>
//       <div className={styles.modalContent}>
//         <div className={styles.header}>
//           <div className={styles.left}>
//             <IoRocketOutline size={20} />
//             <p
//               onClick={() => setActiveTab("deploy")}
//               style={{
//                 cursor: "pointer",
//                 fontWeight: activeTab === "deploy" ? "bold" : "normal",
//               }}
//             >
//               Deploy
//             </p>
//             <TbMoodEdit style={{ marginLeft: "20px" }} size={20} />
//             <p
//               onClick={() => setActiveTab("customise")}
//               style={{
//                 cursor: "pointer",
//                 fontWeight: activeTab === "customise" ? "bold" : "normal",
//               }}
//             >
//               Customise
//             </p>
//           </div>
//           <button className={styles.modalClose} onClick={onClose}>
//             &times;
//           </button>
//         </div>
//         <div className={styles.modalBody}>
//           {activeTab === "deploy" && (
//             <>
//               <div className={styles.top}>
//                 <IoIosInformationCircleOutline />
//                 <h2>Your Project</h2>
//               </div>
//               <div className={styles.bottom}>
//                 <p>
//                   <AiOutlineCode /> Embed
//                 </p>
//                 <p style={{ fontSize: "14px", fontWeight: 400 }}>
//                   Place your chatbot inside your webpage and it is ideal for all
//                   the webpages and FAQ Section. Keeps user engaged with page
//                   content along with answering all their queries.
//                 </p>
//                 <p style={{ marginTop: "12px", marginBottom: "12px" }}>
//                   <GrCopy /> Copy and Paste
//                 </p>
//                 <p style={{ fontSize: "14px", fontWeight: 400 }}>
//                   Copy the following code and paste it in your site’s{" "}
//                   <code>&lt;body&gt;</code> section, where you want to use your
//                   chatbot.
//                 </p>
//                 <textarea readOnly value={embedCode} />

//                 <p style={{ marginTop: "12px", marginBottom: "12px" }}>
//                   <MdShare /> Share your chatbot
//                 </p>
//                 <p style={{ fontSize: "14px", fontWeight: 400 }}>
//                   Please copy the following link and share it with your
//                   colleagues so they can use this chatbot.{" "}
//                 </p>
//                 <textarea
//                   readOnly
//                   value={`https://chattodata.com/app/project/${projectId}/chat`}
//                 />
//                 <div className={styles.buttons}>
//                   <button onClick={copyToClipboard}>
//                     <GrCopy />
//                     Copy Embeding Link
//                   </button>
//                   {/* <button
//                     onClick={() => {
//                       handleEmailClick();
//                     }}
//                   >
//                     <MdOutlineEmail />
//                     Email Link
//                   </button> */}
//                   <button onClick={handleShreLinkCopy}>
//                     <MdShare />
//                     Copy Share Link
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}
//           {activeTab === "customise" && (
//             <>
//               <div className={styles.top}>
//                 <IoIosInformationCircleOutline />
//                 <h2>Customise Your Project</h2>
//               </div>
//               <div className={styles.bottom}>
//                 <p>
//                   Customize the appearance of your chatbot to better fit your
//                   website and brand.
//                 </p>
//                 <div className={styles.input__Container}>
//                   <div style={{ display: "flex", gap: "16px" }}>
//                     <label htmlFor="avatar">Chatbot Avatar:</label>
//                     <input
//                       type="file"
//                       name="avatar"
//                       id="avatar"
//                       accept="image/*"
//                       onChange={(e) => setAvatar(e.target.files[0])}
//                     />
//                   </div>
//                   <div style={{ display: "flex", gap: "16px" }}>
//                     <label htmlFor="chatbot_name">Chatbot Name:</label>
//                     <input
//                       type="text"
//                       placeholder="Please Enter a Name"
//                       id="chatbot_name"
//                       value={chatbotName}
//                       onChange={(e) => setChatbotName(e.target.value)}
//                     />
//                   </div>
//                 </div>
//               </div>
//               <div className={styles.buttons}>
//                 <button onClick={handleSaveSettings} disabled={loading}>
//                   {loading ? "Saving..." : "Save Settings"}
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DeployModal;
