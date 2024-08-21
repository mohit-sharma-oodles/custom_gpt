import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  confirmEmailWithToken,
  initializeAuth,
  resendConfirmationEmail,
} from "../../redux/authSlice";

const ConfirmEmail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showResendButton, setShowResendButton] = useState(false);
  const isAuthenticated = useSelector(
    (state) => state.rootReducer.auth.isAuthenticated
  );
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");
    const emailFromUrl = searchParams.get("email");
    setEmail(emailFromUrl);

    if (token) {
      dispatch(confirmEmailWithToken(token))
        .then((response) => {
          if (response.payload && !response.error) {
            dispatch(initializeAuth());
            // navigate("/");
          } else {
            setFeedback("Failed to confirm your email. Please try again.");
            setShowResendButton(
              response.payload?.message === "Invalid or expired token."
            );
          }
        })
        .catch(() => {
          setFeedback("An unexpected error occurred.");
          setShowResendButton(false);
        });
    } else {
      setFeedback("No token provided, please try again.");
      setShowResendButton(false);
    }
  }, [dispatch, location.search]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    console.log("isAuth", isAuthenticated);
    if (isAuthenticated && token) {
      navigate("/app/home");
    }
  }, [isAuthenticated]);

  const handleResendEmail = () => {
    if (email) {
      dispatch(resendConfirmationEmail({ email }))
        .then((response) => {
          if (response.payload && !response.error) {
            setFeedback("Confirmation email resent. Please check your inbox.");
            setShowResendButton(false);
          } else {
            setFeedback("Failed to resend confirmation email.");
            setShowResendButton(true);
          }
        })
        .catch(() => {
          setFeedback("Failed to resend confirmation email.");
          setShowResendButton(true);
        });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        gap: "1rem",
      }}
    >
      {showResendButton && (
        <>
          <p style={{ color: "red" }}>{feedback}</p>
          <span
            style={{
              borderRadius: "4px",
              border: "1px solid black",
              padding: "8px 16px",
              cursor: "pointer",
              boxShadow: "3px 3px 0px 0px rgba(0, 0, 0, 0.9)",
            }}
            onClick={handleResendEmail}
          >
            Resend Confirmation Email
          </span>
        </>
      )}
    </div>
  );
};

export default ConfirmEmail;
