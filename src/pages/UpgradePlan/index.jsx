import React, { useEffect, useState } from "react";
import { axios_instance } from "../../Axios/axiosInstance";
import styles from "./index.module.scss";
import { useLocation } from "react-router-dom";
import crown from "../../assets/crown_icon.svg";
import bullet from "../../assets/features_bullet.svg";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const UpgradePlan = () => {
  const location = useLocation();
  const [plans, setPlans] = useState([]);
  const [subscriptionId, setSubscriptionId] = useState();
  const [priceId, setPriceId] = useState();
  const [error, setError] = useState("");

  const params = new URLSearchParams(location.search);
  const wannaBuy = params.get("id");
  const proratedPrice = params.get("p");

  useEffect(() => {
    const getPlans = () => {
      axios_instance
        .get("/api/products")
        .then((response) => setPlans(response.data))
        .catch((error) => setError(error.toString()));
    };
    getPlans();
  }, []);

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

  // useEffect(() => {
  //   if (plans.length > 0 && wannaBuy) {
  //     const activePlan = plans.find(
  //       (plan) => plan.stripe_product_id === wannaBuy
  //     );
  //     if (activePlan) {
  //       setPriceId(activePlan.active_price.stripe_price_id);
  //     }
  //   }
  // }, [plans, wannaBuy]); // Update priceId based on plans and selection

  // const handleUpgrade = async () => {
  //   try {
  //     const stripe = await stripePromise;
  //     const response = await axios_instance.post(
  //       "/subscriptions/create-checkout-session/",
  //       {
  //         product_id: wannaBuy,
  //         is_upgrade: true,
  //       }
  //     );
  //     const { id } = response.data;
  //     const { error } = await stripe.redirectToCheckout({ sessionId: id });
  //     if (error) throw error;
  //   } catch (error) {
  //     console.error("Error during checkout process:", error);
  //   }
  // };

  const handleUpgrade = async () => {
    try {
      const stripe = await stripePromise;
      const response = await axios_instance.post(
        "/subscriptions/create-upgrade-subscription/",
        {
          subscription_id: subscriptionId,
          price_id: wannaBuy,
        }
      );
      const { id } = response.data;
      const { error } = await stripe.redirectToCheckout({ sessionId: id });
      if (error) throw error;
    } catch (error) {
      console.error("Error during checkout process:", error);
    }
  };

  return (
    <div className={styles.outer_container}>
      <h2 style={{ marginTop: "2rem" }}>
        You are going to upgrade your plan. Here is the breakdown of the
        upgraded plan.
      </h2>

      <div className={styles.container}>
        {plans.map((curr, idx) => {
          // Check if current plan is subscribed or if it matches the 'wannaBuy' ID
          // console.log(curr.active_price.stripe_price_id);
          // setPriceId(curr.active_price.stripe_price_id);
          // console.log(curr.active_price.stripe_price_id === wannaBuy);

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
                    <span className={styles.tile_permonth_text}>/ month</span>
                  </h4>
                  <p className={styles.exclusive_text}>* exclusive of taxes</p>
                </div>
                <div className={styles.tile_middle_container}>
                  <span className={styles.left_gradient}></span>
                  <p className={styles.features}>Features</p>
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
          return null; // Do not render anything if conditions are not met
        })}
      </div>
      <button className={styles.payBtn} onClick={() => handleUpgrade(wannaBuy)}>
        Pay $ {proratedPrice}
      </button>
    </div>
  );
};

export default UpgradePlan;