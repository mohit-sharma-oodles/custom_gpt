import React from "react";
import styles from "./index.module.scss";
import { IoPlayOutline } from "react-icons/io5";
import wallmart from "../../assets/walmart.svg";
import okta from "../../assets/okta.svg";
import deloitte from "../../assets/deloitte.svg";
import volvo from "../../assets/volvo.svg";
import cisco from "../../assets/cisco.svg";
import { RiBardFill } from "react-icons/ri";

const FeatureBox = ({ color, heading, text }) => {
  return (
    <div
      className={styles.featurebox_contaniner}
      style={{ border: `1px solid ${color}` }}
    >
      <RiBardFill color={color} size={30} />
      <h2>{heading}</h2>
      <p>{text}</p>
    </div>
  );
};

const Home = ({ isAuthenticated }) => {
  return (
    <div className={styles.container}>
      {/* {isAuthenticated ? <h1>Authenticated</h1> : <h1>Not</h1>} */}
      {/* Hero Banner */}
      <div className={styles.hero_banner}>
        <div className={styles.text_area}>
          <h1>
            Talk to all of your <span className={styles.banner_data}>data</span>{" "}
            in a <span className={styles.naturalWay}>natural way</span>
          </h1>

          {/* <img className={styles.banner_img} src={banner_img} alt="" /> */}
          <p>
            Primadeta Automation solution is powered by the popular and
            increadibly prowerful OpenAI LLMs and ChatGPT-4.
          </p>

          <div className={styles.button_container}>
            <button className={`${styles.cta_button} ${styles.getStarted}`}>
              Get Started
            </button>
            <button className={`${styles.cta_button} ${styles.watchDemo}`}>
              Watch Demo <IoPlayOutline />{" "}
            </button>
          </div>
        </div>
      </div>

      {/* company images */}
      <div className={`${styles.company_images_wrapper} contain_center`}>
        <img src={wallmart} alt="wallmart" srcSet="" />
        <img src={cisco} alt="cisco" srcSet="" />
        <img src={volvo} alt="volvo" srcSet="" />
        <img src={deloitte} alt="deloitte" srcSet="" />
        <img src={okta} alt="okta" srcSet="" />
      </div>

      {/* features section */}
      <div className={`${styles.feature_section_container} contain_center`}>
        <div className={styles.headingContainer}>
          <h1 className={styles.headingContainer_heading}>
            Packed with over 100 business features
          </h1>
          <p className={styles.headingContainer_subheading}>
            All within a secure, privacy-first, enterprise platform.
          </p>
        </div>

        <div className={`${styles.feature_boxes} `}>
          <FeatureBox
            color={"#AE407A"}
            heading={"Privacy First"}
            text={
              "We never store your files unless you choose to see them in the comments. By default, your chatbot is private."
            }
          />
          <FeatureBox
            color={"#32b4a2"}
            heading={"Website Integration"}
            text={
              "Bring in ALL your business content with our seamless website integration guaranteed to be easy to set up!"
            }
          />
          <FeatureBox
            color={"#84c1df"}
            heading={"Realtime Streaming Reactions"}
            text={
              "Streaming reactions based on your content without making up facts. See even the sources of the comments."
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
