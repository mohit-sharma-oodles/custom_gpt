import React, { useEffect } from "react";
import "./App.css";
import { RouterProvider, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import RouterConfig from "./Axios/routes";
import { initializeAuth, loginUser } from "./redux/authSlice";

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state) => state.rootReducer.auth.isAuthenticated
  );

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const user = localStorage.getItem("user");
    if (token && user && refreshToken) {
      dispatch(initializeAuth());
    }
  }, [isAuthenticated]);

  return <RouterProvider router={RouterConfig(isAuthenticated)} />;
}

export default App;
