import React, { useEffect } from "react";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import RouterConfig from "./Axios/routes";
import { initializeAuth, loginUser } from "./redux/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    dispatch(initializeAuth(token));
  }, [dispatch]);

  const isAuthenticated = useSelector(
    (state) => state.rootReducer.auth.isAuthenticated
  );

  return <RouterProvider router={RouterConfig(isAuthenticated)} />;
}

export default App;
