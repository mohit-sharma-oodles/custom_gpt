import React, { useEffect, useState } from "react";
import "../../../node_modules/swiper/swiper-bundle.min.css";
import styles from "./index.module.scss";
import wallmart from "../../assets/walmart.svg";
import okta from "../../assets/okta.svg";
import rating_kid from "../../assets/rating_kid.svg";
import deloitte from "../../assets/deloitte.svg";
import help_me from "../../assets/help_me.svg";
import volvo from "../../assets/volvo.svg";
import cisco from "../../assets/cisco.svg";
import tryItOut from "../../assets/tryItOut.svg";
import offering1_1 from "../../assets/offering1_1.svg";
import offering1_2 from "../../assets/offering1_2.svg";
import offering1_3 from "../../assets/offering1_3.svg";
import offering1_4 from "../../assets/offering1_4.svg";
import offering1_1_img from "../../assets/offering1_1_img.svg";
import offering1_2_img from "../../assets/offering1_2_img.svg";
import offering1_3_img from "../../assets/offering1_3_img.svg";
import offering1_4_img from "../../assets/offering1_4_img.svg";
import person1 from "../../assets/person1.svg";
import person2 from "../../assets/person2.png";
import person3 from "../../assets/person3.svg";
import rating from "../../assets/Rating.svg";
import gpt_green from "../../assets/gpt_green.svg";
import gpt_pink from "../../assets/gpt_pink.svg";

import securityAndPrivacy from "../../assets/securityAndPrivacy.svg";
import { IoPlayOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import { RiBardFill } from "react-icons/ri";
import { SiOpenai } from "react-icons/si";

import { GrStorage } from "react-icons/gr";
import { GoLock } from "react-icons/go";
import { offerings1, testimonials } from "../../Constants";
import { ArcherContainer, ArcherElement } from "react-archer";
import Testimonials from "../../components/Testimonials";

import { ReactFlow, Controls, Background } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ReactFlowArea from "../../components/ReactFlowArea";
import { useLocation } from "react-router-dom";

const sizes = [20, 30, 40, 50, 60];
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
// const ComplexContentNode = ({ data }) => {
//   return (
//     <div className={`archer-element ${data.label.className}`}>
//       <div className="left">
//         <img src={data.label.image.src} alt="" />
//         <h4>{data.label.heading}</h4>
//         <p>{data.label.subheading}</p>
//       </div>
//       <div className="right">
//         <img src={data.label.image.imgSrc} alt="" />
//       </div>
//     </div>
//   );
// };
const CustomNode = ({ data }) => {
  return (
    <div className="node">
      <div className="node-content">{data.label}</div>
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
            in a <br /> <span className={styles.naturalWay}>natural way</span>
          </h1>

          {/* <img className={styles.banner_img} src={banner_img} alt="" /> */}
          <p>
            Primadeta Automation solution is powered by the popular <br /> and
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
        <div className={styles.helpmeSection}>
          <div
            style={{
              position: "absolute",
              aspectRatio: "1",
              height: "50%",
              left: "15%",
              borderRadius: "50%",
              backgroundColor: "#FFEDED",
              zIndex: -1,
              filter: "blur(8px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              aspectRatio: "1",
              height: "81%",
              left: "53%",
              borderRadius: "50%",
              backgroundColor: "#FFFCEB",
              zIndex: -1,
              filter: "blur(5px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              aspectRatio: "1",
              height: "69%",
              left: "5%",
              top: "60%",
              borderRadius: "50%",
              backgroundColor: "#EBFFED",
              zIndex: -1,
              filter: "blur(12px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              aspectRatio: "1",
              height: "31%",
              left: "45%",
              top: "74%",
              borderRadius: "50%",
              backgroundColor: "#E8FFFC",
              zIndex: -1,
              filter: "blur(10px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              aspectRatio: "1",
              height: "59%",
              left: "77%",
              top: "105%",
              borderRadius: "50%",
              backgroundColor: "#F3EDFF",
              zIndex: -1,
              filter: "blur(3px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              aspectRatio: "1",
              height: "89%",
              left: "90%",
              top: "30%",
              borderRadius: "50%",
              backgroundColor: "#FFFCEB",
              zIndex: -1,
              filter: "blur(15px)",
            }}
          />

          <img src={help_me} />
          <h1 className={styles.offer2}>
            Increase your customer engagement and knowledge <br /> management by
            a <span className={styles.factor_box}>factor of 10</span>
          </h1>
        </div>
        <div className={styles.ratings_container}>
          <img className={styles.rating_img} src={rating} />
          <img className={styles.gpt_green} src={gpt_green} />
          <img className={styles.gpt_pink} src={gpt_pink} />
          <img src={rating_kid} alt="" />
          <div className={styles.rating_text_container}>
            <h3 className={styles.rating}>
              Powered by ChatGPT
              <SiOpenai color="#32b4a2" />
            </h3>
            <p>
              Build your own Primadeta Automation <br /> chatbot based on your
              own content in <br /> minutes.
            </p>
          </div>
        </div>

        {/* react archer code */}
        <div className={styles.offering_container}>
          {/* <Offering1 /> */}
          <ArcherContainer
            strokeColor="red"
            className={""}
            // style={{}}
          >
            <div className={styles.archer_container}>
              <div
                style={{
                  // backgroundColor: "red",
                  gridColumnStart: 1,
                  gridColumnEnd: 7,
                  height: "60px",
                  borderRight: "3px dashed #ae407a",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#ae407a",
                    top: "-6px",
                    right: "-6px",
                    // transform: "translate(-50%,-50%)",
                  }}
                />
              </div>
              <ArcherElement
                id="root"
                relations={[
                  {
                    targetId: "element2",
                    targetAnchor: "top",
                    sourceAnchor: "bottom",
                    style: { strokeDasharray: "5,5" },
                  },
                ]}
              >
                <div className={`${styles.archer_element1} ${styles.offering}`}>
                  <div className={styles.left}>
                    <img src={offering1_1} alt="" />
                    <h4>{offerings1[0].heading}</h4>
                    <p>{offerings1[0].subheading}</p>
                  </div>
                  <div className={styles.right}>
                    <img src={offering1_1_img} alt="" />
                  </div>
                </div>
              </ArcherElement>

              <ArcherElement
                id="root"
                relations={[
                  {
                    targetId: "element2",
                    targetAnchor: "top",
                    sourceAnchor: "bottom",
                    style: { strokeDasharray: "5,5" },
                  },
                ]}
              >
                <div className={`${styles.archer_element2} ${styles.offering}`}>
                  <div className={styles.left}>
                    <img src={offering1_2} alt="" />
                    <h4>{offerings1[1].heading}</h4>
                    <p>{offerings1[1].subheading}</p>
                  </div>
                  <div className={styles.right}>
                    <img src={offering1_2_img} alt="" />
                  </div>
                </div>
              </ArcherElement>

              <ArcherElement
                id="root"
                relations={[
                  {
                    targetId: "element2",
                    targetAnchor: "top",
                    sourceAnchor: "bottom",
                    style: { strokeDasharray: "5,5" },
                  },
                ]}
              >
                <div
                  className={`${styles.archer_element3} ${styles.offering}`}
                  style={{
                    position: "relative",
                  }}
                >
                  <div className={styles.left}>
                    <img src={offering1_3} alt="" />
                    <h4>{offerings1[2].heading}</h4>
                    <p>{offerings1[2].subheading}</p>
                  </div>
                  <div className={styles.right}>
                    <img src={offering1_3_img} alt="" />
                  </div>
                  <div
                    style={{
                      // backgroundColor: "red",
                      width: "110%",
                      height: "70px",
                      bottom: "-60px",
                      position: "absolute",
                      borderRight: "3px dashed #ae407a",
                      borderBottom: "3px dashed #ae407a",
                      borderBottomRightRadius: "10px",
                      zIndex: "0",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        // backgroundColor: "lightblue",
                        position: "relative",
                        height: "100%",
                        width: "20%",
                      }}
                    >
                      <div
                        style={{
                          // backgroundColor: "lightcoral",
                          position: "absolute",
                          height: "300%",
                          width: "10%",
                          bottom: "-300%",
                          left: "-9px",
                          borderLeft: "3px dashed #ae407a",
                          borderTopLeftRadius: "10px",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </ArcherElement>

              <ArcherElement
                id="root"
                relations={[
                  {
                    targetId: "element2",
                    targetAnchor: "top",
                    sourceAnchor: "bottom",
                    style: { strokeDasharray: "5,5" },
                  },
                ]}
              >
                <div
                  className={`${styles.archer_element4} ${styles.offering}`}
                  style={{ zIndex: 2, backgroundColor: "white" }}
                >
                  <div className={styles.left}>
                    <img src={offering1_4} alt="" />
                    <h4>{offerings1[3].heading}</h4>
                    <p>{offerings1[3].subheading}</p>
                  </div>
                  <div className={styles.right}>
                    <img src={offering1_4_img} alt="" />
                  </div>
                </div>
              </ArcherElement>

              <div
                style={{
                  gridColumnStart: 1,
                  gridColumnEnd: 13,
                  marginTop: "4rem",
                }}
              >
                <ArcherElement
                  id="root"
                  relations={[
                    {
                      targetId: "element2",
                      targetAnchor: "top",
                      sourceAnchor: "bottom",
                      style: { strokeDasharray: "5,5" },
                    },
                  ]}
                >
                  <div
                    className={`${styles.archer_element} ${styles.offering2}`}
                    style={{ position: "relative" }}
                  >
                    <div className={styles.larger_div}>
                      <img
                        className={styles.imagePositionLeft}
                        src={person1}
                        alt=""
                      />
                      <h3 className={`${styles.paddingLeft}`}>
                        Increase customer engagement with lightning-fast
                        responses.
                      </h3>
                      <div
                        className={`${styles.text_container} ${styles.paddingLeft}`}
                      >
                        <p>
                          Provide personalized responses to customer inquiries,
                          reduce response times, and improve overall customer
                          experience and engagement. It’s as if ChatGPT has
                          learned all your business content.
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        // backgroundColor: "red",
                        position: "absolute",
                        height: "100%",
                        top: "70%",
                        width: "70%",
                        borderRight: "3px dashed #ae407a",
                        zIndex: -1,
                      }}
                    />
                  </div>
                </ArcherElement>
                <ArcherElement
                  id="root"
                  relations={[
                    {
                      targetId: "element2",
                      targetAnchor: "top",
                      sourceAnchor: "bottom",
                      style: { strokeDasharray: "5,5" },
                    },
                  ]}
                >
                  <div
                    className={`${styles.archer_element} ${styles.offering2}`}
                    style={{ position: "relative" }}
                  >
                    <div className={styles.larger_div}>
                      <img
                        src={person2}
                        alt=""
                        className={styles.imagePositionRight}
                      />
                      <h3 className={styles.paddingRight}>
                        Save hours researching your PDF Documents.
                      </h3>
                      <div className={styles.text_containerRight}>
                        <p>
                          Bring together the knowledge of all your business and
                          teams in a Primadeta Automation-driven chatbot. Unlock
                          insights and improve the efficiency of your employees
                          and teams. No more typing keywords. Just ask for
                          answers from your content.
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        // backgroundColor: "red",
                        position: "absolute",
                        height: "100%",
                        top: "70%",
                        left: "2%",
                        width: "10%",
                        borderLeft: "3px dashed #ae407a",
                        zIndex: -1,
                      }}
                    />
                  </div>
                </ArcherElement>
                <ArcherElement
                  id="root"
                  relations={[
                    {
                      targetId: "element2",
                      targetAnchor: "top",
                      sourceAnchor: "bottom",
                      style: { strokeDasharray: "5,5" },
                    },
                  ]}
                >
                  <div
                    style={{ marginTop: "1.5rem" }}
                    className={`${styles.archer_element} ${styles.offering2}`}
                  >
                    <div className={styles.larger_div}>
                      <img
                        className={styles.imagePositionLeft}
                        src={person3}
                        alt=""
                      />
                      <h3 className={`${styles.paddingLeft}`}>
                        Make your helpdesk staff 10x more efficient.
                      </h3>
                      <div
                        className={`${styles.text_container} ${styles.paddingLeft}`}
                      >
                        <p>
                          No more hours of searching through documents. Make
                          your help desk staff more efficient with quick
                          ChatGPT-driven responses from your content. Resolve
                          customer issues quickly.
                        </p>
                      </div>
                    </div>
                  </div>
                </ArcherElement>
              </div>
            </div>
          </ArcherContainer>

          {/* <ReactFlowArea /> */}
        </div>
        {/* react archer code */}

        {/* security and privacy principles */}
        <div className={styles.security_container}>
          <div className={styles.top_container}>
            <img src={securityAndPrivacy} />
            <h2>Security and Privacy Principles</h2>
            <span className={styles.trust_center}>The Trust Center</span>
          </div>
          <div className={styles.bottom_container}>
            <div className={styles.left}>
              <h3>Security and privacy are our top priority</h3>
              <p>Your data is fully encrypted and files are never stored</p>
              <span>Get Started</span>
            </div>
            <div className={styles.right}>
              <div className={styles.security_right_item}>
                <IoShieldCheckmarkOutline size={22} />
                <div className={styles.top_item}>
                  <h4>Encrypted in transit and at rest</h4>
                  <p>
                    SSL Encryption at Rest <br /> Industry-standard 256-bit AES
                    encryption at rest.
                  </p>
                </div>
              </div>
              <div className={styles.security_right_item}>
                <GrStorage size={22} />
                <div className={styles.top_item}>
                  <h4>No data sharing</h4>
                  <p>
                    SSL Encryption Completely self-contained bots <br /> No data
                    sharing, even within same accounts.
                  </p>
                </div>
              </div>
              <div className={styles.security_right_item}>
                <GoLock size={22} />
                <div className={styles.top_item}>
                  <h4>SOC 2 compliant</h4>
                  <p>SOC 2 Type-2 compliant</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* want heads on section */}
        <div className={styles.handson_container}>
          <div className={styles.top}>
            <h3>Want a hands on?</h3>
            <p>Try it out Yourself.</p>
          </div>
          <div className={styles.bottom}>
            <img src={tryItOut} />
          </div>
        </div>

        {/* User Testimonials might be fetched from api later on */}
        <div className={styles.testimonial_container}>
          <h2>
            Users do love us.{" "}
            <span className={styles.Testimonials}>Testimonials.</span>
          </h2>

          <Testimonials />
        </div>
      </div>
    </div>
  );
};

export default Home;
