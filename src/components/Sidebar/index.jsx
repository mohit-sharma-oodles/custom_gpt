import React from "react";
import styles from "./index.module.scss";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
// assets
import logo from "../../assets/company_logo.svg";

//icons
import { FiFolderMinus } from "react-icons/fi";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { MdOutlineMail, MdOutlineCopyright } from "react-icons/md";

const Sidebar = () => {
  return (
    <div style={{ backgroundColor: "#f6f7f9" }}>
      <div className={styles.left_side}>
        <div className={styles.top}>
          <img src={logo} alt="Primadeta" />
        </div>
        <div className={styles.left_middle}>
          <div className={styles.left_menu}>
            <Link to="/app/projects" className={styles.left_menu}>
              <FiFolderMinus /> Projects
            </Link>
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.bottom_options}>
            <Link to="/faq" className={styles.bottom_options}>
              <AiOutlineQuestionCircle /> FAQ
            </Link>
          </div>
          <div className={styles.bottom_options}>
            <Link to="/contact-us" className={styles.bottom_options}>
              <MdOutlineMail /> Contact Us
            </Link>
          </div>
        </div>

        <div className={styles.footer}>
          <MdOutlineCopyright />
          Primadeta. Copyright 2024
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
