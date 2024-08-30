import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import crown from "../../assets/crown_icon.svg";
import bullet from "../../assets/features_bullet.svg";
import { axios_instance } from "../../Axios/axiosInstance";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const SubscriptionTile = ({
  heading,
  subHeading,
  price,
  features = [],
  showCrown = false,
  productId,
  is_subscribed,
}) => {
  const handleBuyNow = async (productId) => {
    try {
      const atoken = localStorage.getItem("accessToken");
      const rtoken = localStorage.getItem("refreshToken");
      const user = localStorage.getItem("user");

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
      // else {
      //   if (!localStorage.getItem("accessToken")) {
      //     localStorage.setItem("accessToken", atoken);
      //   }
      //   if (!localStorage.getItem("refreshToken")) {
      //     localStorage.setItem("refreshToken", rtoken);
      //   }
      //   if (!localStorage.getItem("user")) {
      //     localStorage.setItem("user", user);
      //   }
      // }
    } catch (error) {
      console.error("Error during checkout process:", error);
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
        onClick={is_subscribed === true ? null : () => handleBuyNow(productId)}
        // onClick={is_subscribed === true ? null : null}
        // disabled={is_subscribed === false}
        style={{
          backgroundColor: is_subscribed === true ? "white" : "",
          color: is_subscribed === true ? "black" : "",
          // cursor: is_subscribed === true ? "default" : "not-allowed",
        }}
      >
        {is_subscribed === true ? "Active" : "Buy Now"}
      </button>
    </div>
  );
};

const Subscriptions = () => {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const getPlans = () => {
      axios_instance
        .get("/api/products")
        .then((response) => {
          setPlans(response.data);
          // console.log("these are the subs plans", response.data);
        })
        .catch((error) => {
          setError(error);
          // console.error("Error fetching subscription plans:", error);
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
            />
          );
        })}
        {error && <p style={{ color: "red" }}>{error.message}</p>}
      </div>
    </div>
  );
};

export default Subscriptions;
