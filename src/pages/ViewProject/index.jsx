import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";

import { useParams } from "react-router-dom";
import { axios_instance } from "../../Axios/axiosInstance";

// Components
import Sidebar from "../../components/Sidebar";
import PartialHeader from "../../components/PartialHeader";

// Icons
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { IoRocketOutline } from "react-icons/io5";
import { GoUpload, GoFile } from "react-icons/go";

const ViewProject = () => {
  const { projectId } = useParams();

  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.customgpt.ai/js/embed.js";
    script.defer = true;
    script.setAttribute("div_id", "customgpt_chat");
    script.setAttribute("p_id", "41582");
    script.setAttribute("p_key", "7d6fc283f4128b6448b9eb119bd9dff0");

    script.onerror = () => {
      console.error("Failed to load the CustomGPT script");
    };

    const chatbotContainer = document.getElementById("customgpt_chat");
    if (chatbotContainer) {
      chatbotContainer.appendChild(script);
    }

    return () => {
      // Cleanup: Remove the script when the component is unmounted
      if (chatbotContainer) {
        chatbotContainer.innerHTML = ""; // Clear the chatbot container to remove the script
      }
    };
  }, []);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await axios_instance.get(
          `/api/customgpt/projects/${projectId}/pages/`
        );
        setProjectData(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to load project data. Please try again later.");
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

  // Render the documents list
  const renderDocuments = () => {
    if (projectData && projectData.project[0]?.documents.length > 0) {
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
            {projectData.project[0].documents.map((doc, index) => (
              <tr key={index}>
                <td style={{ textAlign: "center" }}>{index + 1}</td>
                <td>
                  <GoFile size={18} style={{ marginRight: "5px" }} />
                  <span className={styles.filename}>
                    {doc.filename.length > 15
                      ? `${doc.filename.slice(0, 15)}...`
                      : doc.filename}
                  </span>
                </td>{" "}
                <td>{new Date(doc.uploaded_at).toLocaleString()}</td>{" "}
                {/* Uploaded On */}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    return <p>No documents found.</p>;
  };

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
                      <input type="text" placeholder="Search" />
                    </div>
                  </div>
                  <div className={styles.right}>
                    <button className={`${styles.button} ${styles.deploy}`}>
                      <IoRocketOutline size={18} /> Deploy
                    </button>
                    <button className={`${styles.button} ${styles.upload}`}>
                      <GoUpload size={18} /> Upload
                    </button>
                  </div>
                </div>
                <div className={styles.bottom}>{renderDocuments()}</div>
              </div>

              {/* ChatBot */}
              <div className={styles.chatbot_container}>
                <div id="customgpt_chat"></div>
              </div>
              {/* ChatBot */}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewProject;
