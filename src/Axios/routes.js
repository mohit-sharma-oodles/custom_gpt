import { createBrowserRouter } from "react-router-dom";
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
          path: "reset-password",
          element: <ForgotPassword />,
        },
        {
          path: "app",
          element: <></>,
          children: [],
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
          path: "app/profile",
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Profile isAuthenticated={isAuthenticated} />
            </ProtectedRoute>
          ),
        },
        {
          path: "/",
          element: <Home />,
        },
      ],
    },
  ]);
};

export default RouterConfig;

//
// import { Outlet, createBrowserRouter } from "react-router-dom";
// import HeaderLayout from "./HeaderLayout";
// import FAQ from "../pages/FAQ";
// import Home from "../pages/Home";
// import Projects from "../pages/Projects";
// import Subscription from "../pages/Subscription";
// import ContactUs from "../pages/ContactUs";
// import Profile from "../components/Profile";

// import ProtectedRoute from "../Axios/ProtectedRoute";
// import ConfirmEmail from "../pages/ConfirmMail";
// import ForgotPassword from "../pages/ForgotPassword";

// const RouterConfig = (isAuthenticated) => {
//   return createBrowserRouter([
//     {
//       path: "/",
//       element: <HeaderLayout isAuthenticated={isAuthenticated} />,
//       children: [
//         {
//           path: "faq",
//           element: <FAQ />,
//         },
//         {
//           path: "contact-us",
//           element: <ContactUs />,
//         },
//         {
//           path: "subscription",
//           element: <Subscription />,
//         },
//         {
//           path: "confirm-email",
//           element: <ConfirmEmail />,
//         },
//         {
//           path: "reset-password",
//           element: <ForgotPassword />,
//         },
//         {
//           path: "app",
//           element: (
//             <>
//               <Outlet />
//             </>
//           ),
//           children: [
//             {
//               path: "subscription",
//               element: (
//                 <ProtectedRoute isAuthenticated={isAuthenticated}>
//                   <Subscription />
//                 </ProtectedRoute>
//               ),
//             },
//             {
//               path: "home",
//               element: (
//                 <ProtectedRoute isAuthenticated={isAuthenticated}>
//                   <Home isAuthenticated={isAuthenticated} />
//                 </ProtectedRoute>
//               ),
//             },
//             {
//               path: "projects",
//               element: (
//                 <ProtectedRoute isAuthenticated={isAuthenticated}>
//                   <Projects isAuthenticated={isAuthenticated} />
//                 </ProtectedRoute>
//               ),
//             },
//             {
//               path: "profile",
//               element: (
//                 <ProtectedRoute isAuthenticated={isAuthenticated}>
//                   <Profile isAuthenticated={isAuthenticated} />
//                 </ProtectedRoute>
//               ),
//             },
//           ],
//         },
//         {
//           path: "/",
//           element: <Home />,
//         },
//       ],
//     },
//   ]);
// };

// export default RouterConfig;

//
