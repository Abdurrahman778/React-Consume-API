import { createBrowserRouter, BrowserRouter as Router } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import Template from "../layouts/template";
import Dashboard from "../pages/Dashboard";
import PrivatePage from "../pages/middleware/PrivatePage";

export const router = createBrowserRouter([
  // path : url yang dipakai, element: views yang akan ditampilkan

  {
    path: "/",
    element: <Template />,
    children: [
      { path: "/", element: <App /> },
      { path: "/login", element: <Login /> },
      { path: "/profile", element: <Profile /> },
      {
        path: "/dashboard", element: <PrivatePage/>,
        // route pada children, route yang dibatasi akses nya
        children : [
          {path: "/", element: <Dashboard />},
        ]

      },
    ],
},
]);
