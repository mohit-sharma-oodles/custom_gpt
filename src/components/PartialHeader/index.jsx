import React, { useState } from "react";
import styles from "./index.module.scss";
import { IoCloseSharp, IoLanguage } from "react-icons/io5";
import { FaRegUserCircle, FaUser } from "react-icons/fa";
import { PiSignOutBold } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import crown from "../../assets/crown_icon.svg";
import default_icon from "../../assets/person_default.png";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/authSlice";
import Profile from "../Profile";

const ProfileModal = ({ onClose, setShowProfile, setShowProfileModal }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.rootReducer.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
    onClose();
  };

  return (
    <div className={styles.profileModal}>
      <div className={styles.top_section}>
        <img src={user?.profile_picture || default_icon} alt="User" />
        <div>
          <p className={styles.name}>{user?.first_name}</p>
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

const PartialHeader = ({ title = "Projects" }) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleProfileImageClick = () => {
    setShowProfileModal((prev) => !prev);
  };
  const { user, isAuthenticated } = useSelector(
    (state) => state.rootReducer.auth
  );

  return (
    <div className={styles.container}>
      <h1>{title}</h1>

      <div className={styles.right_Side_container}>
        <Link
          to={"/subscription"}
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
        <span className="clickable">
          <IoLanguage size={24} color="grey" style={{ marginBottom: "-7px" }} />
        </span>
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
      {showProfile && <Profile setShowProfile={setShowProfile} />}
    </div>
  );
};

export default PartialHeader;
