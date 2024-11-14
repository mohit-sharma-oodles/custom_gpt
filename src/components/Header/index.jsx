import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
import { axios_instance } from "../../Axios/axiosInstance";

const ProfileModal = ({ onClose, setShowProfile, setShowProfileModal }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [user, setUser] = useState({});
  const [subscription, setSubscription] = useState("");

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await axios_instance.get("/api/profile/");
        setUser(response.data);
      } catch (e) {
        console.log(e);
      }
    };
    getProfile();
  }, []);

  useEffect(() => {
    const getDetails = async () => {
      try {
        const response = await axios_instance.get(
          "/subscriptions/subscription-details/"
        );
        setSubscription(response.data.product_name);
      } catch (e) {
        console.log(e);
      }
    };
    getDetails();
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
    onClose();
  };

  // if (!user) {
  //   return null; // or a loading spinner, etc.
  // }

  return (
    <div className={styles.profileModal}>
      <div className={styles.top_section}>
        <img
          style={{
            borderRadius: "50%",
          }}
          src={user?.profile_picture || default_icon}
          alt={t("User")}
        />
        <div>
          <p className={styles.name}>{user?.first_name}</p>
          <p className={styles.plan}>
            {subscription.length !== 0 && (
              <img
                src={crown}
                style={{ height: "16px", width: "16px" }}
                alt={t("Crown")}
              />
            )}
            {subscription}
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
          {t("Profile")}
        </button>
        <button className={styles.signOut} onClick={handleLogout}>
          <PiSignOutBold color="red" />
          {t("Sign Out")}
        </button>
      </div>
    </div>
  );
};

const Header = ({ onLoginClick, onSignupClick }) => {
  const { t, i18n } = useTranslation();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    setSelectedLanguage(language);
  };

  // console.log(user.is_enterprise);

  const { isAuthenticated } = useSelector((state) => state.rootReducer.auth);

  const handleProfileImageClick = () => {
    setShowProfileModal((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.wrapper} `}>
        {/* <Link to="/" style={{ textDecoration: "none", color: "inherit" }}> */}
        <Link
          to="https://primautomation.com/"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className={`${styles.left_side_wrapper}`}>
            <img src={logo} alt="Primadeta" className={styles.company_logo} />
          </div>
        </Link>
        <div className={styles.right_side_Wrapper}>
          {!user?.is_enterprise && (
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
                {t("Subscriptions")}
              </span>
            </Link>
          )}
          <Link to="/faq" style={{ textDecoration: "none", color: "inherit" }}>
            <span className="clickable">{t("FAQ")}</span>
          </Link>
          <Link
            to="/contact-us"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <span className="clickable">{t("Contact Us")}</span>
          </Link>

          <div className={styles.language_selector} onClick={toggleModal}>
            <span className="clickable">
              <IoLanguage
                size={24}
                color="grey"
                style={{ marginBottom: "-7px" }}
              />
            </span>

            {isModalOpen && (
              <div className={styles.language_modal}>
                <label
                  onClick={() => changeLanguage("en")}
                  style={{ display: "flex", gap: "1rem" }}
                >
                  <input type="checkbox" checked={selectedLanguage === "en"} />
                  English
                </label>
                <br />
                <label
                  onClick={() => changeLanguage("nl")}
                  style={{ display: "flex", gap: "1rem" }}
                >
                  <input type="checkbox" checked={selectedLanguage === "nl"} />
                  Dutch
                </label>
              </div>
            )}
          </div>

          <span className={styles.auth_btn_contnainer}>
            {!isAuthenticated ? (
              <>
                <span
                  onClick={onLoginClick}
                  className={`clickable ${styles.login_btn}`}
                >
                  {t("Log In")}
                </span>
                <span
                  onClick={onSignupClick}
                  className={`clickable ${styles.signup_btn}`}
                >
                  {t("Sign Up")}
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
                    {t("My Projects")}
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
