import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./index.module.scss"; // Assuming you have a CSS/SCSS module
import { axios_instance } from "../../Axios/axiosInstance";

const ForgotPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [uid, setUid] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [countdown, setCountdown] = useState(null);
  const [showResendButton, setShowResendButton] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const uidFromUrl = params.get("uid");
    const tokenFromUrl = params.get("token");
    const emailFromUrl = params.get("email");

    if (uidFromUrl && tokenFromUrl) {
      setUid(uidFromUrl);
      setToken(tokenFromUrl);
      setEmail(emailFromUrl);
    } else {
      setMessage("Invalid password reset link.");
    }
  }, [location.search]);

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
    // setCountdown(3);
    // const intervalId = setInterval(() => {
    //   setCountdown((prevCount) => {
    //     if (prevCount === 1) {
    //       clearInterval(intervalId);
    //       navigate("/?openLogin=true");
    //     }
    //     return prevCount - 1;
    //   });
    // }, 1000);

    // Regular expression to match:
    // - at least one special character
    // - at least one uppercase letter
    // - at least one digit
    // - minimum length of 8 characters
    const passwordRegex =
      /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(password)) {
      setMessage(
        "Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character."
      );
      return;
    }

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
        "password-reset-confirm/",
        body
      );

      if (response.status !== 200) {
        throw new Error("Failed to reset password. Please try again.");
      }

      setMessage("Password reset successful. You can now log in.");
      setCountdown(3);
      const intervalId = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount === 1) {
            clearInterval(intervalId);
            navigate("/?openLogin=true");
          }
          return prevCount - 1;
        });
      }, 1000);
    } catch (error) {
      if (error.response && error.response.data) {
        // Handle non-field errors like an expired reset link
        const nonFieldErrors = error.response.data.non_field_errors;
        if (
          nonFieldErrors &&
          nonFieldErrors.includes("The password reset link has expired.")
        ) {
          setShowResendButton(true);
          setMessage(
            "The password reset link has expired. Please request a new one."
          );
        } else if (nonFieldErrors && nonFieldErrors.length > 0) {
          setMessage(nonFieldErrors[0]);
        } else {
          // Handle specific password errors
          const passwordErrors = error.response.data.new_password;
          if (
            passwordErrors &&
            passwordErrors.includes("This password is too common.")
          ) {
            setMessage(
              "This password is too common. Please choose a different one."
            );
          } else {
            setMessage("An error occurred. Please try again.");
          }
        }
      } else {
        setMessage(error.message || "An error occurred. Please try again.");
      }
    }
  };
  const handleResend = async (e) => {
    e.preventDefault();
    try {
      const response = await axios_instance.post("password-reset/", {
        email: email,
      });
      console.log(response);
      setMessage("Password reset link sent. Please check your email.");
      setShowResendButton(false);
    } catch (error) {
      setMessage("Failed to send password reset link. Please try again.");
    }
  };

  return (
    <div className={styles.forgotPasswordContainer}>
      <h2
        style={{ textAlign: "center", marginBottom: "20px", fontWeight: "600" }}
      >
        Reset Your Password
      </h2>
      <form className={styles.forgotPasswordForm}>
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
        {showResendButton && (
          <button
            onClick={handleResend}
            type="submit"
            className={styles.submitButton}
          >
            Resend Link
          </button>
        )}
        {!showResendButton && (
          <button
            onClick={handleSubmit}
            type="submit"
            className={styles.submitButton}
          >
            Reset Password
          </button>
        )}
      </form>
      {countdown && (
        <p style={{ marginTop: "1rem" }}>
          Navigating to Home in {countdown} seconds
        </p>
      )}
    </div>
  );
};

export default ForgotPassword;
