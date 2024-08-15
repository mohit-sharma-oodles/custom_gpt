import React, { useState } from "react";
import styles from "./index.module.scss";
import { IoCloseSharp, IoLanguage } from "react-icons/io5";
import { FaRegUserCircle, FaUser } from "react-icons/fa";
import { PiSignOutBold } from "react-icons/pi";
import logo from "../../assets/company_logo.svg";
import { Link, useNavigate } from "react-router-dom";
import crown from "../../assets/crown_icon.svg";
import default_icon from "../../assets/vecteezy_user-profile-icon-profile-avatar-user-icon-male-icon_20911750.png";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/authSlice";
import Profile from "../Profile";

const ProfileModal = ({ onClose, setShowProfile, setShowProfileModal }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.rootReducer.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    onClose();
  };

  return (
    <div className={styles.profileModal}>
      <div className={styles.top_section}>
        <img src={user.profile_picture || default_icon} alt="User" />
        <div>
          <p className={styles.name}>{user.first_name}</p>
          <p className={styles.plan}>
            {" "}
            <img
              src={crown}
              style={{ height: "16px", width: "16px" }}
              alt="Crown"
            />
            {user?.current_plan}
            Premium
          </p>
        </div>
        <IoCloseSharp
          className={styles.closeIcon}
          onClick={setShowProfileModal}
        />
      </div>
      <div className={styles.button_container}>
        <button onClick={() => setShowProfile(true)}>
          <FaRegUserCircle />
          Profile
        </button>
        <button className={styles.signOut} onClick={handleLogout}>
          <PiSignOutBold color="red" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

const Header = ({ onLoginClick, onSignupClick, isAuthenticated }) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const { user } = useSelector((state) => state.rootReducer.auth);

  return (
    <div className={styles.container}>
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
              <img
                src={crown}
                style={{ width: "24px", height: "24px" }}
                alt="Crown"
              />
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
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <Link
                  to="/app/projects"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <span className={`clickable ${styles.signup_btn}`}>
                    My Projects
                  </span>
                </Link>
                <div
                  className={styles.profile_img_wrapper}
                  onClick={() => setShowProfileModal((prev) => !prev)}
                >
                  <img
                    src={user.profile_picture || default_icon}
                    alt="User"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  {showProfileModal && (
                    <ProfileModal
                      onClose={() => setShowProfileModal(false)}
                      setShowProfile={setShowProfile}
                      setShowProfileModal={setShowProfileModal}
                    />
                  )}
                </div>
              </div>
            )}
          </span>
        </div>
      </div>
      {showProfile && <Profile setShowProfile={setShowProfile} />}
    </div>
  );
};
export default Header;
