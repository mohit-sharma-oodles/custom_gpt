import React, { useState } from "react";
import styles from "./index.module.scss";
import left_banner from "../../assets/signup_banner.svg";
import { FaRegEye, FaRegEyeSlash, FaArrowLeft } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../../redux/authSlice";

const Signup = ({ isOpen, onClose, onLoginClick }) => {
  const dispatch = useDispatch();

  // State for form steps
  const [step, setStep] = useState(1);
  const [viewPassword, setViewPassword] = useState(false);
  const [viewConfirmPassword, setViewConfirmPassword] = useState(false);

  // Form fields state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);

  // Error handling state
  const [errorMessage, setErrorMessage] = useState("");

  const { signupMessage, error } = useSelector(
    (state) => state.rootReducer.auth
  );

  // Clear error message on input change
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value.trim());
    setErrorMessage("");
  };

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
    setErrorMessage("");
  };

  const handleClose = () => {
    document.body.style.overflow = "auto";
    onClose();
  };

  const handleNext = () => {
    if (!firstName || !lastName || !mobileNumber) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }
    if (mobileNumber.length < 9 || mobileNumber.length > 13) {
      setErrorMessage("Mobile number must be between 9 and 13 digits.");
      return;
    }
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;

    if (!hasMinLength) {
      return "Password must be at least 8 characters long.";
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!hasNumber) {
      return "Password must contain at least one number.";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character.";
    }

    return ""; // No error
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const passwordError = validatePassword(password);
    if (passwordError) {
      setErrorMessage(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setIsSigningUp(true);

    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("mobile_number", mobileNumber);

    if (profileImage) {
      formData.append("profile_picture", profileImage);
    }

    try {
      const signupAction = await dispatch(signupUser(formData)).unwrap();

      if (signupAction) {
        console.log("Signup successful", signupAction);
      }
    } catch (signupError) {
      const errors = signupError;
      console.log(signupError, "statussssssssss");

      if (errors.status >= 500) {
        console.log(errors.status);
        setErrorMessage("Server error. Please try again later.");
      }

      if (errors) {
        let allErrors = [];

        for (const key in errors) {
          if (errors[key].length > 0) {
            allErrors.push(...errors[key]);
          }
        }

        setErrorMessage(allErrors.join("\n"));
        console.log(errorMessage);
      }
    } finally {
      setIsSigningUp(false);
    }
  };

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
          {step !== 1 && (
            <div className={styles.back_button} onClick={handleBack}>
              <FaArrowLeft size={20} />
            </div>
          )}
          <span className={styles.close} onClick={handleClose}>
            &times;
          </span>
          <div className={styles.right_side_container}>
            <h2 className={`poppins-semibold`}>
              {step === 1 ? "Personal Information" : "Sign Up"}
            </h2>
            <form className={styles.form} onSubmit={handleSignUp}>
              {step === 1 ? (
                <>
                  <div className={styles.input_container}>
                    <label htmlFor="firstName">First Name*</label>
                    <div className={styles.input}>
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        placeholder="Enter your first name"
                        value={firstName}
                        onChange={handleInputChange(setFirstName)}
                        required
                      />
                    </div>
                  </div>
                  <div className={styles.input_container}>
                    <label htmlFor="lastName">Last Name*</label>
                    <div className={styles.input}>
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        placeholder="Enter your last name"
                        value={lastName}
                        onChange={handleInputChange(setLastName)}
                        required
                      />
                    </div>
                  </div>
                  <div className={styles.input_container}>
                    <label htmlFor="mobileNumber">Mobile Number*</label>
                    <div className={styles.input}>
                      <input
                        type="tel"
                        name="mobileNumber"
                        id="mobileNumber"
                        placeholder="Enter your mobile number"
                        maxLength={13}
                        minLength={9}
                        value={mobileNumber}
                        onChange={handleInputChange(setMobileNumber)}
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
                        onChange={handleFileChange}
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
                  {errorMessage && (
                    <p className={styles.error_message}>{errorMessage}</p>
                  )}
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
                        onChange={handleInputChange(setEmail)}
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
                        onChange={handleInputChange(setPassword)}
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
                        type={!viewConfirmPassword ? "password" : "text"}
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder="Please confirm your password"
                        value={confirmPassword}
                        onChange={handleInputChange(setConfirmPassword)}
                        required
                      />
                      <div
                        onClick={() =>
                          setViewConfirmPassword(!viewConfirmPassword)
                        }
                      >
                        {viewConfirmPassword ? (
                          <FaRegEyeSlash style={{ marginBottom: "-4px" }} />
                        ) : (
                          <FaRegEye style={{ marginBottom: "-4px" }} />
                        )}
                      </div>
                    </div>
                  </div>
                  {signupMessage && (
                    <h4
                      className={styles.error_message}
                      style={{ color: "black" }}
                    >
                      {signupMessage}
                    </h4>
                  )}
                  {errorMessage && (
                    <p className={styles.error_message}>{errorMessage}</p>
                  )}

                  <div className={styles.button_container}>
                    <button type="submit" className={styles.login_btn}>
                      {isSigningUp ? "Signing Up..." : "Sign Up"}
                    </button>
                    <p>or</p>
                    <button type="button" className={`${styles.google_btn}`}>
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
