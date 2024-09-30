import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { useSelector } from "react-redux";
import logo from "../../assets/company_logo.svg";

// Icons
import { MdAddCircleOutline } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { RxFileText } from "react-icons/rx";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { HiOutlineTrash } from "react-icons/hi2";
import { LuFolderOpen } from "react-icons/lu";

// Components
import Sidebar from "../../components/Sidebar";
import PartialHeader from "../../components/PartialHeader";
import { Link, useNavigate } from "react-router-dom";
import { axios_instance } from "../../Axios/axiosInstance";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";

const Projects = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.rootReducer.auth);

  const [projects, setProjects] = useState([]);
  const [loader, setLoader] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setModalOpen] = useState(false); // For modal visibility
  const [projectToDelete, setProjectToDelete] = useState(null); // For storing the project ID to delete

  const getAllProjects = async () => {
    setLoader(true);
    try {
      const response = await axios_instance.get(
        "customgpt/projects/get_all_pages/"
      );
      setProjects(response?.data?.projects);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  const filteredProjects = searchTerm
    ? projects.filter((project) =>
        project.project_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : projects;

  const handleEditClick = (projectID) => {
    navigate(`/app/create-project?edit=true&projectID=${projectID}`);
  };

  const handleViewClick = (projectId) => {
    navigate(`/app/project/${projectId}`);
  };

  // Open the modal and set the project to delete
  const openDeleteModal = (projectId) => {
    setProjectToDelete(projectId); // Store the project ID
    setModalOpen(true); // Open the modal
  };

  // Handle project deletion after modal confirmation
  const handleDeleteProject = async () => {
    setLoader(true);
    try {
      const response = await axios_instance.delete(
        `customgpt/projects/delete/${projectToDelete}/`
      );
      setModalOpen(false);
      await getAllProjects();
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* leftside */}
      <Sidebar />
      {/* leftside */}

      {/* right_side */}
      <div className={styles.right}>
        <PartialHeader />
        <div className={styles.bottom}>
          <div className={styles.right_side}>
            <div className={styles.top}>
              <h2>All Projects</h2>
              <div className={styles.bottom_container}>
                <div className={styles.left_side}>
                  <div className={styles.input}>
                    <IoIosSearch />
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  {/* <select
                    name="upload_time"
                    id="upload_time"
                    className={styles.dropdown}
                  >
                    <option value="recently_added">Recently Added</option>
                    <option value="saab">Saab</option>
                    <option value="mercedes">Mercedes</option>
                    <option value="audi">Audi</option>
                  </select>
                  <select name="range" id="range" className={styles.dropdown}>
                    <option value="recently_added">Range</option>
                    <option value="saab">Range</option>
                    <option value="mercedes">Range</option>
                    <option value="audi">Range</option>
                  </select>
                  */}
                </div>
                <div className={styles.top_right_side}>
                  <Link
                    to={"/app/create-project"}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <span className={styles.create_project_button}>
                      <MdAddCircleOutline /> Create Project
                    </span>
                  </Link>
                </div>
              </div>
            </div>
            <div className={styles.tableWrapper}>
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>S.no</th>
                      <th>Project Name</th>
                      <th>Documents</th>
                      <th>Created On</th>
                      <th>Last Modified</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  {loader && <div className={styles.loader} />}

                  <tbody>
                    {filteredProjects.length > 0 ? (
                      filteredProjects.map((project, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td style={{ textAlign: "left" }}>
                            <LuFolderOpen
                              color="#ae407a"
                              style={{ marginRight: "10px" }}
                            />
                            {project.project_name}
                          </td>
                          <td className={styles.files_table_data_container}>
                            {project.documents.length > 0 ? (
                              project.documents.map((doc, idx) => (
                                <div key={idx} className={styles.document_span}>
                                  <>
                                    <p
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "5px",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                      }}
                                    >
                                      <RxFileText color="#ae407a" />
                                      {doc.filename.split(".").shift()}
                                    </p>
                                  </>
                                  <span className={styles.type_container}>
                                    {doc.filename.split(".").pop()}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <p
                                style={{
                                  color: "red",
                                  fontWeight: "semibold",
                                  fontStyle: "italic",
                                }}
                              >
                                No documents found
                              </p>
                            )}
                          </td>

                          <td>
                            {new Date(project.created_at).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </td>
                          <td>
                            {new Date(project.updated_at).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </td>
                          <td>
                            <div className={styles.actionsContainer}>
                              <IoEyeOutline
                                color="#ae407a"
                                size={16}
                                onClick={() =>
                                  handleViewClick(project.project_id)
                                }
                              />
                              <FaRegEdit
                                color="#ae407a"
                                size={14}
                                onClick={() =>
                                  handleEditClick(project.project_id)
                                }
                              />
                              <HiOutlineTrash
                                color="#ae407a"
                                size={16}
                                onClick={
                                  () => openDeleteModal(project.project_id) // Open modal on delete
                                }
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ textAlign: "center" }}>
                          No projects found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* right_side */}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)} // Close modal
        onConfirm={handleDeleteProject} // Delete project on confirm
        title={"Project"}
      />
    </div>
  );
};

export default Projects;
