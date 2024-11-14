import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { FaRegEye, FaRegEyeSlash, FaArrowLeft } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../../redux/authSlice";
import logo from "../../assets/company_logo_white.svg";
import tryItOut from "../../assets/tryItOut.svg";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = ({ isOpen, onClose, onLoginClick }) => {
  const { t } = useTranslation();
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

  const { signupMessage, error } = useSelector(
    (state) => state.rootReducer.auth
  );

  // Display toast notifications for signup messages and errors
  useEffect(() => {
    if (signupMessage) {
      toast.success(signupMessage);
    }
    if (error) {
      toast.error(error);
    }
  }, [signupMessage, error]);

  // Handle input changes
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value.trim());
  };

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleClose = () => {
    document.body.style.overflow = "auto";
    onClose();
  };

  const handleNext = () => {
    if (!firstName || !lastName || !mobileNumber) {
      toast.error(t("Please fill in all required fields."));
      return;
    }
    if (mobileNumber.length < 9 || mobileNumber.length > 13) {
      toast.error(t("Mobile number must be between 9 and 13 digits."));
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
      return t("Password must be at least 8 characters long.");
    }
    if (!hasUpperCase) {
      return t("Password must contain at least one uppercase letter.");
    }
    if (!hasNumber) {
      return t("Password must contain at least one number.");
    }
    if (!hasSpecialChar) {
      return t("Password must contain at least one special character.");
    }

    return ""; // No error
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      toast.error(t("Passwords do not match"));
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
        // console.log("Signup successful", signupAction);
        toast.success(t("Signup successful!"));
      }
    } catch (signupError) {
      const errors = signupError;

      if (errors.status >= 500) {
        toast.error(t("Server error. Please try again later."));
      } else if (errors) {
        let allErrors = [];

        for (const key in errors) {
          if (errors[key].length > 0) {
            allErrors.push(...errors[key]);
          }
        }

        toast.error(allErrors.join("\n"));
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
          <div className={styles.container}>
            <img src={logo} alt={t("PrimAutomation")} height={35} />
            <div className={styles.text_container}>
              <h2>{t("Welcome back to Prima deta Automations.")}</h2>
              <p>
                {t(
                  "Your one stop solution for all document management and AI needs."
                )}
              </p>
            </div>
            <img src={tryItOut} className={styles.tryitout_image} alt="" />
          </div>
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
              {step === 1 ? t("Personal Information") : t("Sign Up")}
            </h2>
            <form className={styles.form} onSubmit={handleSignUp}>
              {step === 1 ? (
                <>
                  <div className={styles.input_container}>
                    <label htmlFor="firstName">{t("First Name")}*</label>
                    <div className={styles.input}>
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        placeholder={t("Enter your first name")}
                        value={firstName}
                        onChange={handleInputChange(setFirstName)}
                        required
                      />
                    </div>
                  </div>
                  <div className={styles.input_container}>
                    <label htmlFor="lastName">{t("Last Name")}*</label>
                    <div className={styles.input}>
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        placeholder={t("Enter your last name")}
                        value={lastName}
                        onChange={handleInputChange(setLastName)}
                        required
                      />
                    </div>
                  </div>
                  <div className={styles.input_container}>
                    <label htmlFor="mobileNumber">{t("Mobile Number")}*</label>
                    <div className={styles.input}>
                      <input
                        type="tel"
                        name="mobileNumber"
                        id="mobileNumber"
                        placeholder={t("Enter your mobile number")}
                        maxLength={13}
                        minLength={9}
                        value={mobileNumber}
                        onChange={handleInputChange(setMobileNumber)}
                        required
                      />
                    </div>
                  </div>
                  <div className={styles.input_container}>
                    <label htmlFor="profileImage">{t("Profile Image")}</label>
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
                      {t("Next")}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.input_container}>
                    <label htmlFor="email">{t("Email")}</label>
                    <div className={styles.input}>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder={t("Please enter your Email")}
                        value={email}
                        onChange={handleInputChange(setEmail)}
                        required
                      />
                    </div>
                  </div>
                  <div className={styles.input_container}>
                    <label htmlFor="password">{t("Password")}</label>
                    <div className={`${styles.input} ${styles.password_input}`}>
                      <input
                        type={viewPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        placeholder={t("Please enter your password")}
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
                    <label htmlFor="confirmPassword">
                      {t("Confirm Password")}
                    </label>
                    <div className={`${styles.input} ${styles.password_input}`}>
                      <input
                        type={viewConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder={t("Please confirm your password")}
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
                  <div className={styles.button_container}>
                    <button type="submit" className={styles.login_btn}>
                      {isSigningUp ? t("Signing Up...") : t("Sign Up")}
                    </button>
                    <p>{t("or")}</p>
                    <button type="button" className={styles.google_btn}>
                      <FcGoogle size={24} />
                      <p>{t("Continue with Google")}</p>
                    </button>
                  </div>
                </>
              )}
            </form>
            <p>
              {t("Already Have An Account?")}{" "}
              <span className={styles.signup_text} onClick={onLoginClick}>
                {t("Log In")}
              </span>
            </p>
          </div>
        </div>
      </div>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default Signup;
