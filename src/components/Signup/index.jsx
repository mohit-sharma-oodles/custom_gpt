import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import left_banner from "../../assets/signup_banner.svg";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { signupUser, updateCountdown } from "../../redux/authSlice";

const Signup = ({ isOpen, onClose, onLoginClick }) => {
  const dispatch = useDispatch();

  // State for form steps
  const [step, setStep] = useState(1);
  const [viewPassword, setViewPassword] = useState(false);

  // Step 1: Personal information
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  // Step 2: Account details
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const { status, signupMessage, timeRemaining, error } = useSelector(
    (state) => state.rootReducer.auth
  );

  const handleClose = () => {
    document.body.style.overflow = "auto";
    onClose();
  };

  const handleNext = () => {
    if (!firstName || !lastName || !mobileNumber) {
      alert("Please fill in all required fields.");
      return;
    }
    setStep(2);
  };

  const formData = new FormData();
  formData.append("first_name", firstName);
  formData.append("last_name", lastName);
  formData.append("email", email);
  formData.append("password", password);
  formData.append("mobile_number", mobileNumber);

  if (profileImage) {
    formData.append("profile_picture", profileImage);
  }

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    dispatch(signupUser(formData))
      .then((signupAction) => {
        if (signupAction.meta.requestStatus === "fulfilled") {
          // Handle successful signup
          console.log("Signup successful", signupAction.payload);
        } else {
          // Handle signup failure
          console.error("Signup failed:", signupAction.payload);
          setErrorMessage(signupAction.payload?.email?.[0]);
        }
      })
      .catch((error) => {
        // This is where you handle the rejection from rejectWithValue
        console.error("An error occurred:", error.message);
      });
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
            <h2 className={`poppins-semibold`}>
              {step === 1 ? "Personal Information" : "Sign Up"}
            </h2>
            <form className={styles.form}>
              {step === 1 ? (
                <>
                  <div className={styles.input_container}>
                    <label htmlFor="firstName">First Name</label>
                    <div className={styles.input}>
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        placeholder="Enter your first name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className={styles.input_container}>
                    <label htmlFor="lastName">Last Name</label>
                    <div className={styles.input}>
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        placeholder="Enter your last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className={styles.input_container}>
                    <label htmlFor="mobileNumber">Mobile Number</label>
                    <div className={styles.input}>
                      <input
                        type="tel"
                        name="mobileNumber"
                        id="mobileNumber"
                        placeholder="Enter your mobile number"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className={styles.input_container}>
                    <label htmlFor="profileImage">Profile Image</label>
                    <div className={styles.input}>
                      <input
                        type="file"
                        name="profileImage"
                        id="profileImage"
                        accept="image/*"
                        onChange={(e) => setProfileImage(e.target.files[0])}
                      />
                    </div>
                  </div>
                  <div className={styles.button_container}>
                    <button
                      type="button"
                      className={styles.login_btn}
                      onClick={handleNext}
                    >
                      Next
                    </button>
                  </div>
                </>
              ) : (
                <>
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
                  </div>
                  {signupMessage && (
                    <h4 style={{ width: "100%", backgroundColor: "pink" }}>
                      {signupMessage}
                    </h4>
                  )}
                  {errorMessage && (
                    <p className={styles.error_message}>{errorMessage}</p>
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
                    {timeRemaining === 0 && (
                      <button
                        type="button"
                        className={styles.login_btn}
                        onClick={handleSignUp}
                      >
                        Resend Verification Email
                      </button>
                    )}
                    <p>or</p>
                    <button type="submit" className={`${styles.google_btn}`}>
                      <FcGoogle size={24} />
                      <p>Continue with Google</p>
                    </button>
                  </div>
                </>
              )}
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
