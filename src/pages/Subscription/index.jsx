import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import crown from "../../assets/crown_icon.svg";
import bullet from "../../assets/features_bullet.svg";
import { axios_instance } from "../../Axios/axiosInstance";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const SubscriptionTile = ({
  heading,
  subHeading,
  price,
  features = [],
  showCrown = false,
  productId,
  is_subscribed,
  isAlreadySubscribed,
  current_active_plan_price,
  priceId,
}) => {
  const navigate = useNavigate();
  const [proratedPrice, setProratedPrice] = useState();

  const handleBuyNow = async (productId) => {
    try {
      // const atoken = localStorage.getItem("accessToken");
      // const rtoken = localStorage.getItem("refreshToken");
      // const user = localStorage.getItem("user");

      const stripe = await stripePromise;
      const response = await axios_instance.post(
        "/subscriptions/create-checkout-session/",
        {
          product_id: productId,
        }
      );

      const { id } = response.data;

      const { error } = await stripe.redirectToCheckout({
        sessionId: id,
      });

      if (error) {
        console.error("Stripe Checkout Error:", error);
      }
    } catch (error) {
      console.error(
        "Error during checkout process:",
        error.response.data.detail
      );
      if (
        error.response.data.detail ===
        "Authentication credentials were not provided."
      ) {
        alert("You are not logged in.");
      }
    }
  };

  useEffect(() => {
    if (proratedPrice !== undefined) {
      navigate(`/app/upgrade-plan?id=${priceId}&p=${proratedPrice}`);
    }
  }, [proratedPrice]);

  const handleUpgradePlan = async (priceId, productId) => {
    try {
      let formData = new FormData();
      formData.append("price_id", priceId);

      const response = await axios_instance.post(
        "/subscriptions/get-prorated-amount/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProratedPrice(response.data.prorated_amount);
    } catch (e) {
      console.log(e);
      if (
        e.response.data.detail ===
        "Authentication credentials were not provided."
      ) {
        alert("You are not logged in.");
      }
      console.error("Error upgrading plan", e);
    }
  };

  const handleButtonClick = () => {
    // console.log(isAlreadySubscribed, current_active_plan_price, price);
    if (
      isAlreadySubscribed &&
      Number(current_active_plan_price) < Number(price)
    ) {
      // console.log(Number(current_active_plan_price) < Number(price));
      handleUpgradePlan(priceId, productId);
    } else if (isAlreadySubscribed === false) {
      handleBuyNow(productId);
    }
  };

  return (
    <div className={styles.tile_container}>
      <div className={styles.tile_top_container}>
        <span className={styles.tile_heading_container}>
          {showCrown && (
            <img src={crown} style={{ height: "24px", width: "24px" }} />
          )}
          <h3 className={styles.tile_heading}>{heading}</h3>
        </span>
        <p className={styles.tile_subheading}>{subHeading}</p>
        <h4 className={styles.tile_price}>
          ${price} <span className={styles.tile_permonth_text}>/ month</span>
        </h4>
        <p className={styles.exclusive_text}>* exclusive of taxes</p>
      </div>
      <div className={styles.tile_middle_container}>
        <span className={styles.left_gradient}></span>
        <p className={styles.features}>Features</p>
        <span className={styles.right_gradient}></span>
      </div>
      <div className={styles.tile_bottom_container}>
        {features.map((feature, idx) => {
          return (
            <div key={idx} className={styles.feature_container}>
              <img src={bullet} alt="&#10003;" />
              <p className={styles.feature}>{feature.description}</p>
            </div>
          );
        })}
      </div>
      <button
        className={styles.buynow_btn}
        onClick={handleButtonClick}
        // disabled={current_active_plan_price < price}
        style={{
          backgroundColor: is_subscribed === true ? "white" : "",
          color: is_subscribed === true ? "black" : "",
          // cursor: is_subscribed === true ? "default" : "not-allowed",
        }}
      >
        {current_active_plan_price > price
          ? "Cannot Buy"
          : is_subscribed
          ? "Active"
          : "Upgrade Now"}
      </button>
    </div>
  );
};

const Subscriptions = () => {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState("");
  const [currentActivePlanPrice, setCurrentActivePlanPrice] = useState(null);
  const [isAlreadySubscribed, setIsAlreadySubscribed] = useState(false);

  useEffect(() => {
    const getPlans = () => {
      axios_instance
        .get("/api/products")
        .then((response) => {
          setPlans(response.data);
          response.data.forEach((plan) => {
            // console.log(plan);
            if (plan.is_subscribed && plan.active_price.amount) {
              setCurrentActivePlanPrice(plan.active_price.amount);
              setIsAlreadySubscribed(plan.is_subscribed);
            }
          });

          // console.log("these are the subs plans", response.data);
        })
        .catch((error) => {
          setError(error);
        });
    };

    getPlans();
  }, []);

  return (
    <div className={`${styles.container} contain_center`}>
      {/* <a
        href="https://d7bb-125-63-73-50.ngrok-free.app/auth/google/login/"
        target="_blank"
      >
        google
      </a> */}
      <div className={styles.top_container}>
        <h1>
          <img src={crown} alt="" />
        </h1>
        <h1 className={styles.heading}>Subscription Plans</h1>
        <h3 className={styles.subHeading}>
          Get started on your journey of seamless document management with AI
        </h3>
      </div>
      <div className={styles.bottom_container}>
        {plans.map((plan, idx) => {
          const { description, active_price, features, name } = plan;
          return (
            <SubscriptionTile
              key={idx}
              heading={name}
              subHeading={description}
              price={active_price.amount}
              features={features}
              productId={plan.stripe_product_id}
              is_subscribed={plan.is_subscribed}
              current_active_plan_price={currentActivePlanPrice}
              isAlreadySubscribed={isAlreadySubscribed}
              priceId={plan.active_price.stripe_price_id}
            />
          );
        })}
        {error && <p style={{ color: "red" }}>{error.message}</p>}
      </div>
    </div>
  );
};

export default Subscriptions;
