import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const CancelPayment = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [time, setTime] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(timer);
          navigate("/app/subscription");
          return 0;
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontWeight: 500,
          color: "red",
        }}
      >
        {t("Payment Cancelled Redirecting in")} {time}...
      </h1>
    </div>
  );
};

export default CancelPayment;
