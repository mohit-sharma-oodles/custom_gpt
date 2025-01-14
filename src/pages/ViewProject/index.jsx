import React, { useEffect, useState, useRef } from "react";
import styles from "./index.module.scss";
import ReactMarkdown from "react-markdown";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
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
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { FaCircleInfo } from "react-icons/fa6";
import { FiRefreshCw } from "react-icons/fi";
import { TbSend2 } from "react-icons/tb";
import { MdMicNone } from "react-icons/md";
import { GoUpload, GoShareAndroid } from "react-icons/go";
import { RxFileText } from "react-icons/rx";
import { HiOutlineTrash } from "react-icons/hi2";
import { AiOutlineDelete } from "react-icons/ai";
import logo_small from "../../assets/compnay_icon_small.svg";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";

const MAX_FILE_SIZE = 2; // 2MB
const MAX_TOTAL_SIZE = 1024 * 1024 * 1024; // 1GB in bytes
const MAX_FILES = 50;

/* ------------------------------------------------------------------
   UploadDocumentModal COMPONENT
   ------------------------------------------------------------------ */
const UploadDocumentModal = ({
  isOpen,
  onClose,
  onUploadSuccess,
  projectId,
}) => {
  const { t } = useTranslation();
  // Rename these to avoid conflict with main page "isLoading"
  const [fileSelected, setFileSelected] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleChange = (files) => {
    const newFiles = [];
    let totalFiles = fileSelected.length;
    let totalSize = fileSelected.reduce((acc, file) => acc + file.size, 0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (totalFiles >= MAX_FILES) {
        toast.warn(`Cannot upload more than ${MAX_FILES} files.`);
        break;
      }

      if (file.size > MAX_FILE_SIZE * 1024 * 1024) {
        toast.warn(
          `File ${file.name} exceeds the maximum allowed size of ${MAX_FILE_SIZE}MB.`
        );
        continue;
      }

      if (totalSize + file.size > MAX_TOTAL_SIZE) {
        toast.warn(
          `Total file size cannot exceed ${MAX_TOTAL_SIZE / (1024 * 1024)} MB.`
        );
        break;
      }

      newFiles.push(file);
      totalFiles++;
      totalSize += file.size;
    }

    if (newFiles.length > 0) {
      setFileSelected((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleDeleteFile = (index) => {
    setFileSelected((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleUploadDocument = async () => {
    if (fileSelected.length === 0) {
      alert(t("Please select at least one file to upload."));
      return;
    }
    setUploading(true);

    try {
      // Upload files to the edit project API endpoint
      const uploadPromises = fileSelected.map((file) => {
        const fileData = new FormData();
        fileData.append("file", file);

        return axios_instance
          .post(`/api/customgpt/projects/update/${projectId}/`, fileData)
          .then(() => null)
          .catch((error) => {
            console.error(`Failed to upload file ${file.name}:`, error);
            return `${t("Failed to upload file")} ${file.name}: ${
              error.response?.data?.error || error.message
            }`;
          });
      });

      const uploadResults = await Promise.all(uploadPromises);

      // Filter out any errors
      const uploadErrors = uploadResults.filter((result) => result !== null);
      if (uploadErrors.length > 0) {
        uploadErrors.forEach((error) => {
          toast.error(error);
        });
      } else {
        // All files uploaded successfully
        toast.success(t("Files uploaded successfully."));
        onUploadSuccess(); // Call the success handler
        onClose(); // Close the modal
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error(t("Failed to upload documents. Please try again."));
    } finally {
      setUploading(false);
      setFileSelected([]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2 style={{ fontWeight: "500" }}>{t("Upload Documents")}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>
        <div style={{ height: "50%", marginBottom: "1rem" }}>
          <FileUploader
            handleChange={handleChange}
            name="file"
            multiple={true}
            classes="drop_zone"
          >
            <div className={styles.drop_zone}>
              <IoCloudUploadOutline size={50} color={"lightgrey"} />
              <div className={styles.text_container}>
                <h3>
                  {t("Drag and Drop files or")}{" "}
                  <span className={styles.browse}>{t("Browse")}</span>
                </h3>
                <p>
                  {t("Supported formats: PDF, DOC, XLSX, SPREADSHEET, etc.")}
                </p>
              </div>
            </div>
          </FileUploader>
        </div>
        {fileSelected.length > 0 && (
          <div
            style={{ width: "80%", maxHeight: "20%", overflowY: "auto" }}
            className={styles.fileList}
          >
            {fileSelected.map((file, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  marginBottom: "0.5rem",
                }}
              >
                <p>
                  {file.name.split(".").shift().length > 25
                    ? `${file.name.split(".").shift().slice(0, 22)}...`
                    : file.name.split(".").shift()}
                </p>
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
                    {file.name.split(".").pop()}
                  </p>
                  <button
                    onClick={() => handleDeleteFile(index)}
                    className={styles.delete_btn}
                  >
                    <AiOutlineDelete size={20} color="red" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.loaderContainer}>
          {uploading && <div className={styles.loader}></div>}
        </div>

        <button
          className={styles.uploadButton}
          onClick={handleUploadDocument}
          disabled={uploading}
        >
          {uploading ? t("Uploading...") : t("Upload")}
        </button>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------
   HELPER: Pagination pages with '...'
   ------------------------------------------------------------------ */
function getPagesToDisplay(current, total) {
  const visiblePageCount = 5; // how many numeric pages to show
  const pages = [];

  // Always push the first page
  pages.push(1);

  // If total pages is small, just show them all
  if (total <= visiblePageCount + 2) {
    for (let i = 2; i < total; i++) {
      pages.push(i);
    }
  } else {
    // figure out left and right "windows"
    let left = Math.max(2, current - 1);
    let right = Math.min(total - 1, current + 1);

    // If user is near the start
    if (current <= 3) {
      right = 4;
    }
    // If user is near the end
    if (current >= total - 2) {
      left = total - 3;
    }

    // If there's a gap after page 1
    if (left > 2) {
      pages.push("...");
    }

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    // If there's a gap before the last page
    if (right < total - 1) {
      pages.push("...");
    }
  }

  // Always push the last page (if total > 1)
  if (total > 1) {
    pages.push(total);
  }

  return pages;
}

/* ------------------------------------------------------------------
   MAIN: ViewProject
   ------------------------------------------------------------------ */
const ViewProject = () => {
  const { t } = useTranslation();
  const { projectId } = useParams();

  // Single "isLoading" for the entire page
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [projectData, setProjectData] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  // Track changes if we alter settings in DeployModal
  const [changesMade, setChangesMade] = useState(false);

  // Modals
  const [isModalOpen, setModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [deployModal, setDeployModal] = useState(false);
  const [defaultOpen, setDefaultOpen] = useState("deploy");

  // Chatbot
  const [sessionId, setSessionId] = useState("");
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [messageloading, setMessageLoading] = useState(false);
  const [shareChatModal, setShareChatModal] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [placeholderPrompt, setPlaceholderPrompt] = useState("");
  const [responseSource, setResponseSource] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [noAnswerMessage, setNoAnswerMessage] = useState("");
  const [showCitations, setShowCitations] = useState(""); // not used, but in your snippet
  const [reCaptcha, setReCaptcha] = useState(false);
  const [chatbot_model, setChatbot_model] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [enableCitations, setEnableCitations] = useState();
  const [chatbotBubbleColor, setChatbotBubbleColor] = useState("");
  const [toolbarColor, setToolbarColor] = useState("");
  const [persona_instructions, setPersona_instructions] = useState("");

  const messageEndRef = useRef(null);

  /* ------------------------------------------------------------------
     Fetch Project Data + Documents
     ------------------------------------------------------------------ */
  const fetchProjectData = async (page = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1) Documents and basic project info
      const projectDataResponse = await axios_instance.get(
        `/api/customgpt/projects/${projectId}/pages/?page=${page}`
      );

      // 2) Project settings
      const projectSettingsResponse = await axios_instance.get(
        `/api/customgpt/projects/update/settings/${projectId}`
      );

      const projectDataFetched = projectDataResponse.data;
      setProjectData(projectDataFetched);

      // Set totalPages if available
      if (
        projectDataFetched?.project?.[0]?.total_page &&
        !isNaN(projectDataFetched.project[0].total_page)
      ) {
        setTotalPages(projectDataFetched.project[0].total_page);
      } else {
        setTotalPages(1);
      }

      // Session ID
      setSessionId(projectDataFetched?.project?.[0]?.session_id || "");

      // Fill settings
      const settingsData = projectSettingsResponse.data.result.data;
      setPersona_instructions(settingsData.persona_instructions);
      setToolbarColor(settingsData.chatbot_toolbar_color);
      setChatbotBubbleColor(settingsData.chatbot_color);
      setEnableCitations(settingsData.enable_citations);
      setReCaptcha(settingsData.enable_recaptcha_for_public_chatbots);
      setSelectedLanguage(settingsData.chatbot_msg_lang);
      setChatbot_model(settingsData.chatbot_model);
      setAvatar(settingsData.chatbot_avatar);
      setNoAnswerMessage(settingsData.no_answer_message);
      setBackgroundImage(settingsData.chatbot_background);
      setPlaceholderPrompt(settingsData.default_prompt);
      setResponseSource(settingsData.response_source);
    } catch (err) {
      console.error("Failed to load project data", err);
      setError(t("Failed to load project data. Please try again later."));
    } finally {
      setIsLoading(false);
    }
  };

  // Only fetch project data on mount + whenever currentPage changes
  useEffect(() => {
    fetchProjectData(currentPage);
    // eslint-disable-next-line
  }, [currentPage]);

  /* ------------------------------------------------------------------
     Fetch Chat Messages (ONE TIME if empty)
     ------------------------------------------------------------------ */
  const fetchMessages = async (projectData) => {
    try {
      const response = await axios_instance.get(
        `/api/customgpt/projects/${projectId}/conversations/${projectData.project[0].session_id}/messages/`
      );
      const messagesData = response.data.messages;

      // Flatten & format
      const formattedMessages = messagesData.flatMap((message) => {
        const arr = [];
        if (message.user_query) {
          arr.push({
            type: "user",
            content: message.user_query,
          });
        }
        if (message.openai_response) {
          arr.push({
            type: "server",
            content: message.openai_response,
            url: message.url || null,
            title: message.title || null,
            citations: message.citation_list || [],
          });
        }
        return arr.reverse();
      });
      // Reverse final so they appear in correct order
      setMessages(formattedMessages.reverse());
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };

  // If we have project data with a sessionId, and messages is still empty, fetch them once
  useEffect(() => {
    if (
      projectData &&
      projectData.project[0]?.session_id &&
      messages.length === 0
    ) {
      fetchMessages(projectData);
    }
    // eslint-disable-next-line
  }, [projectData, projectId]);

  /* ------------------------------------------------------------------
     DELETE a Document
     ------------------------------------------------------------------ */
  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;
    setIsLoading(true);

    try {
      await axios_instance.delete(
        `/api/customgpt/projects/${projectId}/page/delete/${documentToDelete}/`
      );
      toast.success(t("Document deleted successfully."));
      setModalOpen(false);
      // After deleting, refetch data for the current page
      fetchProjectData(currentPage);
    } catch (err) {
      console.error(err);
      toast.error(t("Failed to delete document. Please try again later."));
      setModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  /* ------------------------------------------------------------------
     Reindex a Document
     ------------------------------------------------------------------ */
  const handleReindex = async (file_id) => {
    try {
      const response = await axios_instance.post(
        `/api/customgpt/${projectId}/re_indexed_page/${file_id}/`
      );
      toast.success(response.data.message);
    } catch (e) {
      toast.error(e.response.data.error);
    }
  };

  /* ------------------------------------------------------------------
     Status Icons
     ------------------------------------------------------------------ */
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "failed":
        return (
          <FaTimesCircle className={`${styles.statusIcon} ${styles.failed}`} />
        );
      case "ok":
        return (
          <FaCheckCircle className={`${styles.statusIcon} ${styles.okay}`} />
        );
      case "queued":
        return <FaClock className={`${styles.statusIcon} ${styles.queue}`} />;
      default:
        return null;
    }
  };

  /* ------------------------------------------------------------------
     Render Documents Table
     ------------------------------------------------------------------ */
  const getDisplayName = (doc) => {
    if (doc.filename && typeof doc.filename === "string") {
      const nameParts = doc.filename.split(".");
      const name = nameParts.slice(0, -1).join(".") || doc.filename;
      return name.length > 30 ? `${name.slice(0, 20)}...` : name;
    }
    // If filename is null, use the viewable_url
    return doc.viewable_url || "View Document";
  };

  const getFileExtension = (doc) => {
    if (doc.filename && typeof doc.filename === "string") {
      const parts = doc.filename.split(".");
      return parts.pop() || "";
    }
    return "URL";
  };

  const renderDocuments = () => {
    if (!projectData) return <p>{t("No documents found.")}</p>;
    if (!projectData.project[0]?.documents) return <p>{t("No documents.")}</p>;

    // Filter documents by search query
    const filteredDocuments = projectData.project[0].documents.filter((doc) => {
      const searchLower = searchQuery.toLowerCase();
      if (doc.filename && typeof doc.filename === "string") {
        return doc.filename.toLowerCase().includes(searchLower);
      }
      if (doc.viewable_url && typeof doc.viewable_url === "string") {
        return doc.viewable_url.toLowerCase().includes(searchLower);
      }
      return false;
    });

    if (filteredDocuments.length === 0) {
      return <p>{t("No documents match your search.")}</p>;
    }

    return (
      <table className={styles.documentTable}>
        <thead>
          <tr>
            <th>{t("S.No")}</th>
            <th>{t("Filename")}</th>
            <th>{t("Status")}</th>
            <th>{t("Uploaded On")}</th>
            <th>{t("Actions")}</th>
          </tr>
        </thead>
        <tbody>
          {filteredDocuments.map((doc, index) => {
            const displayName = getDisplayName(doc);
            const extension = getFileExtension(doc);

            return (
              <tr key={doc.page_id}>
                <td style={{ textAlign: "center" }}>{index + 1}</td>
                <td className={styles.fileName}>
                  <div className={styles.left}>
                    <RxFileText size={18} style={{ marginRight: "5px" }} />
                    <span className={styles.filename}>{displayName}</span>
                  </div>
                  <span className={styles.type_container}>{extension}</span>
                </td>
                <td
                  className={`${styles.tooltip} ${
                    index === 0 ? styles.downwards : ""
                  }`}
                >
                  <FaCircleInfo className={`clickable ${styles.info_icon}`} />
                  <span
                    className={`${styles.tooltiptext} 
                      ${index === 0 ? "" : ""}
                      `}
                  >
                    <p>
                      Crawl Status:
                      {doc.crawl_status}
                      {getStatusIcon(doc.crawl_status)}
                    </p>
                    <p>
                      Index Status:
                      {doc.index_status}
                      {getStatusIcon(doc.index_status)}
                    </p>
                  </span>
                </td>
                <td>
                  {new Date(doc.uploaded_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td>
                  <div
                    style={{
                      display: "flex",
                      textAlign: "center",
                      verticalAlign: "middle",
                      height: "100%",
                    }}
                  >
                    <FiRefreshCw
                      size={16}
                      style={{
                        marginRight: "10px",
                        verticalAlign: "middle",
                        cursor: "pointer",
                      }}
                      onClick={() => handleReindex(doc.page_id)}
                    />
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
                      onClick={() => {
                        setModalOpen(true);
                        setDocumentToDelete(doc.page_id);
                      }}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  /* ------------------------------------------------------------------
     PAGE CHANGE
     ------------------------------------------------------------------ */
  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  /* ------------------------------------------------------------------
     CHATBOT FUNCTIONS
     ------------------------------------------------------------------ */
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
        `/api/customgpt/projects/${projectId}/chat/${sessionId}/`,
        { prompt: prompt }
      );
      const { openai_response } = response.data.message;

      const serverResponse = {
        type: "server",
        content: openai_response,
        citations: response.data.message.citation_list,
      };
      setMessages((prevMessages) => [...prevMessages, serverResponse]);
    } catch (e) {
      console.log(e);
      const errorMessage = {
        type: "server",
        content: t("Error fetching response."),
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

  const handleChatRefresh = async () => {
    try {
      const response = await axios_instance.post(
        `/api/customgpt/projects/delete_chat/${projectId}/${sessionId}/`
      );
      setSessionId(response.data.session_id);
      setMessages([]);
      toast.success("Messages have been deleted");
    } catch (e) {
      toast.error("Error while refreshing the chats");
    }
    setMessages([]);
  };

  /* ------------------------------------------------------------------
     RENDER
     ------------------------------------------------------------------ */
  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.right}>
        {isLoading ? (
          <div className={styles.loader} />
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <>
            <PartialHeader
              setDeployModal={setDeployModal}
              setDefaultOpen={setDefaultOpen}
              title={projectData?.project[0]?.project_name || t("Project")}
            />
            <div className={styles.bottom}>
              {/* Project Files */}
              <div className={styles.project_files_container}>
                <div className={styles.top_two}>
                  <div className={styles.top}>
                    <div className={styles.left}>
                      <h3>{t("All Documents")}</h3>
                      <div className={styles.input_container}>
                        <HiMiniMagnifyingGlass />
                        <input
                          type="text"
                          placeholder={t("Search")}
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
                        <IoRocketOutline size={18} /> {t("Deploy")}
                      </button>
                      <button
                        className={`${styles.button} ${styles.upload}`}
                        onClick={() => setUploadModalOpen(true)}
                      >
                        <GoUpload size={18} /> {t("Upload")}
                      </button>
                    </div>
                  </div>

                  {/* Documents Table + Pagination */}
                  <div className={styles.bottom}>{renderDocuments()}</div>
                </div>

                {/* Pagination Section */}
                <div className={styles.paginationContainer}>
                  {/* We can show a smaller spinner if needed, 
                      but here we’ll assume the main isLoading covered it */}
                  <div className={styles.pagination}>
                    {/* Prev button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={styles.prevButton}
                    >
                      <FaArrowLeftLong /> {t("Prev")}
                    </button>

                    {/* Page numbers (with ellipsis) */}
                    {getPagesToDisplay(currentPage, totalPages).map(
                      (page, idx) => {
                        if (page === "...") {
                          return (
                            <button
                              key={idx}
                              disabled
                              className={styles.ellipsis}
                            >
                              ...
                            </button>
                          );
                        } else {
                          return (
                            <button
                              key={idx}
                              onClick={() => handlePageChange(page)}
                              className={
                                page === currentPage
                                  ? styles.activePage
                                  : styles.pageNumber
                              }
                            >
                              {page}
                            </button>
                          );
                        }
                      }
                    )}

                    {/* Next button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={styles.nextButton}
                    >
                      {t("Next")} <FaArrowRightLong />
                    </button>
                  </div>
                </div>
              </div>

              {/* ChatBot */}
              <div
                style={{
                  backgroundImage: backgroundImage
                    ? `url(${backgroundImage})`
                    : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                className={styles.chatbot_container}
              >
                <div
                  style={{
                    backgroundColor: `${toolbarColor}`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  className={styles.headerContainer}
                >
                  <p className={styles.heading}>{t("AI Chat")}</p>
                  <div>
                    <FiRefreshCw
                      size={20}
                      color="white"
                      style={{ cursor: "pointer", marginRight: "1rem" }}
                      onClick={handleChatRefresh}
                    />
                    <GoShareAndroid
                      size={20}
                      color="white"
                      style={{ cursor: "pointer", marginRight: "1rem" }}
                      onClick={handleShareChat}
                    />
                  </div>
                </div>
                <div className={styles.bottomContainer}>
                  {/* Message container */}
                  <div className={styles.messagesContainer}>
                    <div className={styles.messageList}>
                      {messages.map((message, index) => (
                        <React.Fragment key={index}>
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
                            className={
                              message.type === "user"
                                ? styles.userMessage
                                : styles.serverMessage
                            }
                            style={
                              message.type === "user"
                                ? { backgroundColor: chatbotBubbleColor }
                                : {}
                            }
                          >
                            {message.type === "server" ? (
                              <div className={styles.markdown_content}>
                                <ReactMarkdown>{message.content}</ReactMarkdown>
                              </div>
                            ) : (
                              <p>{message.content}</p>
                            )}

                            {/* Citations */}
                            {enableCitations !== 0 &&
                              message.type === "server" &&
                              message?.citations?.length > 0 && (
                                <p>
                                  &#9432; {t("Related Documents")}: <br />
                                </p>
                              )}
                            {enableCitations !== 0 &&
                              message.type === "server" &&
                              message?.citations?.length > 0 &&
                              message?.citations.map((citation, idx2) => {
                                return (
                                  <div key={idx2} style={{ marginTop: "10px" }}>
                                    <a
                                      style={{ color: "black" }}
                                      href={citation.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {citation.title}
                                    </a>
                                  </div>
                                );
                              })}
                          </div>
                        </React.Fragment>
                      ))}
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
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* SHARE CHAT MODAL */}
      <ShareChatModal
        isOpen={shareChatModal}
        onClose={() => setShareChatModal(false)}
        projectId={projectId}
      />

      {/* DEPLOY MODAL */}
      <DeployModal
        isOpen={deployModal}
        onClose={() => {
          setDeployModal(false);
          if (changesMade) {
            // Reload the project data if changes were made
            fetchProjectData(currentPage);
          }
        }}
        embedCode={projectData?.project[0]?.embeded_code}
        liveChatCode={projectData?.project[0]?.live_chat_code}
        WebsiteCopilotCode={projectData?.project[0]?.website_coplilot}
        SGECode={projectData?.project[0]?.search_generative_experience}
        projectId={projectId}
        projectKey={projectData?.project[0]?.project_key}
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
        chatbot_model={chatbot_model}
        setChatbot_model={setChatbot_model}
        reCaptcha={reCaptcha}
        setReCaptcha={setReCaptcha}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        enableCitations={enableCitations}
        setEnableCitations={setEnableCitations}
        chatbotBubbleColor={chatbotBubbleColor}
        setChatbotBubbleColor={setChatbotBubbleColor}
        toolbarColor={toolbarColor}
        setToolbarColor={setToolbarColor}
        persona_instructions={persona_instructions}
      />

      {/* UPLOAD DOCUMENT MODAL */}
      <UploadDocumentModal
        isOpen={uploadModalOpen}
        onClose={() => {
          setUploadModalOpen(false);
        }}
        onUploadSuccess={() => {
          setUploadModalOpen(false);
          // Reload the project data after successful upload
          fetchProjectData(currentPage);
        }}
        projectId={projectId}
      />

      {/* DELETE CONFIRMATION MODAL */}
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDeleteDocument}
        title={t("Document")}
        loading={isLoading}
      />
    </div>
  );
};

export default ViewProject;
