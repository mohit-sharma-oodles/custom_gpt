import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axios_instance } from "../../Axios/axiosInstance";
import { getUserDetails, loginUser } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";

// assets
import styles from "./index.module.scss";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import left_banner from "../../assets/login_banner.svg";
import logo from "../../assets/company_logo_white.svg";
import tryItOut from "../../assets/tryItOut.svg";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const Login = ({ isOpen, onClose, onSignupClick }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // states
  const [viewPassword, setViewPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const { status, error, isAuthenticated } = useSelector(
    (state) => state.rootReducer.auth
  );

  // Handle closing the modal
  const handleClose = useCallback(() => {
    document.body.style.overflow = "auto";
    onClose();
  }, [onClose]);

  // Handle login click
  const handleLoginClick = useCallback(
    (e) => {
      e.preventDefault();

      if (!email || !password) {
        setMessage("Please fill in both email and password.");
        return;
      }

      dispatch(loginUser({ email, password }))
        .then((loginAction) => {
          if (loginAction.meta.requestStatus === "fulfilled") {
            toast.success("Login successful");

            return dispatch(getUserDetails());
          } else {
            // Handle login failure
            const errorMessage =
              loginAction.payload?.message ||
              "Login failed. Please try again later.";
            setMessage(errorMessage);
            return Promise.reject(new Error(errorMessage));
          }
        })
        .then((userDetailsAction) => {
          if (userDetailsAction.meta.requestStatus === "fulfilled") {
            console.log(userDetailsAction.payload);
          } else {
            console.error(
              "Failed to fetch user details:",
              userDetailsAction.error.message
            );
          }
        })
        .catch((error) => {
          // This will handle both login and user details fetch errors
          setMessage(error.message || "An error occurred. Please try again.");
          console.error("An error occurred:", error.message);
        });
    },
    [dispatch, email, password]
  );

  // Handle forgot password click
  const handleForgotPasswordClick = async () => {
    if (!email) {
      setMessage("Please enter your email to reset your password.");
      return;
    }
    try {
      const response = await axios_instance.post("/api/password-reset/", {
        email,
      });
      alert(response.data.message);
    } catch (error) {
      toast.error(error.response.data.email[0]);
    }
  };

  // Redirect on successful login
  useEffect(() => {
    if (status === "succeeded" && isAuthenticated) {
      navigate("/app/projects");
      onClose();
    }
  }, [status, isAuthenticated, navigate, onClose]);

  const handleGoogleLogin = async () => {
    const googleAuthURL = "https://customgpt-b.chattodata.com/api/auth/google/";
    window.location.href = googleAuthURL;

    // const popupListener = setInterval(() => {
    //   if (popup.closed) {
    //     clearInterval(popupListener);

    //     // Reload the page to reflect any changes
    //     // window.location.reload();
    //   }
    // }, 2000);

    // const messageListener = (event) => {
    //   // Check for the origin if needed
    //   // if (event.origin !== "http://127.0.0.1:8001") return;

    //   console.log(event.data);
    //   const { token } = event.data;
    //   if (token) {
    //     localStorage.setItem("access", token);

    //     // Optionally, dispatch an action to update the user state if needed
    //     dispatch(getUserDetails());

    //     // Redirect to the app home or dashboard after dispatch
    //     navigate("/app/home");
    //   }
    // };

    // // Add event listener for message event
    // window.addEventListener("message", messageListener);

    // // Remove the event listener when the popup is closed
    // popup.addEventListener("unload", () => {
    //   window.removeEventListener("message", messageListener);
    // });
    // window.location.reload();
  };
  // render
  if (!isOpen) return null;
  return (
    <div className={styles.modal} onClick={handleClose}>
      <div
        className={styles.modal_content}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.left_side}>
          {/* <img src={left_banner} alt="Pimadeta" /> */}
          <div className={styles.container}>
            <img src={logo} alt="PrimAutomation" srcset="" height={35} />
            <div className={styles.text_container}>
              <h2>{t("Welcome back to Prima deta Automations.")}</h2>
              <p>
                {t(
                  "Your one stop solution for all document management and AI needs."
                )}
              </p>
            </div>
            <img src={tryItOut} srcset="" className={styles.tryitout_image} />
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
                <label htmlFor="email">Email*</label>
                <div className={styles.input}>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder={t("Please enter your Email")}
                    value={email}
                    required
                    onChange={(e) => {
                      setEmail(e.target.value.trim());
                    }}
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
                    onChange={(e) => setPassword(e.target.value.trim())}
                    required
                  />
                  <div onClick={() => setViewPassword(!viewPassword)}>
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

              {/* Display error message */}
              {message && <p className={styles.error_message}>{message}</p>}

              <div className={styles.button_container}>
                <button
                  type="submit"
                  className={styles.login_btn}
                  disabled={status === "loading"}
                >
                  {status === `loading`
                    ? `${t("Logging In")}...`
                    : `${t("Log In")}`}
                </button>
                <p>{t("or")}</p>
                <button
                  type="button"
                  className={`${styles.google_btn}`}
                  onClick={async () => {
                    await handleGoogleLogin();
                    // if(localStorage.getItem(user)){
                    //   window.location.reload()
                    // }
                  }}
                >
                  <FcGoogle size={24} />
                  <p>{t("Continue with google")}</p>
                </button>
              </div>
            </form>
            <p>
              {t("Don't Have An Account?")}{" "}
              <span className={styles.signup_text} onClick={onSignupClick}>
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
