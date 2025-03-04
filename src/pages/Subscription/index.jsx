import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import crown from "../../assets/crown_icon.svg";
import bullet from "../../assets/features_bullet.svg";
import { axios_instance } from "../../Axios/axiosInstance";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { toast } from "react-toastify";

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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [proratedPrice, setProratedPrice] = useState();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [isLoading, setIsLoading] = useState(false);

  // console.log(user?.subscription_status);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  const handleBuyNow = async (productId) => {
    try {
      const stripe = await stripePromise;
      const response = await axios_instance.post(
        "/subscriptions/create-checkout-session/",
        {
          product_id: productId,
        }
      );

      const { id } = response?.data;

      const { error } = await stripe?.redirectToCheckout({
        sessionId: id,
      });

      if (error) {
        console.error("Stripe Checkout Error:", error);
      }
    } catch (error) {
      console.error(
        "Error during checkout process:",
        error?.response?.data?.detail
      );
      if (
        error?.response?.data?.detail ===
        "Authentication credentials were not provided."
      ) {
        toast.error("You are not logged in.");
      }
    } finally {
      setIsLoading(false);
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

      setProratedPrice(response?.data?.prorated_amount);
    } catch (e) {
      console.log(e);
      if (
        e?.response?.data?.detail ===
        "Authentication credentials were not provided."
      ) {
        alert("You are not logged in.");
      }
      console.error("Error upgrading plan", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    setIsLoading(true);
    if (
      isAlreadySubscribed &&
      Number(current_active_plan_price) < Number(price)
    ) {
      handleUpgradePlan(priceId, productId);
    } else if (!isAlreadySubscribed) {
      handleBuyNow(productId);
    } else {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.tile_container}>
      <div className={styles.tile_top_container}>
        <span className={styles.tile_heading_container}>
          {showCrown && (
            <img src={crown} style={{ height: "24px", width: "24px" }} />
          )}
          <h3 className={styles.tile_heading}>
            {heading}{" "}
            {user?.subscription_status === "trialing" &&
              user.current_subscription_plan === heading && (
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: "500",
                  }}
                >
                  "Trialling"
                </p>
              )}
          </h3>
        </span>
        <p className={styles.tile_subheading}>{subHeading}</p>
        <h4 className={styles.tile_price}>
          ${price}{" "}
          <span className={styles.tile_permonth_text}>/ {t("month")}</span>
        </h4>
        <p className={styles.exclusive_text}>* {t("exclusive of taxes")}</p>
      </div>
      <div className={styles.tile_middle_container}>
        <span className={styles.left_gradient}></span>
        <p className={styles.features}>{t("Features")}</p>
        <span className={styles.right_gradient}></span>
      </div>
      <div className={styles.tile_bottom_container}>
        {features?.map((feature, idx) => (
          <div key={idx} className={styles.feature_container}>
            <img src={bullet} alt="&#10003;" />
            <p className={styles.feature}>{feature?.description}</p>
          </div>
        ))}
      </div>
      <button
        className={styles.buynow_btn}
        onClick={handleButtonClick}
        disabled={isLoading}
        style={{
          backgroundColor: is_subscribed ? "white" : "",
          color: is_subscribed ? "black" : "",
        }}
      >
        {isLoading
          ? `${t("Loading")}...`
          : user?.days_left === null ||
            user?.days_left === undefined ||
            user?.subscription_status === "Cancelled"
          ? t("Buy Now")
          : current_active_plan_price > price
          ? t("Cannot Buy")
          : is_subscribed
          ? t("Active")
          : t("Upgrade Now")}
      </button>
    </div>
  );
};

const Subscriptions = () => {
  const { t, i18n } = useTranslation();

  const [plans, setPlans] = useState([]);
  const [error, setError] = useState("");
  const [currentActivePlanPrice, setCurrentActivePlanPrice] = useState(null);
  const [isAlreadySubscribed, setIsAlreadySubscribed] = useState(false);

  const language_code = localStorage.getItem("i18nextLng");

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios_instance.get("/api/profile");
        const data = localStorage.setItem(
          "user",
          JSON.stringify(response.data)
        );
      } catch (e) {}
    };
    getUser();
  }, []);
  useEffect(() => {
    const getPlans = () => {
      axios_instance
        .get(`/api/products?lang=${language_code}`)
        .then((response) => {
          setPlans(response?.data);
          response?.data?.forEach((plan) => {
            if (plan?.is_subscribed && plan?.active_price?.amount) {
              setCurrentActivePlanPrice(parseInt(plan?.active_price?.amount));
              setIsAlreadySubscribed(plan?.is_subscribed);
            }
          });
        })
        .catch((error) => {
          setError(error);
        });
    };

    getPlans();
  }, [language_code]);

  return (
    <div className={`${styles.container} contain_center`}>
      <div className={styles.top_container}>
        <h1>
          <img src={crown} alt="" />
        </h1>
        <h1 className={styles.heading}>{t("Subscription Plans")}</h1>
        <h3 className={styles.subHeading}>
          {t(
            "Get started on your journey of seamless document management with AI"
          )}
        </h3>
      </div>
      <div className={styles.bottom_container}>
        {plans?.map((plan, idx) => {
          const { description, active_price, features, name } = plan;
          return (
            <SubscriptionTile
              key={idx}
              heading={name}
              subHeading={description}
              price={active_price?.amount}
              features={features}
              productId={plan?.stripe_product_id}
              is_subscribed={plan?.is_subscribed}
              current_active_plan_price={currentActivePlanPrice}
              isAlreadySubscribed={isAlreadySubscribed}
              priceId={active_price?.stripe_price_id}
            />
          );
        })}
        {error && <p style={{ color: "red" }}>{error?.message}</p>}
      </div>
    </div>
  );
};

export default Subscriptions;
