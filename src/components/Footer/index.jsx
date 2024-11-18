import React from "react";
import styles from "./index.module.scss";
import { useTranslation } from "react-i18next";

// assets
import logo from "../../assets/company_logo.svg";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <div className={`contain_center ${styles.inner}`}>
        <img src={logo} alt="Primadeta" className={styles.company_logo} />
        <p>
          <span>2024</span>{" "}
          <a style={{ color: "#ae407a" }} href="https://primautomation.com/">
            Primautomation.com
          </a>
          {t(". All Rights Reserved.")}
        </p>
        <div className={styles.company_logos}>
          <a
            href="https://www.facebook.com/primautomation"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookF
              color="#ae407a"
              style={{
                border: "1px solid #ae407a",
                padding: "8px",
                borderRadius: "50%",
              }}
            />
          </a>
          <a
            href="https://linkedin.com/company/primautomation"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedinIn
              color="#ae407a"
              style={{
                border: "1px solid #ae407a",
                padding: "8px",
                borderRadius: "50%",
              }}
            />
          </a>
          <a
            href="https://x.com/primautomation"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaXTwitter
              color="#ae407a"
              style={{
                border: "1px solid #ae407a",
                padding: "8px",
                borderRadius: "50%",
              }}
            />
          </a>
          <a
            href="https://www.instagram.com/primautomation"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram
              color="#ae407a"
              style={{
                border: "1px solid #ae407a",
                padding: "8px",
                borderRadius: "50%",
              }}
            />
          </a>
          <a
            href="https://www.tiktok.com/@primautomation"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTiktok
              color="#ae407a"
              style={{
                border: "1px solid #ae407a",
                padding: "8px",
                borderRadius: "50%",
              }}
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
