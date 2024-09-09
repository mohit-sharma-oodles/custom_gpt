import React from "react";
import styles from "./index.module.scss";
import { useSelector } from "react-redux";
// assets
import logo from "../../assets/company_logo.svg";

//icons
import { MdAddCircleOutline } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";

//components
import Sidebar from "../../components/Sidebar";
import PartialHeader from "../../components/PartialHeader";
import { Link } from "react-router-dom";

const Projects = () => {
  const { user } = useSelector((state) => state.rootReducer.auth);
  const localstorageuser = localStorage.getItem("user");

  // return <div>{user?.email}</div>;
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
                    <input type="text" name="" id="" placeholder="Search" />
                  </div>
                  <select
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
              {/* // TODO: Get the list of all the projects and then render them in the table */}
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>S.no</th>
                      <th>Transaction ID</th>
                      <th>Payment Date and Time</th>
                      <th>Payment Mode</th>
                      <th> Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr key={2}>
                      <td>{1 + 1}</td>
                      <td>45</td>
                      <td>date</td>
                      <td>fghjk</td>
                      <td>fghjfghk</td>
                    </tr>
                    {/* ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        No prior transaction data available.
                      </td>
                    </tr>
                    )} */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* right_side */}
    </div>
  );
};

export default Projects;
