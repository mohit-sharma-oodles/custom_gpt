import React from "react";
import styles from "./index.module.scss";
import { IoCloseSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
import defaultUser from "../../assets/vecteezy_user-profile-icon-profile-avatar-user-icon-male-icon_20911750.png";
import crown from "../../assets/crown_icon.svg";
import { useNavigate } from "react-router-dom";

const Profile = ({ setShowProfile }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.rootReducer.auth);

  const handleUpgradeClick = () => {
    navigate("/app/subscription");
    setShowProfile(false); // Close the profile after navigating
  };

  return (
    <div className={styles.profileOverlay}>
      <div className={styles.profileContainer}>
        <div className={styles.header}>
          <div className={styles.left_side}>
            <img src={user.profile_picture || defaultUser} alt="User" />
            <h2>Profile</h2>
          </div>
          <IoCloseSharp
            className={styles.closeIcon}
            onClick={() => setShowProfile(false)}
          />
        </div>
        <div className={styles.profileContent}>
          <div className={styles.top_container}>
            <div className={styles.userInfo}>
              <img src={user.profile_picture || defaultUser} alt="User" />
              <div>
                <p className={styles.name}>
                  {user.first_name} {user.last_name}
                </p>
                <p className={styles.joinDate}>
                  Joined on {user.joined_date} {/* Adjust as needed */}
                </p>
              </div>
            </div>
            <div className={styles.subscribedPlanInfo}>
              <div className={styles.left_side}>
                <div className={styles.left_side_wrapper}>
                  <img
                    src={crown}
                    style={{ height: "20px", width: "20px" }}
                    alt="Crown"
                  />
                  {user?.current_plan} Premium
                </div>
                days left {/* Add the correct days left logic here */}
              </div>
              <div className={styles.right_side}>
                <span
                  className={styles.upgrade_plan}
                  onClick={handleUpgradeClick}
                >
                  Upgrade Plan
                </span>
              </div>
            </div>
          </div>
          <div className={styles.personalInfo}>
            <h3>Personal Information</h3>
            <div className={styles.infoGrid}>
              <div>
                <span className={styles.label}>First Name</span>
                <span>{user.first_name}</span>
              </div>
              <div>
                <span className={styles.label}>Last Name</span>
                <span>{user.last_name}</span>
              </div>
              <div>
                <span className={styles.label}>Email Address</span>
                <span>{user.email}</span>
              </div>
              <div>
                <span className={styles.label}>Phone Number</span>
                <span>{user.mobile_number}</span>
              </div>
              <div>
                <span className={styles.label}>Password</span>
                <span>************</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
