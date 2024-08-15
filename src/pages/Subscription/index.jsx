import React from "react";
import styles from "./index.module.scss";
import crown from "../../assets/crown_icon.svg";
import bullet from "../../assets/features_bullet.svg";

const SubscriptionTile = ({
  heading,
  subHeading,
  price,
  features = [],
  showCrown = false,
}) => {
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
              <p className={styles.feature}>{feature}</p>
            </div>
          );
        })}
      </div>
      <button className={styles.buynow_btn}>Buy Now</button>
    </div>
  );
};

const Subscriptions = () => {
  return (
    <div className={`${styles.container} contain_center`}>
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
        <SubscriptionTile
          heading={"Basic"}
          subHeading={"Best for trying things out"}
          price={100}
          features={[
            "Unlimited promts available",
            "No limit of credits on usage",
            "2000 credits only for chat feature",
            "Unlimited projects to create",
            "24/7 customer support",
          ]}
        />
        <SubscriptionTile
          heading={"Premium"}
          showCrown={true}
          subHeading={"Best for trying things out"}
          price={100}
          features={[
            "Unlimited promts available",
            "No limit of credits on usage",
            "2000 credits only for chat feature",
            "Unlimited projects to create",
            "24/7 customer support",
          ]}
        />
        <SubscriptionTile
          heading={"Pro"}
          showCrown={true}
          price={100}
          subHeading={"Best for trying things out"}
          features={[
            "Unlimited promts available",
            "No limit of credits on usage",
            "2000 credits only for chat feature",
            "Unlimited projects to create",
            "24/7 customer support",
          ]}
        />
      </div>
    </div>
  );
};

export default Subscriptions;
