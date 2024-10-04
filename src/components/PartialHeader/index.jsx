import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { IoCloseSharp, IoLanguage } from "react-icons/io5";
import { FaRegUserCircle, FaUser } from "react-icons/fa";
import { PiSignOutBold } from "react-icons/pi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import crown from "../../assets/crown_icon.svg";
import default_icon from "../../assets/person_default.png";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/authSlice";
import Profile from "../Profile";
import { axios_instance } from "../../Axios/axiosInstance";
import { GoPencil } from "react-icons/go";

const ProfileModal = ({ onClose, setShowProfile, setShowProfileModal }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState({});
  const [subscription, setSubscription] = useState("");
  // const { user } = useSelector((state) => state.rootReducer.auth);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await axios_instance.get("/api/profile/");
        console.log(response.data);
        setUser(response.data);
      } catch (e) {
        console.log(e);
      }
    };
    getProfile();
  }, []);

  useEffect(() => {
    const getDetails = async () => {
      try {
        const response = await axios_instance.get(
          "/subscriptions/subscription-details/"
        );
        console.log(response.data);
        setSubscription(response.data.product_name);
      } catch (e) {
        console.log(e);
      }
    };
    getDetails();
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
    onClose();
  };

  return (
    <div className={styles.profileModal}>
      <div className={styles.top_section}>
        <img
          style={{
            borderRadius: "50%",
          }}
          src={user?.profile_picture || default_icon}
          alt="User"
        />
        <div>
          <p className={styles.name}>{user?.first_name}</p>
          <p className={styles.plan}>
            {subscription.length !== 0 && (
              <img
                src={crown}
                style={{ height: "16px", width: "16px" }}
                alt="Crown"
              />
            )}
            {user.current_subscription_plan}
          </p>
        </div>
        <IoCloseSharp
          className={styles.closeIcon}
          onClick={setShowProfileModal}
        />
      </div>
      <div className={styles.button_container}>
        <button onClick={() => setShowProfile(true)}>
          <FaRegUserCircle />
          Profile
        </button>
        <button className={styles.signOut} onClick={handleLogout}>
          <PiSignOutBold color="red" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

const PartialHeader = ({
  title = "Projects",
  setDeployModal,
  setDefaultOpen,
}) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleProfileImageClick = () => {
    setShowProfileModal((prev) => !prev);
  };
  const { user, isAuthenticated } = useSelector(
    (state) => state.rootReducer.auth
  );

  const location = useLocation();
  const isProjectEditPath = /\/app\/project\/\d+/.test(location.pathname);

  return (
    <div className={styles.container}>
      <h1 style={{ textTransform: "capitalize" }}>
        {title}
        {isProjectEditPath && (
          <GoPencil
            size={20}
            style={{ marginLeft: "10px", cursor: "pointer" }}
            onClick={() => {
              setDeployModal(true);
              setDefaultOpen("customise");
            }}
          />
        )}
      </h1>

      <div className={styles.right_Side_container}>
        <Link
          to={"/subscription"}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <span className={`clickable ${styles.subscription_container}`}>
            <img
              src={crown}
              style={{ width: "24px", height: "24px" }}
              alt="Crown"
            />
            Subscriptions
          </span>
        </Link>
        {/* <span className="clickable">
          <IoLanguage size={24} color="grey" style={{ marginBottom: "-7px" }} />
        </span> */}
        <div
          className={styles.profile_img_wrapper}
          onClick={handleProfileImageClick}
        >
          <img
            src={user?.profile_picture || default_icon}
            alt="User"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
          {showProfileModal && (
            <ProfileModal
              onClose={() => setShowProfileModal(false)}
              setShowProfile={setShowProfile}
              setShowProfileModal={setShowProfileModal}
            />
          )}
        </div>
      </div>
      {showProfile && <Profile setShowProfile={setShowProfile} />}
    </div>
  );
};

export default PartialHeader;
