import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Login from "../components/Login";
import Signup from "../components/Signup";

const HeaderLayout = ({ isAuthenticated }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const location = useLocation();

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsSignupModalOpen(false);
  };
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openSignupModal = () => {
    setIsSignupModalOpen(true);
    setIsLoginModalOpen(false);
  };
  const closeSignupModal = () => setIsSignupModalOpen(false);

  const hiddenHeaderPaths = ["/app/projects", "/app/create-project"];

  // Check if the current path matches any path in the array
  const showHeader = !hiddenHeaderPaths.includes(location.pathname);

  return (
    <>
      {showHeader && (
        <Header
          onLoginClick={openLoginModal}
          onSignupClick={openSignupModal}
          isAuthenticated={isAuthenticated}
        />
      )}
      <Outlet />

      {/* Login and Signup Modals */}
      {isLoginModalOpen && (
        <Login
          isOpen={isLoginModalOpen}
          onClose={closeLoginModal}
          onSignupClick={openSignupModal}
        />
      )}

      {isSignupModalOpen && (
        <Signup
          isOpen={isSignupModalOpen}
          onClose={closeSignupModal}
          onLoginClick={openLoginModal}
        />
      )}
    </>
  );
};

export default HeaderLayout;
