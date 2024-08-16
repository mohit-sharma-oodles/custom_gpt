import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { confirmEmailWithToken, initializeAuth } from "../../redux/authSlice";

const ConfirmEmail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState(null);

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
            setErrorMessage(
              "Failed to confirm your email. The token might be invalid or expired."
            );
            console.error("Error confirming email:", response.error.message);
          }
        })
        .catch((error) => {
          // Catch any error in the promise chain
          console.error("Error in the confirm email process:", error.message);
          setErrorMessage("An unexpected error occurred.");
        });
    } else {
      console.error("No token found in the URL");
      setErrorMessage("No token found in the URL.");
    }
  }, [dispatch, navigate]);

  return (
    <div>
      <h2>Confirming your email...</h2>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default ConfirmEmail;
