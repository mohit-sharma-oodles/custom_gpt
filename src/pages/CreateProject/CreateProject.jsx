import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate for redirecting
import styles from "./index.module.scss";

//icons
import { IoCloudUploadOutline } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai"; // Icon for delete button
import { GoPencil } from "react-icons/go";

//components
import PartialHeader from "../../components/PartialHeader";
import Sidebar from "../../components/Sidebar";

//imports
import { FileUploader } from "react-drag-drop-files";
import { axios_instance } from "../../Axios/axiosInstance";

const CreateProject = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const edit = queryParams.get("edit") === "true";

  const [fileSelected, setFileSelected] = useState(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);

  const handleChange = (file) => {
    if (fileSelected) {
      alert("You can only upload one file.");
      return;
    }
    setFileSelected(file);
    console.log(fileSelected, "Selected File");
  };

  const handleDeleteFile = () => {
    setFileSelected(null);
  };

  const handleCreateProject = async () => {
    if (!name || !fileSelected) {
      alert("Please fill in the project name and upload a file.");
      return;
    }

    setLoader(true);

    const formData = new FormData();
    formData.append("project_name", name);
    formData.append("file", fileSelected);

    try {
      const response = await axios_instance.post(
        "/api/customgpt/projects/create/",
        formData
      );
      setMessage(response?.data?.message);
      setLoader(false);

      // Redirect after 3 seconds if response is successful
      setTimeout(() => {
        navigate("/app/projects");
      }, 3000);
    } catch (e) {
      setLoader(false);
      setError(e?.response?.data?.error);
    }
  };

  const handleEditProject = () => {
    console.log("Edit mode: You are editing an existing project");
    // You can add your edit logic here, for now, it just logs to the console
  };

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
          title={"Create Project"}
          className={styles.partial_header}
        />
        <div className={styles.content}>
          <div className={styles.top_container}>
            <h2 className={styles.heading}>Name of the Project</h2>
            {edit && <GoPencil />}
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
              Select a file to upload
            </h2>
            <FileUploader
              handleChange={handleChange}
              name="file"
              multiple={false} // Allow only a single file
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
          <div className={styles.middle_container}>
            {fileSelected && (
              <div className={styles.file_div}>
                <div className={styles.single_file}>
                  <p>{fileSelected.name}</p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <p className={styles.file_type}>
                      {fileSelected.name.split(".").pop()}
                    </p>
                    <button
                      onClick={handleDeleteFile}
                      className={styles.delete_btn}
                    >
                      <AiOutlineDelete size={20} color="red" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className={styles.submit_container}>
            <button onClick={handleSubmit} className={styles.submit_btn}>
              Submit
            </button>
            {loader && <div className={styles.loader} />}
            {error && <h3 style={{ color: "red" }}>{error}</h3>}
            {message && <h3>{message}</h3>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
