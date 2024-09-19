import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserDetails, initializeAuth } from "../../redux/authSlice";

const OAuth = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const accessToken = queryParams.get("access");
  const refreshToken = queryParams.get("refresh");

  useEffect(() => {
    if (accessToken && refreshToken) {
      // Save tokens to localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Dispatch to get user details and save user data once resolved
      dispatch(getUserDetails(accessToken))
        .then((res) => {
          if (res.payload) {
            // Assuming the data is in res.payload
            localStorage.setItem("user", JSON.stringify(res.payload));
          }
          dispatch(initializeAuth());
          navigate("/");

          // Close the window after the user details are saved
          // window.close();
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
        });
    }
  }, [accessToken, refreshToken, dispatch]);

  return <div>Redirecting...</div>;
};

export default OAuth;
