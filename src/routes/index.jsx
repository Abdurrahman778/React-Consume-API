import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import Template from "../layouts/template";
import Dashboard from "../pages/Dashboard";
import PrivatePage from "../pages/middleware/PrivatePage";
import GuestPage from "../pages/middleware/GuestPage";
import StuffIndex from "../pages/stuffs/index";
import InboundIndex from "../pages/inbounds/index";

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
    ],
  },
]);
