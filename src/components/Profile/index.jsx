import React, { useState, useRef, useEffect } from "react";
import styles from "./index.module.scss";
import ProgressBar from "@ramonak/react-progress-bar";

//assets
import { IoCloseSharp } from "react-icons/io5";
import defaultUser from "../../assets/person_default.png";
import crown from "../../assets/crown_icon.svg";
import { FaPencilAlt, FaCamera, FaEye, FaEyeSlash } from "react-icons/fa";
import { FiDownloadCloud } from "react-icons/fi";

//redux and axios
import { updateUserDetails } from "../../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { axios_instance } from "../../Axios/axiosInstance";
import { useNavigate } from "react-router-dom";

const Profile = ({ setShowProfile }) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

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

  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [productName, setProductName] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios_instance.get("/api/profile");
        // console.log(response.data, "response");
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios_instance.get("/subscriptions/history/");
        setPaymentData(response.data);
        console.log(paymentData);
      } catch (error) {
        console.error("Error fetching payment data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchCurrentSubscription = async () => {
      try {
        const response = await axios_instance.get(
          "/subscriptions/subscription-details/"
        );
        if (response.data) {
          console.log(response.data);
          setProductName(response.data.product_name);
        }
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching current subscription:", error);
      }
    };
    fetchCurrentSubscription();
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
    try {
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
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  const handleImageChange = (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        setSelectedImage(file);
        setProfilePicture(URL.createObjectURL(file));
        setHasChanges(true);
        // try{
        //   const formData = new FormData();
        //   formData.append("first_name", firstName);
        //   dispatch(updateUserDetails())
        // }catch{

        // }
      }
    } catch (error) {
      console.error("Error handling image change:", error);
    }
  };

  // password change logic
  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value.trim());
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value.trim());
  };

  const handleSavePassword = async () => {
    if (!oldPassword || !password) {
      alert("Please enter both your old and new password before saving.");
      return;
    }
    try {
      const response = await axios_instance.post("change-password/", {
        current_password: oldPassword,
        new_password: password,
      });
      console.log(response.data);
      alert("Password updated successfully!");
      setIsEditingPassword(false);
      setOldPassword("");
      setPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password.");
    }
  };
  const handleCancel = async () => {
    // Show confirmation dialog
    const confirmCancel = window.confirm(
      "You are going to cancel your subscription. Do you want to continue?"
    );

    if (confirmCancel) {
      try {
        const response = await axios_instance.post(
          "/subscriptions/cancel-subscription/"
        );

        if (response.data.message === "Subscription cancelled successfully") {
          // Alert success message
          alert("Subscription cancelled successfully");

          // Reload the page to reflect changes
          window.location.reload();
        }
      } catch (error) {
        console.error("Error cancelling subscription:", error);
        alert(
          error.response?.data?.error ||
            "An error occurred while cancelling the subscription."
        );
      }
    } else {
      // If user cancels, do nothing (or close modal, etc.)
      console.log("Subscription cancellation was aborted.");
    }
  };

  const handleRedirectToSubscription = () => {
    navigate("/app/subscription");
    setShowProfile(false);
  };

  return (
    <div className={styles.profileOverlay}>
      <div className={styles.profileContainer}>
        <div className={styles.header}>
          <div className={styles.left_side}>
            <div className={styles.profileImageContainer}>
              <img
                src={defaultUser}
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
                <img
                  src={profilePicture}
                  alt="User"
                  style={{ marginRight: 0 }}
                />
                {/* <label htmlFor="upload-button" className={styles.uploadButton}>
                  <FaCamera />
                </label> */}
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
                <p className={styles.joinDate}>Joined on {user.date_joined}</p>
              </div>
            </div>
            <div className={styles.subscribedPlanInfo}>
              <div className={styles.left_side}>
                <div className={styles.left_side_wrapper}>
                  {user.current_subscription_plan && (
                    <>
                      <img
                        src={crown}
                        style={{ height: "20px", width: "20px" }}
                        alt="Crown"
                      />
                      <p style={{ fontWeight: "500", fontSize: "20px" }}>
                        {user.current_subscription_plan}
                      </p>
                      {user.subscription_status === "Cancelled" && (
                        <p style={{ fontWeight: "300", fontSize: "10px" }}>
                          (cancelled)
                        </p>
                      )}
                    </>
                  )}
                  {user.days_left === null && <h2>No current active plan.</h2>}
                </div>
                {user.days_left && (
                  <>
                    <ProgressBar
                      completed={user.days_left}
                      maxCompleted={30}
                      labelColor={"transparent"}
                      bgColor={"#ae407a"}
                      height="14px"
                      animateOnRender={true}
                    />
                    <div style={{ marginTop: "12px" }}>
                      {user.days_left} /30 Days
                    </div>
                  </>
                )}
              </div>
              <div className={styles.right_side}>
                <span
                  onClick={handleRedirectToSubscription}
                  className={styles.upgrade_plan}
                >
                  {user.subscription_status === "active" && user.days_left > 0
                    ? "Upgrade Plan"
                    : "Buy Plan"}
                </span>

                {user.subscription_status === "active" && user.days_left && (
                  <span onClick={handleCancel} className={styles.cancel_plan}>
                    Cancel Plan
                  </span>
                )}
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
                style={{
                  backgroundColor: "#32b4a2",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginTop: "3rem",
                  fontWeight: 500,
                  boxShadow: "3px 4px 0px 0px rgba(0, 0, 0, 0.9)",
                }}
                className={styles.updateButton}
                onClick={handleUpdateDetails}
              >
                Update Details
              </span>
            )}
          </div>

          <div className={styles.passwordChangeSection}>
            <h3>Change Password</h3>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0,
                }}
              >
                <span className={styles.label}>
                  Old Password
                  <FaPencilAlt
                    className={styles.pencilIcon}
                    onClick={() => setIsEditingPassword(true)}
                  />
                </span>
                <span
                  className={`${styles.editable} ${
                    isEditingPassword ? styles.underline : ""
                  }`}
                >
                  <input
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    placeholder="********"
                    onChange={handleOldPasswordChange}
                    disabled={!isEditingPassword}
                    className={styles.editableInput}
                  />
                  {oldPassword.length > 0 && (
                    <span
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className={styles.icon}
                    >
                      {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  )}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                <span className={styles.label}>
                  New Password
                  <FaPencilAlt
                    className={styles.pencilIcon}
                    onClick={() => setIsEditingPassword(true)}
                  />
                </span>
                <span
                  className={`${styles.editable} ${
                    isEditingPassword ? styles.underline : ""
                  }`}
                >
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={password}
                    placeholder="********"
                    onChange={handlePasswordChange}
                    disabled={!isEditingPassword}
                    className={styles.editableInput}
                  />
                  {password.length > 0 && (
                    <span
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className={styles.icon}
                    >
                      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  )}
                </span>
              </div>
            </div>
            {isEditingPassword && (
              <button
                className={styles.saveButton}
                onClick={handleSavePassword}
              >
                Save New Password
              </button>
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
                  {paymentData.length > 0 ? (
                    paymentData.map((payment, index) => (
                      <tr
                        key={
                          payment.transaction_id === null
                            ? "transaction id null"
                            : payment.transaction_id
                        }
                      >
                        <td>{index + 1}</td>
                        <td>
                          #
                          {payment.transaction_id === null
                            ? "transaction id null"
                            : payment.transaction_id}
                        </td>
                        <td>{payment.payment_date}</td>
                        <td>{payment.payment_method}</td>
                        <td>
                          <a href={payment.invoice_url} download>
                            <FiDownloadCloud /> Download
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        No prior transaction data available.
                      </td>
                    </tr>
                  )}
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

const handleCancel = async () => {
  // Show confirmation dialog
  const confirmCancel = window.confirm(
    "You are going to cancel your subscription. Do you want to continue?"
  );

  if (confirmCancel) {
    try {
      const response = await axios_instance.post(
        "/subscriptions/cancel-subscription/"
      );

      if (response.data.message === "Subscription cancelled successfully") {
        // Alert success message
        alert("Subscription cancelled successfully");

        // Reload the page to reflect changes
        window.location.reload();
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      alert(
        error.response?.data?.error ||
          "An error occurred while cancelling the subscription."
      );
    }
  } else {
    // If user cancels, do nothing (or close modal, etc.)
    console.log("Subscription cancellation was aborted.");
  }
};
