import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";

//icons
import { IoCloudUploadOutline } from "react-icons/io5";

//components
import PartialHeader from "../../components/PartialHeader";
import Sidebar from "../../components/Sidebar";

//imports
import { FileUploader } from "react-drag-drop-files";

const CreateProject = () => {
  const [files, setFiles] = useState([]);

  const handleChange = (fileList) => {
    const newFiles = Array.from(fileList);

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);

    // console.log([...files, ...newFiles], "filesss", files);
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
              required
              className={styles.name_input}
            />
            <h2 style={{ marginTop: "1rem" }} className={styles.heading}>
              Select files to upload
            </h2>
            <FileUploader
              handleChange={handleChange}
              name="file"
              multiple={true}
              classes="drop_zone"
              // className={styles.dropzone}
              style={{ padding: "20rem" }}
            >
              <div className={styles.drop_zone}>
                <IoCloudUploadOutline size={50} color={"lightgrey"} />
                <div className={styles.text_container}>
                  <h3>
                    Drag and Drop files or{" "}
                    <span className={styles.browse}>Browse</span>
                  </h3>
                  <p>Supported formats: PDF, DOC, XLSX, SPREADSHEET, etc.</p>
                </div>
              </div>
            </FileUploader>
          </div>
          <div className={styles.middle_container}>
            {files.map((file, idx) => {
              const fileExtension = file.name.split(".").pop();

              return (
                <div key={idx} className={styles.file_div}>
                  <p>{file.name}</p>
                  <p className={styles.file_type}>{fileExtension}</p>{" "}
                </div>
              );
            })}
          </div>
          <div className={styles.submit_container}>
            <button className={styles.submit_btn}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
