import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { IoCloseSharp, IoLanguage } from "react-icons/io5";
import { FaRegUserCircle, FaUser } from "react-icons/fa";
import { PiSignOutBold } from "react-icons/pi";
import logo from "../../assets/company_logo.svg";
import { Link, useNavigate } from "react-router-dom";
import crown from "../../assets/crown_icon.svg";
import default_icon from "../../assets/person_default.png";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/authSlice";
import Profile from "../Profile";

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { logoutUser } from "../../redux/actions"; // Adjust import based on your actual file structure
// import styles from "./ProfileModal.module.scss"; // Assuming this is your style file
// import { IoCloseSharp } from "react-icons/io5";
// import { FaRegUserCircle } from "react-icons/fa";
// import { PiSignOutBold } from "react-icons/pi";
// import default_icon from "../../assets/default_icon.svg"; // Replace with your actual path
// import crown from "../../assets/crown_icon.svg"; // Replace with your actual path

const ProfileModal = ({ onClose, setShowProfile, setShowProfileModal }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState(localStorage.getItem("user"));
  console.log(user);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      console.log(user);
    }
  }, []);
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
    onClose();
  };

  return (
    <div className={styles.profileModal}>
      <div className={styles.top_section}>
        <img
          style={{
            borderRadius: "50%",
          }}
          src={user?.profile_picture || default_icon}
          alt="User"
        />
        <div>
          <p className={styles.name}>{user?.first_name || "Guest"}</p>
          <p className={styles.plan}>
            {user?.current_subscription_plan !== null && (
              <img
                src={crown}
                style={{ height: "16px", width: "16px" }}
                alt="Crown"
              />
            )}
            {user?.current_subscription_plan || "No Plan"}
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

const Header = ({ onLoginClick, onSignupClick }) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const { user, isAuthenticated } = useSelector(
    (state) => state.rootReducer.auth
  );

  const handleProfileImageClick = () => {
    setShowProfileModal((prev) => !prev);
  };

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
                  onClick={handleProfileImageClick}
                >
                  <img
                    src={user?.profile_picture || default_icon}
                    alt="User"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
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
