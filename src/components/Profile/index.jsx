import React, { useState, useRef, useEffect } from "react";
import styles from "./index.module.scss";
import ProgressBar from "@ramonak/react-progress-bar";

//assets
import { IoCloseSharp } from "react-icons/io5";
import defaultUser from "../../assets/person_default.png";
import crown from "../../assets/crown_icon.svg";
import { FaPencilAlt, FaCamera } from "react-icons/fa";
import { FiDownloadCloud } from "react-icons/fi";

//redux and axios
import { updateUserDetails } from "../../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { axios_instance } from "../../Axios/axiosInstance";

const Profile = ({ setShowProfile }) => {
  const { user } = useSelector((state) => state.rootReducer.auth);
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [mobileNumber, setMobileNumber] = useState(user.mobile_number);
  const [profilePicture, setProfilePicture] = useState(
    user.profile_picture || defaultUser
  );
  const [focusedInput, setFocusedInput] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const mobileNumberRef = useRef(null);
  const [paymentData, setPaymentData] = useState([]);

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const response = await axios_instance.get("/api/payment-data");
    //     setPaymentData(response.data);
    //   } catch (error) {
    //     console.error("Error fetching payment data:", error);
    //   }
    // };
    // fetchData();
  }, []);

  useEffect(() => {
    document.body.classList.add("no-scroll");

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

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
    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("mobile_number", mobileNumber);

    if (selectedImage) {
      formData.append("profile_picture", selectedImage);
    }

    dispatch(updateUserDetails(formData));
    setHasChanges(false);
    setFocusedInput(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setProfilePicture(URL.createObjectURL(file));
      setHasChanges(true);
    }
  };

  return (
    <div className={styles.profileOverlay}>
      <div className={styles.profileContainer}>
        <div className={styles.header}>
          <div className={styles.left_side}>
            <div className={styles.profileImageContainer}>
              <img
                src={profilePicture}
                alt="User"
                className={styles.profileImage}
              />
            </div>
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
              <div>
                <img src={profilePicture} alt="User" />
                <label htmlFor="upload-button" className={styles.uploadButton}>
                  <FaCamera />
                </label>
                <input
                  type="file"
                  id="upload-button"
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
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
                <ProgressBar
                  completed={user.days_left}
                  maxCompleted={30}
                  labelColor={"transparent"}
                  bgColor={"#ae407a"}
                />
                {user.days_left}
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
            </div>
            {hasChanges && (
              <span
                className={styles.updateButton}
                onClick={handleUpdateDetails}
              >
                Update Details
              </span>
            )}
          </div>
          <div className={styles.paymentContainer}>
            <h2 className={styles.heading}>Payment history</h2>
            <div className={styles.table_container}>
              <table className={styles.paymentTable}>
                <thead>
                  <tr>
                    <th>S.no</th>
                    <th>Transaction ID</th>
                    <th>Payment Date and Time</th>
                    <th>Payment Mode</th>
                    <th> Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {paymentData.length > 0 ? (
            paymentData.map((payment, index) => (
              <tr key={payment.transaction_id}>
                <td>{index + 1}</td>
                <td>{payment.transaction_id}</td>
                <td>{new Date(payment.payment_date).toLocaleString()}</td>
                <td>{payment.payment_mode}</td>
                <td>
                  <a href={payment.receipt_url} download>
                    Download
                  </a>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>
                No data available
              </td>
            </tr>
          )} */}
                  <tr key={20}>
                    <td>{1}</td>
                    <td>123456</td>
                    <td>Date</td>
                    <td>Card</td>
                    <td>
                      <a href={"somelink"} download>
                        <FiDownloadCloud /> Download Receipt
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
