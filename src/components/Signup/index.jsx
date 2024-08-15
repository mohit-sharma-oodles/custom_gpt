import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import left_banner from "../../assets/signup_banner.svg";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { signupUser, updateCountdown } from "../../redux/authSlice";

const Signup = ({ isOpen, onClose, onLoginClick }) => {
  const dispatch = useDispatch();

  const [viewPassword, setViewPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { status, signupMessage, timeRemaining, error } = useSelector(
    (state) => state.rootReducer.auth
  );

  const handleClose = () => {
    document.body.style.overflow = "auto";
    onClose();
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    dispatch(signupUser({ email, password }));
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  useEffect(() => {
    let timer;
    if (timeRemaining > 0) {
      timer = setInterval(() => {
        dispatch(updateCountdown(timeRemaining - 1));
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [timeRemaining, dispatch]);

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
            <h2 className={`poppins-semibold`}>Sign Up</h2>
            <form action="" className={styles.form}>
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
                  />
                  <div onClick={() => setViewPassword(!viewPassword)}>
                    {viewPassword ? (
                      <FaRegEyeSlash style={{ marginBottom: "-4px" }} />
                    ) : (
                      <FaRegEye style={{ marginBottom: "-4px" }} />
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.input_container}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className={`${styles.input} ${styles.password_input}`}>
                  <input
                    type={!viewPassword ? "password" : "text"}
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="Please confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <div onClick={() => setViewPassword(!viewPassword)}>
                    {viewPassword ? (
                      <FaRegEyeSlash style={{ marginBottom: "-4px" }} />
                    ) : (
                      <FaRegEye style={{ marginBottom: "-4px" }} />
                    )}
                  </div>
                </div>
              </div>
              {signupMessage && (
                <h4 style={{ width: "100%", backgroundColor: "pink" }}>
                  {signupMessage}
                </h4>
              )}
              <div className={styles.button_container}>
                <button
                  type="submit"
                  className={styles.login_btn}
                  onClick={handleSignUp}
                >
                  {timeRemaining !== null && timeRemaining > 0
                    ? `Sign Up (${formatTime(timeRemaining)})`
                    : "Sign Up"}
                </button>
                <p>or</p>
                <button type="submit" className={`${styles.google_btn}  `}>
                  <FcGoogle size={24} />
                  <p>Continue with Google</p>
                </button>
              </div>
            </form>
            <p>
              Already Have An Account?{" "}
              <span className={styles.signup_text} onClick={onLoginClick}>
                Log In
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
