import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserDetails } from "../../redux/authSlice";

const PaymentSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [time, setTime] = useState(5);

  useEffect(() => {
    let intervalId;

    const timer = () => {
      setTime((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(intervalId);
          navigate("/app/home");
          dispatch(getUserDetails());
          return 0;
        }
      });
    };

    intervalId = setInterval(timer, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <h1>Congratulations! &#127881; Your payment was successfull.</h1>
      <p>Redirecting you to home in {time}</p>
    </div>
  );
};

export default PaymentSuccess;
