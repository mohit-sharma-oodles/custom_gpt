import React from "react";
import styles from "./index.module.scss";
import { useSelector } from "react-redux";

const Profile = () => {
  const { user } = useSelector((state) => state.rootReducer.auth);

  return (
    <div>
      {user.first_name} {user.last_name} {user.email}
    </div>
  );
};

export default Profile;
