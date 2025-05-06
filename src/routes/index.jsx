import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import GuestPage from "../pages/middleware/GuestPage";
import PrivatePage from "../pages/middleware/PrivatePage";
import AdminPage from "../pages/middleware/AdminPage";
import StaffPage from "../pages/middleware/StaffPage";

import Profile from "../pages/Profile";
import Template from "../layouts/template";
import Dashboard from "../pages/Dashboard";
import StuffIndex from "../pages/stuffs/index";
import InboundIndex from "../pages/inbounds/index";
import Lendings from "../pages/lendings/index";
import LendingData from "../pages/lendings/data";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Template />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        element: <GuestPage />,
        children: [
          { path: "login", element: <Login /> }
        ]
      },
      {
        element: <PrivatePage />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "profile", element: <Profile /> },
          {
            path: "stuffs", element: <StuffIndex />,
          },
          { path: "inbound", element: <InboundIndex /> },
        ],
      },
      {
        element: <StaffPage />,
        children: [
            { path: "staff/lendings", element: <Lendings /> },
            { path: "lendings/data", element: <LendingData /> },

        ]
      }
    ],
  },
]);
