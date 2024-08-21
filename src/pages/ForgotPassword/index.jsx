import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./index.module.scss"; // Assuming you have a CSS/SCSS module
import { axios_instance } from "../../Axios/axiosInstance";

const ForgotPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [uid, setUid] = useState("");
  const [token, setToken] = useState("");

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const uidFromUrl = params.get("uid");
    const tokenFromUrl = params.get("token");

    if (uidFromUrl && tokenFromUrl) {
      setUid(uidFromUrl);
      setToken(tokenFromUrl);
    } else {
      setMessage("Invalid password reset link.");
    }
  }, [location.search]); // Added location.search as a dependency

  useEffect(() => {
    if (uid && token) {
      console.log("UID:", uid);
      console.log("Token:", token);
    }
  }, [uid, token]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const sanitizedToken = token.endsWith("/") ? token.slice(0, -1) : token;

    const body = {
      uid: uid,
      token: sanitizedToken,
      new_password: password,
    };

    try {
      const response = await axios_instance.post(
        "/api/password-reset-confirm/",
        body
      );

      if (response.status !== 200) {
        throw new Error("Failed to reset password. Please try again.");
      }

      setMessage("Password reset successful. You can now log in.");
    } catch (error) {
      if (error.response && error.response.data) {
        // Check for non_field_errors and display the first error message
        const errors = error.response.data.non_field_errors;
        if (errors && errors.length > 0) {
          setMessage(errors[0]);
        } else {
          setMessage("An error occurred. Please try again.");
        }
      } else {
        setMessage(error.message || "An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className={styles.forgotPasswordContainer}>
      <h2>Reset Your Password</h2>
      <form onSubmit={handleSubmit} className={styles.forgotPasswordForm}>
        <div className={styles.inputContainer}>
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter new password"
            required
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Confirm new password"
            required
          />
        </div>
        {message && <p className={styles.message}>{message}</p>}
        <button type="submit" className={styles.submitButton}>
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
