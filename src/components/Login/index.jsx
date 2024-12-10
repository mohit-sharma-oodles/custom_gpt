import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axios_instance } from "../../Axios/axiosInstance";
import {
  getUserDetails,
  loginUser,
  resendConfirmationEmail,
} from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";

// assets
import styles from "./index.module.scss";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import logo from "../../assets/company_logo_white.svg";
import tryItOut from "../../assets/tryItOut.svg";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const Login = ({ isOpen, onClose, onSignupClick }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local States
  const [viewPassword, setViewPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showResendButton, setShowResendButton] = useState(false);
  const [resendLoading, setResendLoading] = useState(false); // New state for resend loading

  // Redux States
  const { status, error, isAuthenticated } = useSelector(
    (state) => state.rootReducer.auth
  );

  // Handle closing the modal
  const handleClose = useCallback(() => {
    document.body.style.overflow = "auto";
    onClose();

    // Reset relevant states when closing the modal
    setEmail("");
    setPassword("");
    setShowResendButton(false);
    setViewPassword(false);
  }, [onClose]);

  // Handle login click
  const handleLoginClick = useCallback(
    async (e) => {
      e.preventDefault();

      // Validate input fields
      if (!email || !password) {
        toast.error(t("Please fill in both email and password."));
        return;
      }

      try {
        // Dispatch login action
        const loginAction = await dispatch(loginUser({ email, password }));

        if (loginAction.meta.requestStatus === "fulfilled") {
          toast.success(t("Login successful"));
          // Fetch user details after successful login
          const userDetailsAction = await dispatch(getUserDetails());

          if (userDetailsAction.meta.requestStatus === "fulfilled") {
            // Redirect to projects page
            navigate("/app/projects");
            handleClose();
          } else {
            toast.error(
              t("Failed to fetch user details. Please try again later.")
            );
          }
        } else {
          // Handle login failure
          const errorMessage =
            loginAction.payload?.message ||
            t("Login failed. Please try again later.");
          toast.error(errorMessage);

          // Show resend button if account is inactive
          if (
            errorMessage ===
            "This account is inactive. Please confirm your email."
          ) {
            setShowResendButton(true);
          }
        }
      } catch (error) {
        // Handle unexpected errors
        const errorMsg =
          error.message || t("An error occurred. Please try again.");
        toast.error(errorMsg);
        console.error("An error occurred:", errorMsg);
      }
    },
    [dispatch, email, password, navigate, handleClose, t]
  );

  // Handle resend confirmation email
  const handleResendEmail = async () => {
    if (!email) {
      toast.error(
        t("Please enter your email to resend the confirmation link.")
      );
      return;
    }

    setResendLoading(true);

    try {
      const response = await dispatch(resendConfirmationEmail({ email }));

      if (response.meta.requestStatus === "fulfilled") {
        toast.success(
          response.payload.message ||
            t("Confirmation email resent successfully.")
        );
        setShowResendButton(false); // Optionally hide the resend button after success
      } else {
        const errorMsg =
          response.payload?.message ||
          response.payload?.error ||
          t("Failed to resend confirmation email.");
        toast.error(errorMsg);
        setShowResendButton(true); // Keep the button visible on failure
      }
    } catch (e) {
      const errorMsg =
        e.response?.data?.message ||
        e.response?.data?.error ||
        t("An error occurred while resending the email.");
      toast.error(errorMsg);
      setShowResendButton(true);
    } finally {
      setResendLoading(false); // End loading for resend
    }
  };

  // Handle forgot password click
  const handleForgotPasswordClick = async () => {
    if (!email) {
      toast.error(t("Please enter your email to reset your password."));
      return;
    }
    try {
      const response = await axios_instance.post("/api/password-reset/", {
        email,
      });
      toast.success(response.data.message || t("Password reset email sent."));
    } catch (error) {
      const errorMsg =
        error.response?.data?.email?.[0] ||
        t("Failed to send password reset email.");
      toast.error(errorMsg);
    }
  };

  // Redirect on successful login
  useEffect(() => {
    if (status === "succeeded" && isAuthenticated) {
      navigate("/app/projects");
      handleClose(); // Ensure states are reset when navigating
    }
  }, [status, isAuthenticated, navigate, handleClose]);

  const handleGoogleLogin = async () => {
    const googleAuthURL = "https://customgpt-b.chattodata.com/api/auth/google/";
    window.location.href = googleAuthURL;
  };

  // Handle changes in the email input to reset relevant states
  const handleEmailChange = (e) => {
    setEmail(e.target.value.trim());
    setShowResendButton(false);
  };

  // Handle changes in the password input
  const handlePasswordChange = (e) => {
    setPassword(e.target.value.trim());
  };

  // Render nothing if the modal is not open
  if (!isOpen) return null;

  return (
    <div className={styles.modal} onClick={handleClose}>
      <div
        className={styles.modal_content}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.left_side}>
          {/* Left side content */}
          <div className={styles.container}>
            <img src={logo} alt="PrimAutomation" height={35} />
            <div className={styles.text_container}>
              <h2>{t("Welcome back to Primautomations.")}</h2>
              <p>
                {t(
                  "Your one stop solution for all document management and AI needs."
                )}
              </p>
            </div>
            <img
              src={tryItOut}
              alt={t("Try It Out")}
              className={styles.tryitout_image}
            />
          </div>
        </div>
        <div className={styles.right_side}>
          <span className={styles.close} onClick={handleClose}>
            &times;
          </span>
          <div className={styles.right_side_container}>
            <h2 className={`poppins-semibold`}>{t("Log In")}</h2>
            <form action="" className={styles.form} onSubmit={handleLoginClick}>
              <div className={styles.input_container}>
                <label htmlFor="email">{t("Email")}*</label>
                <div className={styles.input}>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder={t("Please enter your Email")}
                    value={email}
                    required
                    onChange={handleEmailChange}
                  />
                </div>
              </div>
              <div className={styles.input_container}>
                <label htmlFor="password">{t("Password")}*</label>
                <div className={`${styles.input} ${styles.password_input}`}>
                  <input
                    type={!viewPassword ? "password" : "text"}
                    name="password"
                    id="password"
                    placeholder={t("Please enter your password")}
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                  <div
                    onClick={() => setViewPassword(!viewPassword)}
                    style={{ cursor: "pointer" }} // Added cursor style for better UX
                  >
                    {viewPassword ? (
                      <FaRegEyeSlash style={{ marginBottom: "-4px" }} />
                    ) : (
                      <FaRegEye style={{ marginBottom: "-4px" }} />
                    )}
                  </div>
                </div>
                <div style={{ textAlign: "right", marginTop: "5px" }}>
                  <button
                    type="button"
                    onClick={handleForgotPasswordClick}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#32B4A2",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    {t("Forgot Password?")}
                  </button>
                </div>
              </div>

              <div className={styles.button_container}>
                {showResendButton && (
                  <button
                    style={{ marginBottom: "1rem" }}
                    type="button"
                    className={styles.login_btn}
                    onClick={handleResendEmail}
                    disabled={resendLoading} // Disable button while resending
                  >
                    {resendLoading
                      ? `${t("Resending...")}`
                      : `${t("Resend Confirmation Link")}`}
                  </button>
                )}
                <button
                  type="submit"
                  className={styles.login_btn}
                  disabled={status === "loading"} // Only disable based on login status
                >
                  {status === `loading`
                    ? `${t("Logging In")}...`
                    : `${t("Log In")}`}
                </button>
                <p>{t("or")}</p>
                <button
                  type="button"
                  className={`${styles.google_btn}`}
                  onClick={handleGoogleLogin}
                >
                  <FcGoogle size={24} />
                  <p>{t("Continue with Google")}</p>
                </button>
              </div>
            </form>
            <p>
              {t("Don't Have An Account?")}{" "}
              <span
                className={styles.signup_text}
                onClick={onSignupClick}
                style={{ cursor: "pointer" }} // Added cursor style for better UX
              >
                {t("Sign Up")}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
