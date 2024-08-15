import React from "react";
import styles from "./index.module.scss";
import { useSelector } from "react-redux";

const Projects = () => {
  const { user } = useSelector((state) => state.rootReducer.auth);
  const localstorageuser = localStorage.getItem("user");

  // return <div>{user?.email}</div>;
  return (
    <div className={styles.container}>
      <div className={styles.left_side}></div>
      <div className={styles.middle}></div>
      <div className={styles.right_side}></div>
    </div>
  );
};

export default Projects;
