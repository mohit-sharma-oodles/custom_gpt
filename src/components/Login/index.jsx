import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.scss";
import left_banner from "../../assets/login_banner.svg";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { getUserDetails, loginUser } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { axios_instance } from "../../Axios/axiosInstance";

const Login = ({ isOpen, onClose, onSignupClick }) => {
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
  const handleForgotPasswordClick = () => {
    if (!email) {
      setMessage("Please enter your email to reset your password.");
      return;
    }

    axios_instance.post("/api/password-reset/", { email });

    // Implement forgot password logic here
    console.log("Forgot password clicked for email:", email);
  };

  // Redirect on successful login
  useEffect(() => {
    if (status === "succeeded" && isAuthenticated) {
      navigate("/app/home");
      onClose();
    }
  }, [status, isAuthenticated, navigate, onClose]);

  // render
  if (!isOpen) return null;
  return (
    <div className={styles.modal} onClick={handleClose}>
      <div
        className={styles.modal_content}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.left_side}>
          <img src={left_banner} alt="Pimadeta" />
        </div>
        <div className={styles.right_side}>
          <span className={styles.close} onClick={handleClose}>
            &times;
          </span>
          <div className={styles.right_side_container}>
            <h2 className={`poppins-semibold`}>Log In</h2>
            <form action="" className={styles.form} onSubmit={handleLoginClick}>
              <div className={styles.input_container}>
                <label htmlFor="email">Email</label>
                <div className={styles.input}>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Please enter your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className={styles.input_container}>
                <label htmlFor="password">Password</label>
                <div className={`${styles.input} ${styles.password_input}`}>
                  <input
                    type={!viewPassword ? "password" : "text"}
                    name="password"
                    id="password"
                    placeholder="Please enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                      color: "#007bff",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    Forgot Password?
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
                  {status === "loading" ? "Logging In..." : "Log In"}
                </button>
                <p>or</p>
                <button
                  type="button"
                  className={`${styles.google_btn}`}
                  onClick={() => {
                    // TODO: Change the link below
                    window.open(
                      "https://14b6-125-63-73-50.ngrok-free.app/api/auth/google/"
                    );
                  }}
                >
                  <FcGoogle size={24} />
                  <p>Continue with google</p>
                </button>
              </div>
            </form>
            <p>
              Don't Have An Account?{" "}
              <span className={styles.signup_text} onClick={onSignupClick}>
                Sign Up
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
