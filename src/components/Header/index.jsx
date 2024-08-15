import React, { useState } from "react";
import styles from "./index.module.scss";
import { IoCloseSharp, IoLanguage } from "react-icons/io5";
import { FaRegUserCircle, FaUser } from "react-icons/fa";
import logo from "../../assets/company_logo.svg";
import { Link, useNavigate } from "react-router-dom";
import crown from "../../assets/crown_icon.svg";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/authSlice";

const ProfileModal = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.rootReducer.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <div className={styles.profileModal}>
      {user}
      <div className={styles.top_section}>
        <img
          src={user.profile_picture || "default_profile_image_url"}
          alt="User"
        />
        <div>
          <p className={styles.name}>{user.first_name}</p>
          <p className={styles.plan}>
            {" "}
            <img src={crown} style={{ height: "16px", width: "16px" }} />
            Premium
          </p>
        </div>
        <IoCloseSharp className={styles.closeIcon} onClick={onClose} />
      </div>
      <div className={styles.button_container}>
        <button onClick={() => navigate("/app/profile")}>
          <FaRegUserCircle />
          Profile
        </button>
        <button className="signOut" onClick={handleLogout}>
          <FaUser />
          Sign Out
        </button>
      </div>
    </div>
  );
};

const Header = ({ onLoginClick, onSignupClick, isAuthenticated }) => {
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleLogout = () => {
    setShowProfileModal((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      {/* <h5>{isAuthenticated ? "true" : "false"}</h5> */}
      <div className={`${styles.wrapper} `}>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <div className={`${styles.left_side_wrapper}`}>
            <img src={logo} alt="Primadeta" className={styles.company_logo} />
          </div>
        </Link>
        <div className={styles.right_side_Wrapper}>
          <Link
            to={isAuthenticated ? "app/subscription" : "/subscription"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <span className={`clickable ${styles.subscription_container}`}>
              <img src={crown} style={{ width: "24px", height: "24px" }} />
              Subscriptions
            </span>
          </Link>
          <Link to="/faq" style={{ textDecoration: "none", color: "inherit" }}>
            <span className="clickable">FAQ</span>
          </Link>
          <Link
            to="/contact-us"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <span className="clickable">Contact Us</span>
          </Link>
          <span className="clickable">
            <IoLanguage
              size={24}
              color="grey"
              style={{ marginBottom: "-7px" }}
            />
          </span>
          <span className={styles.auth_btn_contnainer}>
            {!isAuthenticated ? (
              <>
                <span
                  onClick={onLoginClick}
                  className={`clickable ${styles.login_btn}`}
                >
                  Log In
                </span>
                <span
                  onClick={onSignupClick}
                  className={`clickable ${styles.signup_btn}`}
                >
                  Sign Up
                </span>
              </>
            ) : (
              <>
                <Link
                  to="/app/projects"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <span className={`clickable ${styles.signup_btn}`}>
                    My Projects
                  </span>
                </Link>
                <div
                  onClick={handleLogout}
                  style={{
                    height: "20px",
                    width: "20px",
                    borderRadius: "40px",
                    backgroundColor: "lightGrey",
                    position: "relative",
                  }}
                >
                  {}
                  <FaUser />
                  {showProfileModal && <ProfileModal />}
                </div>
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;
