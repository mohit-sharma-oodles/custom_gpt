import React from "react";
import styles from "./index.module.scss";

// assets
import logo from "../../assets/company_logo.svg";
import { FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={`contain_center ${styles.inner}`}>
        <img src={logo} alt="Primadeta" className={styles.company_logo} />
        <p>
          <span>2024</span>{" "}
          <a style={{ color: "#ae407a" }} href="https://primeautomations.com/">
            Primautomations.com
          </a>
          . All Rights Reserved.
        </p>
        <div className={styles.company_logos}>
          <FaFacebookF
            color="#ae407a"
            style={{
              border: "1px solid #ae407a",
              padding: "8px",
              borderRadius: "50%",
            }}
          />
          <FaLinkedinIn
            color="#ae407a"
            style={{
              border: "1px solid #ae407a",
              padding: "8px",
              borderRadius: "50%",
            }}
          />
          <FaTwitter
            color="#ae407a"
            style={{
              border: "1px solid #ae407a",
              padding: "8px",
              borderRadius: "50%",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Footer;
