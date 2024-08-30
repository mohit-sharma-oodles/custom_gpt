import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(interval);
          navigate("/app/home");
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
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
