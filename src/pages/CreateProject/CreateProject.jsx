import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./index.module.scss";

// Icons
import { IoCloudUploadOutline } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";
import { GoPencil } from "react-icons/go";

// Components
import PartialHeader from "../../components/PartialHeader";
import Sidebar from "../../components/Sidebar";

// Imports
import { FileUploader } from "react-drag-drop-files";
import { axios_instance } from "../../Axios/axiosInstance";
import { useTranslation } from "react-i18next";

const CreateProject = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const edit = queryParams.get("edit") === "true";
  const projectId = queryParams.get("projectID");

  const [fileSelected, setFileSelected] = useState([]);
  const [name, setName] = useState("");
  const [existingFiles, setExistingFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);

  // Fetch the existing project if in edit mode
  useEffect(() => {
    if (edit && projectId) {
      const fetchProject = async () => {
        try {
          const response = await axios_instance.get(
            `/api/customgpt/projects/${projectId}/pages/`
          );

          const { project_name, documents } = response.data.project[0];

          setName(project_name);
          setExistingFiles(documents);
        } catch (e) {
          setError(t("Failed to fetch project details."));
        }
      };
      fetchProject();
    }
  }, [edit, projectId, t]);

  // Handle file selection
  const handleChange = (files) => {
    setFileSelected((prevFiles) => [...prevFiles, ...files]);
  };

  // Delete a selected file
  const handleDeleteFile = (index) => {
    setFileSelected((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Create a new project and upload files
  const handleCreateProject = async () => {
    if (!name || fileSelected.length === 0) {
      alert(t("Please fill in the project name and upload at least one file."));
      return;
    }

    setLoader(true);
    // Clear previous messages
    setError("");
    setMessage("");

    const formData = new FormData();
    formData.append("project_name", name);

    try {
      // Create the project and get the project_id
      const response = await axios_instance.post(
        "/api/customgpt/projects/create/",
        formData
      );

      const { message, project_id } = response.data;

      // Loop over each file and upload it
      const promises = fileSelected.map((file) => {
        const fileData = new FormData();
        fileData.append("file", file);

        return axios_instance.post(
          `/api/customgpt/projects/update/${project_id}/`,
          fileData
        );
      });

      try {
        await Promise.all(promises);
        setMessage(message);
        // Clear any previous errors
        setError("");
      } catch (uploadErrors) {
        const errorMessages = uploadErrors.map(
          (error) =>
            `${t("Failed to upload file")} ${error.response.data.file.name}: ${
              error.response.data.error
            }`
        );
        setError(errorMessages.join("\n"));
        // Clear any previous success messages
        setMessage("");
      }

      setLoader(false);

      setTimeout(() => {
        navigate("/app/projects");
      }, 3000);
    } catch (e) {
      setLoader(false);
      setError(e?.response?.data?.error || t("An error occurred."));
      // Clear any previous success messages
      setMessage("");
    }
  };

  // Edit an existing project and upload new files
  const handleEditProject = async () => {
    if (!name) {
      alert(t("Please fill in the project name."));
      return;
    }

    setLoader(true);
    // Clear previous messages
    setError("");
    setMessage("");

    const formData = new FormData();
    formData.append("project_name", name);

    try {
      // Update the project name
      await axios_instance.post(
        `/api/customgpt/projects/update/${projectId}/`,
        formData
      );

      // Upload new files if any
      if (fileSelected.length > 0) {
        const uploadPromises = fileSelected.map((file) => {
          const fileData = new FormData();
          fileData.append("file", file);

          return axios_instance
            .post(`/api/customgpt/projects/update/${projectId}/`, fileData)
            .then(() => null) // Return null if successful
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
          setError(uploadErrors.join("\n"));
          // Clear any previous success messages
          setMessage("");
        } else {
          setMessage(t("Project updated successfully."));
          // Clear any previous errors
          setError("");
        }
      } else {
        setMessage(t("Project updated successfully."));
        // Clear any previous errors
        setError("");
      }

      setLoader(false);

      setTimeout(() => {
        navigate("/app/projects");
      }, 3000);
    } catch (e) {
      setLoader(false);
      setError(e?.response?.data?.error || t("An error occurred."));
      // Clear any previous success messages
      setMessage("");
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (edit) {
      handleEditProject();
    } else {
      handleCreateProject();
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar className={styles.sidebar} />
      <div className={styles.main}>
        <PartialHeader
          title={edit ? t("Edit Project") : t("Create Project")}
          className={styles.partial_header}
        />
        <div className={styles.content}>
          <div className={styles.top_container}>
            <h2 className={styles.heading}>
              {t("Name of the Project")} {edit && <GoPencil />}
            </h2>

            <input
              type="text"
              name="project_name"
              id="project_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={styles.name_input}
            />
            <h2 style={{ marginTop: "1rem" }} className={styles.heading}>
              {t("Select files to upload")}
            </h2>
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

          <div className={styles.middle_container}>
            {fileSelected.length > 0 && (
              <>
                <h3>{t("New Files:")}</h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: ".7rem",
                  }}
                  className={styles.file_div}
                >
                  {fileSelected.map((file, index) => (
                    <div key={index} className={styles.single_file}>
                      <p>{file.name}</p>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <p className={styles.file_type}>
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
              </>
            )}
            {existingFiles?.length > 0 && (
              <div>
                <h3>{t("Existing Files:")}</h3>
                <div
                  className={styles.file_div}
                  style={{ flexDirection: "column", gap: "6px" }}
                >
                  {existingFiles.map((file, index) => (
                    <div key={index} className={styles.single_file}>
                      <p>{file.filename}</p>
                      <p className={styles.file_type}>
                        {file.filename.split(".").pop()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className={styles.submit_container}>
            <button
              onClick={handleSubmit}
              className={styles.submit_btn}
              disabled={loader}
            >
              {loader
                ? t("Processing...")
                : edit
                ? t("Save Changes")
                : t("Submit")}
            </button>
            {loader && <div className={styles.loader} />}
            {error && (
              <h3 style={{ color: "#fa5757", whiteSpace: "pre-wrap" }}>
                {error}
              </h3>
            )}
            {message && <h3 style={{ color: "#2bb673" }}>{message}</h3>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
