// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";

// const ProtectedRoute = ({ isAuthenticated }) => {
//   return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
// };

// export default ProtectedRoute;

import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, children, unAuthRoute = null }) => {
  if (isAuthenticated === false) {
    if (unAuthRoute) return <Navigate to={unAuthRoute} replace />;
    else return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
