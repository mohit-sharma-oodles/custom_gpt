import React, { useEffect, useState } from "react";
import { axios_instance } from "../../Axios/axiosInstance";
import styles from "./index.module.scss";
import { useLocation } from "react-router-dom";
import crown from "../../assets/crown_icon.svg";
import bullet from "../../assets/features_bullet.svg";
import { loadStripe } from "@stripe/stripe-js";
import { useTranslation } from "react-i18next";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const UpgradePlan = () => {
  const { t } = useTranslation();

  const location = useLocation();
  const [plans, setPlans] = useState([]);
  const [subscriptionId, setSubscriptionId] = useState();
  const [priceId, setPriceId] = useState();
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [countdown, setCountdown] = useState(3);
  const [showPayButton, setShowPayButton] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const params = new URLSearchParams(location.search);
  const wannaBuy = params.get("id");
  const proratedPrice = params.get("p");
  const language_code = localStorage.getItem("i18nextLng");

  useEffect(() => {
    const getPlans = () => {
      axios_instance
        .get(`/api/products?lang=${language_code}`)
        .then((response) => setPlans(response.data))
        .catch((error) => setError(error.toString()));
    };
    getPlans();
  }, [language_code]);

  useEffect(() => {
    const getSubscriptionID = () => {
      axios_instance
        .get("/subscriptions/subscription-details/")
        .then((response) => {
          console.log(response.data.stripe_subscription_id);
          setSubscriptionId(response.data.stripe_subscription_id);
        })
        .catch((error) => setError(error.toString()));
    };
    getSubscriptionID();
  }, []);

  const handleUpgrade = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      const stripe = await stripePromise;
      const response = await axios_instance.post(
        "/subscriptions/create-upgrade-subscription/",
        {
          subscription_id: subscriptionId,
          price_id: wannaBuy,
        }
      );
      // Assuming the payment is successful
      setShowPayButton(false); // Hide the pay button

      // Countdown logic
      let countdownValue = 3;
      const countdownInterval = setInterval(() => {
        setSuccessMessage(
          `${t("upgradeSuccessMessage")}, ${countdownValue}...`
        );
        countdownValue--;

        if (countdownValue < 0) {
          clearInterval(countdownInterval);
          window.location.href = "/app/subscription";
        }
      }, 1000);
    } catch (error) {
      alert(error);
      console.error("Error during checkout process:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.outer_container}>
      <h2 style={{ marginTop: "2rem" }}>
        {t(
          "You are going to upgrade your plan. Here is the breakdown of the upgraded plan."
        )}
      </h2>

      <div className={styles.container}>
        {plans.map((curr, idx) => {
          if (
            curr.is_subscribed ||
            curr.active_price.stripe_price_id === wannaBuy
          ) {
            return (
              <div key={idx} className={styles.tile_container}>
                <div className={styles.tile_top_container}>
                  <span className={styles.tile_heading_container}>
                    <img
                      src={crown}
                      style={{ height: "24px", width: "24px" }}
                    />
                    <h3 className={styles.tile_heading}>{curr.name}</h3>
                  </span>
                  <p className={styles.tile_subheading}>{curr.description}</p>
                  <h4 className={styles.tile_price}>
                    ${curr.active_price.amount}{" "}
                    <span className={styles.tile_permonth_text}>
                      / {t("month")}
                    </span>
                  </h4>
                  <p className={styles.exclusive_text}>
                    * {t("exclusive of taxes")}
                  </p>
                </div>
                <div className={styles.tile_middle_container}>
                  <span className={styles.left_gradient}></span>
                  <p className={styles.features}>{t("Features")}</p>
                  <span className={styles.right_gradient}></span>
                </div>
                <div className={styles.tile_bottom_container}>
                  {curr.features.map((feature, featureIdx) => (
                    <div key={featureIdx} className={styles.feature_container}>
                      <img src={bullet} alt="&#10003;" />
                      <p className={styles.feature}>{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>

      {successMessage && (
        <h4 className={styles.successMessage}>{successMessage}</h4>
      )}
      {showPayButton && (
        <button
          className={styles.payBtn}
          onClick={handleUpgrade}
          disabled={isLoading} // Disable the button when loading
        >
          {isLoading
            ? `${t("Processing")}...`
            : `${t("Pay")} $ ${proratedPrice}`}
        </button>
      )}
    </div>
  );
};

export default UpgradePlan;
