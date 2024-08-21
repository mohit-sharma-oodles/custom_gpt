// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";

// const ProtectedRoute = ({ isAuthenticated }) => {
//   return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
// };

// export default ProtectedRoute;

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, unAuthRoute = null }) => {
  // const { isAuthenticated } = useSelector((state) => state.rootReducer.auth);
  const isAuthenticated = localStorage.getItem("accessToken");
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // return unAuthRoute ? (
  //   <Navigate to={unAuthRoute} replace />
  // ) : (
  // );
  return <Navigate to="/" replace />;

  // useEffect(() => {
  // }, [isAuthenticated]);
  // return <>{children}</>;
};

export default ProtectedRoute;
