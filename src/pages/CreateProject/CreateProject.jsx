import React, { useState } from "react";
import styles from "./index.module.scss";

//icons
import { IoCloudUploadOutline } from "react-icons/io5";

//components
import PartialHeader from "../../components/PartialHeader";
import Sidebar from "../../components/Sidebar";

//imports
import { FileUploader } from "react-drag-drop-files";

const CreateProject = () => {
  const [fileSelected, setFileSelected] = useState(null); // Single file state
  const [name, setName] = useState("");

  const handleChange = (file) => {
    // console.log(file);
    if (fileSelected) {
      alert("You can only upload one file.");
      return; // Prevent replacing the file if already uploaded
    }
    setFileSelected(file); // Replace the file, since only one should be uploaded
    console.log(fileSelected, "Selected File");
  };

  const handleCreateProject = async () => {
    if (!name || !fileSelected) {
      alert("Please fill in the project name and upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("project_name", name);
    formData.append("file", fileSelected); // file is the state from useState

    try {
      const response = await fetch("/api/customgpt/projects/create/", {
        method: "POST",
        body: formData, // Send the formData
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Project created successfully:", result);
        alert("Project created successfully!");
      } else {
        console.error("Error creating project:", response.statusText);
        alert("Failed to create project.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while creating the project.");
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
            <input
              type="text"
              name="project_name"
              id="project_name"
              value={name}
              onChange={(e) => setName(e.target.value.trim())}
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
              // disabled={file ? true : false} // Disable the file uploader if file is uploaded
              style={{ padding: "20rem" }}
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
            {fileSelected && ( // Check if a file is selected before rendering its details
              <div className={styles.file_div}>
                <p>{fileSelected.name}</p>
                <p className={styles.file_type}>
                  {fileSelected.name.split(".").pop()}
                </p>
              </div>
            )}
          </div>
          <div className={styles.submit_container}>
            <button onClick={handleCreateProject} className={styles.submit_btn}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
