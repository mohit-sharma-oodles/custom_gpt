import { createBrowserRouter, Navigate } from "react-router-dom";
import HeaderLayout from "./HeaderLayout";
import FAQ from "../pages/FAQ";
import Home from "../pages/Home";
import Projects from "../pages/Projects";
import Subscription from "../pages/Subscription";
import ContactUs from "../pages/ContactUs";
import Profile from "../components/Profile";

import ProtectedRoute from "../Axios/ProtectedRoute";
import ConfirmEmail from "../pages/ConfirmMail";
import ForgotPassword from "../pages/ForgotPassword";
import CreateProject from "../pages/CreateProject/CreateProject";
import PaymentSuccess from "../pages/PaymentSuccess";
import CancelPayment from "../pages/Cancel";
import UpgradePlan from "../pages/UpgradePlan";
import ViewProject from "../pages/ViewProject";
import SharableChat from "../pages/SharableChat";
import OAuth from "../pages/OAuth";

const RouterConfig = (isAuthenticated) => {
  return createBrowserRouter([
    {
      path: "/",
      element: <HeaderLayout isAuthenticated={isAuthenticated} />,
      children: [
        {
          path: "faq",
          element: <FAQ />,
        },
        {
          path: "contact-us",
          element: <ContactUs />,
        },
        {
          path: "subscription",
          element: <Subscription />,
        },
        {
          path: "confirm-email",
          element: <ConfirmEmail />,
        },
        {
          path: "oauth",
          element: <OAuth />,
        },
        {
          path: "reset-password",
          element: <ForgotPassword />,
        },
        {
          path: "/app/project/:projectId/chat",
          element: <SharableChat />,
        },
        {
          path: "app/subscription",
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Subscription />
            </ProtectedRoute>
          ),
        },
        {
          path: "app/home",
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Home isAuthenticated={isAuthenticated} />
            </ProtectedRoute>
          ),
        },
        {
          path: "app/projects",
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Projects isAuthenticated={isAuthenticated} />
            </ProtectedRoute>
          ),
        },
        {
          path: "app/create-project",
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CreateProject isAuthenticated={isAuthenticated} />
            </ProtectedRoute>
          ),
        },
        {
          path: "app/project/:projectId",
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ViewProject isAuthenticated={isAuthenticated} />
            </ProtectedRoute>
          ),
        },
        {
          path: "app/profile",
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Profile isAuthenticated={isAuthenticated} />
            </ProtectedRoute>
          ),
        },
        {
          path: "app/upgrade-plan",
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <UpgradePlan isAuthenticated={isAuthenticated} />
            </ProtectedRoute>
          ),
        },
        {
          path: "success",
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <PaymentSuccess isAuthenticated={isAuthenticated} />
            </ProtectedRoute>
          ),
        },
        {
          path: "cancel",
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CancelPayment isAuthenticated={isAuthenticated} />
            </ProtectedRoute>
          ),
        },
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "*",
          element: <Navigate to="/app/home" replace />,
        },
      ],
    },
  ]);
};

export default RouterConfig;
