import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserDetails } from "../../redux/authSlice";
import { useTranslation } from "react-i18next";

const PaymentSuccess = () => {
  const { t } = useTranslation();
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
          navigate("/app/subscription");
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
      <h1>{t("congratulations")}</h1>
      <p>{t("redirecting", { time })}</p>
    </div>
  );
};

export default PaymentSuccess;
