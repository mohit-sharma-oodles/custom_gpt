import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { confirmEmailWithToken, initializeAuth } from "../../redux/authSlice";

const ConfirmEmail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState(null);
  const [showResendButton, setShowResendButton] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");

    if (token) {
      dispatch(confirmEmailWithToken(token))
        .then((response) => {
          if (response.meta.requestStatus === "fulfilled") {
            dispatch(initializeAuth());
            navigate("/");
          } else {
            const errorMsg = response.error.message;
            setErrorMessage(
              "Failed to confirm your email. The token might be invalid or expired."
            );
            console.error("Error confirming email:", errorMsg);

            // Check if the error message indicates an expired token
            if (errorMsg.includes("Token is invalid or expired")) {
              setShowResendButton(true);
            }
          }
        })
        .catch((error) => {
          console.error("Error in the confirm email process:", error.message);
          setErrorMessage("An unexpected error occurred.");
        });
    } else {
      console.error("No token found in the URL");
      setErrorMessage("No token found in the URL.");
    }
  }, [dispatch, navigate, location]);

  const handleResendEmail = () => {
    // Implement the logic to resend the confirmation email
    console.log("Resend email logic goes here");
    // Example: dispatch(resendConfirmationEmail());
  };

  return (
    <div>
      <h2>Confirming your email...</h2>
      {errorMessage && <p>{errorMessage}</p>}
      {showResendButton && (
        <button onClick={handleResendEmail}>Resend Confirmation Email</button>
      )}
    </div>
  );
};

export default ConfirmEmail;
