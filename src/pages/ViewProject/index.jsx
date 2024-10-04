import React, { useEffect, useState, useRef } from "react";
import styles from "./index.module.scss";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import { axios_instance } from "../../Axios/axiosInstance";
import Sidebar from "../../components/Sidebar";
import PartialHeader from "../../components/PartialHeader";
import { FileUploader } from "react-drag-drop-files";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import ShareChatModal from "../../components/ShareChatModal";
import DeployModal from "../../components/DeployModal";

// Assets
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import {
  IoRocketOutline,
  IoEyeOutline,
  IoCloudUploadOutline,
} from "react-icons/io5";
import { TbSend2 } from "react-icons/tb";
import { MdMicNone } from "react-icons/md";
import { GoUpload, GoShareAndroid } from "react-icons/go";
import { RxFileText } from "react-icons/rx";
import { HiOutlineTrash } from "react-icons/hi2";
import { AiOutlineDelete } from "react-icons/ai";
import logo_small from "../../assets/compnay_icon_small.svg";

// Upload Modal
const UploadDocumentModal = ({ isOpen, onClose, onUpload }) => {
  const [fileSelected, setFileSelected] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (file) => {
    if (fileSelected) {
      alert("You can only upload one file.");
      return;
    }
    setFileSelected(file);
  };

  const handleDeleteFile = () => {
    setFileSelected(null);
  };

  const handleUploadDocument = async () => {
    if (!fileSelected) {
      alert("Please select a file to upload.");
      return;
    }
    setLoading(true); // Set loading to true before upload starts
    try {
      await onUpload(fileSelected); // Assuming onUpload is an async function
    } catch (error) {
      setUploadError("Failed to upload document. Please try again.");
    } finally {
      setLoading(false); // Reset loading state after upload finishes
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2 style={{ fontWeight: "500" }}>Upload Document</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>
        <div style={{ height: "70%", marginBottom: "auto" }}>
          <FileUploader
            handleChange={handleChange}
            name="file"
            multiple={false}
            classes="drop_zone"
          >
            <div className={styles.drop_zone}>
              <IoCloudUploadOutline size={50} color={"lightgrey"} />
              <div className={styles.text_container}>
                <h3>
                  Drag and Drop file or{" "}
                  <span className={styles.browse}>Browse</span>
                </h3>
                <p>Supported formats: PDF, DOC, XLSX, SPREADSHEET, etc.</p>
              </div>
            </div>
          </FileUploader>
        </div>
        {fileSelected && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "80%",
            }}
          >
            <p>{fileSelected.name.split(".").shift()}</p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <p
                style={{
                  width: "fit-content",
                  backgroundColor: "aquamarine",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  textAlign: "center",
                }}
              >
                {fileSelected.name.split(".").pop()}
              </p>
              <button onClick={handleDeleteFile} className={styles.delete_btn}>
                <AiOutlineDelete size={20} color="red" />
              </button>
            </div>
          </div>
        )}

        {uploadError && <p className={styles.error}>{uploadError}</p>}

        <div className={styles.loaderContainer}>
          {loading && <div className={styles.loader}></div>} {/* Loader */}
        </div>

        <button
          className={styles.uploadButton}
          onClick={handleUploadDocument}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
};
// Upload Modal
const ViewProject = () => {
  const { projectId } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [changesMade, setChangesMade] = useState(false);

  const [isModalOpen, setModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [deployModal, setDeployModal] = useState(false);
  const [defaultOpen, setDefaultOpen] = useState("deploy");

  // chatbot
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [messageloading, setMessageLoading] = useState(false);
  const [shareChatModal, setShareChatModal] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [placeholderPrompt, setPlaceholderPrompt] = useState("");
  const [responseSource, setResponseSource] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [noAnswerMessage, setNoAnswerMessage] = useState("");
  const [showCitations, setShowCitations] = useState("");

  const messageEndRef = useRef(null);

  // console.log(projectData?.project[0]?.embeded_code);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const [projectDataResponse, projectSettingsResponse] =
          await Promise.all([
            axios_instance.get(`/api/customgpt/projects/${projectId}/pages/`),
            axios_instance.get(
              `/api/customgpt/projects/update/settings/${projectId}`
            ),
          ]);

        const projectData = projectDataResponse.data;
        setProjectData(projectData);
        // console.log(projectData.project[0]);

        console.log(projectSettingsResponse.data.result.data);
        setAvatar(projectSettingsResponse.data.result.data.chatbot_avatar);
        setNoAnswerMessage(
          projectSettingsResponse.data.result.data.no_answer_message
        );
        setBackgroundImage(
          projectSettingsResponse.data.result.data.chatbot_background
        );
        // console.log(backgroundImage);
        setPlaceholderPrompt(
          projectSettingsResponse.data.result.data.default_prompt
        );
        setResponseSource(
          projectSettingsResponse.data.result.data.response_source
        );
        setLoading(false);
      } catch (error) {
        setError("Failed to load project data. Please try again later.");
        setLoading(false);
      }
    };

    fetchProjectData();
  }, []);

  useEffect(() => {
    // Ensure that projectData is loaded and has the necessary information
    if (projectData && projectData.project[0]?.session_id) {
      const fetchMessages = async () => {
        try {
          const response = await axios_instance.get(
            `/api/customgpt/projects/${projectId}/conversations/${projectData.project[0].session_id}/messages/`
          );
          const messagesData = response.data.messages;

          // Map the messagesData to the format expected by the chat UI
          const formattedMessages = messagesData.flatMap((message) => {
            const formatted = [];
            if (message.user_query) {
              formatted.push({
                type: "user",
                content: message.user_query,
              });
            }
            if (message.openai_response) {
              formatted.push({
                type: "server",
                content: message.openai_response,
                url: message.url || null,
                title: message.title || null,
              });
            }
            return formatted.reverse();
          });

          setMessages(formattedMessages.reverse());
        } catch (error) {
          console.error("Failed to fetch messages", error);
        }
      };

      fetchMessages();
    }
  }, [projectData, projectId]);

  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;

    try {
      await axios_instance.delete(
        `/api/customgpt/projects/${projectId}/page/delete/${documentToDelete}/`
      );
      document.location.reload(); // Reload the page or re-fetch the project data
      setModalOpen(false); // Close modal after successful deletion
    } catch (err) {
      setError("Failed to delete document. Please try again later.");
      setModalOpen(false); // Close modal even on failure
    }
  };

  const handleUploadDocument = async (file) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios_instance.post(
        `/api/customgpt/projects/update/${projectId}/`,
        formData
      );
      setLoading(false);
      setUploadModalOpen(false);
      document.location.reload(); // Refresh to show the new file
    } catch (e) {
      setLoading(false);
      setError("Failed to upload document. Please try again later.");
    }
  };

  // document table
  const renderDocuments = () => {
    if (projectData && projectData.project[0]?.documents.length > 0) {
      // Filter documents based on the search query
      const filteredDocuments = projectData.project[0].documents.filter((doc) =>
        doc.filename.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (filteredDocuments.length === 0) {
        return <p>No documents match your search.</p>;
      }

      return (
        <table className={styles.documentTable}>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Filename</th>
              <th>Uploaded On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.map((doc, index) => {
              return (
                <tr key={doc.id + Math.random()}>
                  <td style={{ textAlign: "center" }}>{index + 1}</td>
                  <td className={styles.fileName}>
                    <div className={styles.left}>
                      <RxFileText size={18} style={{ marginRight: "5px" }} />
                      <span className={styles.filename}>
                        {doc.filename.split(".").shift().length > 30
                          ? `${doc.filename.split(".").shift().slice(0, 20)}...`
                          : doc.filename.split(".").shift()}
                      </span>
                    </div>
                    <span className={styles.type_container}>
                      {doc.filename.split(".").pop()}
                    </span>
                  </td>
                  <td>
                    {new Date(doc.uploaded_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                  >
                    <IoEyeOutline
                      size={16}
                      style={{
                        marginRight: "10px",
                        verticalAlign: "middle",
                        cursor: "pointer",
                      }}
                      onClick={() => window.open(doc.viewable_url, "_blank")}
                    />
                    <HiOutlineTrash
                      size={16}
                      style={{ verticalAlign: "middle", cursor: "pointer" }}
                      // onClick={() => handleDeleteDocument(doc.page_id)}
                      onClick={() => {
                        setModalOpen(true); // Open modal
                        setDocumentToDelete(doc.page_id);
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }
    return <p>No documents found.</p>;
  };
  // document table

  //chatbot
  const handleShareChat = () => {
    setShareChatModal(true);
  };

  const handleSendPrompt = async () => {
    if (!prompt.trim()) return;

    const newMessage = { type: "user", content: prompt };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    setMessageLoading(true);
    setPrompt("");

    try {
      const response = await axios_instance.post(
        `/api/customgpt/projects/${projectId}/chat/${projectData.project[0].session_id}/`,
        { prompt: prompt }
      );

      const { openai_response, url, title } = response.data.message;

      const serverResponse = {
        type: "server",
        content: openai_response,
        url: url || null,
        title: title || null,
      };
      setMessages((prevMessages) => [...prevMessages, serverResponse]);
    } catch (e) {
      console.log(e);
      const errorMessage = {
        type: "server",
        content: "Error fetching response.",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setMessageLoading(false);
    }
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, messageloading]);

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.right}>
        {loading ? (
          <div className={styles.loader} />
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <>
            <PartialHeader
              setDeployModal={setDeployModal}
              setDefaultOpen={setDefaultOpen}
              title={projectData?.project[0]?.project_name || "Project"}
            />
            <div className={styles.bottom}>
              {/* Project Files */}
              <div className={styles.project_files_container}>
                <div className={styles.top}>
                  <div className={styles.left}>
                    <h3>All Documents</h3>
                    <div className={styles.input_container}>
                      <HiMiniMagnifyingGlass />
                      <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className={styles.right}>
                    <button
                      className={`${styles.button} ${styles.deploy}`}
                      onClick={() => {
                        setDeployModal(true);
                        setDefaultOpen("deploy");
                      }}
                    >
                      <IoRocketOutline size={18} /> Deploy
                    </button>
                    <button
                      className={`${styles.button} ${styles.upload}`}
                      onClick={() => setUploadModalOpen(true)}
                    >
                      <GoUpload size={18} /> Upload
                    </button>
                  </div>
                </div>
                <div className={styles.bottom}>{renderDocuments()}</div>
              </div>
              {/* ChatBot */}
              <div
                style={{
                  backgroundImage: `url(${
                    backgroundImage === "" ? "" : backgroundImage
                  })`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                className={styles.chatbot_container}
              >
                <div
                  style={{
                    backgroundImage: `url(${
                      backgroundImage === "" ? "" : backgroundImage
                    })`,
                    // backgroundColor: "transparent",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    // scale: "1.5",
                  }}
                  className={styles.headerContainer}
                >
                  <p className={styles.heading}>AI Chat</p>
                  <GoShareAndroid
                    size={20}
                    color="#ae407a"
                    style={{ cursor: "pointer" }}
                    onClick={handleShareChat}
                  />
                </div>
                <div className={styles.bottomContainer}>
                  {/* Message container */}
                  <div className={styles.messagesContainer}>
                    <div className={styles.messageList}>
                      {messages.map((message, index) => {
                        // console.log(backgroundImage);
                        return (
                          <>
                            {message.type === "server" && (
                              <img
                                src={avatar ? avatar : logo_small}
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "50%",
                                  marginBottom: "10px",
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
                              {/* Render Markdown for server messages, plain text for user messages */}
                              {message.type === "server" ? (
                                <>
                                  <ReactMarkdown>
                                    {message.content}
                                  </ReactMarkdown>
                                </>
                              ) : (
                                <p>{message.content}</p>
                              )}

                              {/* If both url and title are available, render them as a link */}
                              {message.type === "server" &&
                                message.url &&
                                message.title && (
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
                            </div>
                          </>
                        );
                      })}
                      {/* TODO: Need to change the laoder css here and everywhere else as well. */}
                      {messageloading && <div className={styles.textloader} />}{" "}
                      <div ref={messageEndRef} />
                    </div>
                  </div>

                  {/* Input container */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendPrompt();
                    }}
                  >
                    <div className={styles.inputContainer}>
                      <div className={styles.left_side}>
                        <MdMicNone size={20} />
                        <input
                          type="text"
                          value={prompt}
                          placeholder={placeholderPrompt}
                          onChange={(e) => setPrompt(e.target.value)}
                        />
                      </div>
                      <button
                        style={{
                          outline: "none",
                          border: "none",
                          backgroundColor: "transparent",
                          cursor: "pointer",
                        }}
                        type="submit"
                      >
                        <TbSend2 size={20} />
                      </button>
                    </div>
                  </form>
                </div>
                <div
                  style={{
                    backgroundColor: "transparent",
                    width: "100%",
                    height: "1rem",
                    position: "fixed",
                    bottom: "0",
                    left: "0",
                    // zIndex: 9999,
                  }}
                />
              </div>
              {/* ChatBot */}
            </div>
          </>
        )}
      </div>
      {/*  Modals */}
      <ShareChatModal
        isOpen={shareChatModal}
        onClose={() => setShareChatModal(false)}
        projectId={projectId}
      />
      <DeployModal
        isOpen={deployModal}
        onClose={() => {
          setDeployModal(false);
          if (changesMade) {
            document.location.reload();
          }
        }}
        embedCode={projectData?.project[0]?.embeded_code}
        projectId={projectId}
        defaultOpen={defaultOpen}
        changesMade={changesMade}
        setChangesMade={setChangesMade}
        placeholderPrompt={placeholderPrompt}
        setPlaceholderPrompt={setPlaceholderPrompt}
        responseSource={responseSource}
        setResponseSource={setResponseSource}
        backgroundImage={backgroundImage}
        setBackgroundImage={setBackgroundImage}
        noAnswerMessage={noAnswerMessage}
        setNoAnswerMessage={setNoAnswerMessage}
      />
      <UploadDocumentModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleUploadDocument}
      />
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDeleteDocument}
        title={"Document"}
      />
    </div>
  );
};

export default ViewProject;
