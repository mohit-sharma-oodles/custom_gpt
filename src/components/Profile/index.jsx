import React, { useState, useRef } from "react";
import styles from "./index.module.scss";
import { IoCloseSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import defaultUser from "../../assets/person_default.png";
import crown from "../../assets/crown_icon.svg";
import { FaPencilAlt } from "react-icons/fa";
import { updateUserDetails } from "../../redux/authSlice";

const Profile = ({ setShowProfile }) => {
  const { user } = useSelector((state) => state.rootReducer.auth);
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [mobileNumber, setMobileNumber] = useState(user.mobile_number);
  const [focusedInput, setFocusedInput] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const mobileNumberRef = useRef(null);

  const handleEditClick = (ref, field) => {
    setFocusedInput(field);
    ref.current.focus();
  };

  const handleChange = (setter, originalValue, newValue) => {
    setter(newValue);
    if (newValue !== originalValue) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  };

  const handleUpdateDetails = () => {
    const updatedDetails = {
      first_name: firstName,
      last_name: lastName,
      mobile_number: mobileNumber,
    };
    dispatch(updateUserDetails(updatedDetails));
    setHasChanges(false);
    setFocusedInput(null);
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
                <p className={styles.joinDate}>Joined on {user.joined_date}</p>
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
                days left
              </div>
              <div className={styles.right_side}>
                <span className={styles.upgrade_plan}>Upgrade Plan</span>
              </div>
            </div>
          </div>
          <div className={styles.personalInfo}>
            <h3>Personal Information</h3>
            <div className={styles.infoGrid}>
              <div>
                <span className={styles.label}>
                  First Name{" "}
                  <FaPencilAlt
                    className={styles.pencilIcon}
                    onClick={() => handleEditClick(firstNameRef, "firstName")}
                  />
                </span>
                <span className={styles.editable}>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) =>
                      handleChange(
                        setFirstName,
                        user.first_name,
                        e.target.value
                      )
                    }
                    ref={firstNameRef}
                    className={`${styles.editableInput} ${
                      focusedInput === "firstName" ? styles.underline : ""
                    }`}
                  />
                </span>
              </div>
              <div>
                <span className={styles.label}>
                  Last Name{" "}
                  <FaPencilAlt
                    className={styles.pencilIcon}
                    onClick={() => handleEditClick(lastNameRef, "lastName")}
                  />
                </span>
                <span className={styles.editable}>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) =>
                      handleChange(setLastName, user.last_name, e.target.value)
                    }
                    ref={lastNameRef}
                    className={`${styles.editableInput} ${
                      focusedInput === "lastName" ? styles.underline : ""
                    }`}
                  />
                </span>
              </div>
              <div>
                <span className={styles.label}>Email Address</span>
                <span>{user.email}</span>
              </div>
              <div>
                <span className={styles.label}>
                  Phone Number{" "}
                  <FaPencilAlt
                    className={styles.pencilIcon}
                    onClick={() =>
                      handleEditClick(mobileNumberRef, "mobileNumber")
                    }
                  />
                </span>
                <span className={styles.editable}>
                  <input
                    type="text"
                    value={mobileNumber}
                    onChange={(e) =>
                      handleChange(
                        setMobileNumber,
                        user.mobile_number,
                        e.target.value
                      )
                    }
                    ref={mobileNumberRef}
                    className={`${styles.editableInput} ${
                      focusedInput === "mobileNumber" ? styles.underline : ""
                    }`}
                  />
                </span>
              </div>
              <div>
                <span className={styles.label}>Password</span>
                <span>************</span>
              </div>
            </div>
          </div>
          {hasChanges && (
            <span className={styles.updateButton} onClick={handleUpdateDetails}>
              Update Details
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
