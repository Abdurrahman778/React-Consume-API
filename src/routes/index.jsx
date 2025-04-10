import { createBrowserRouter, BrowserRouter as Router } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import Template from "../layouts/template";
import Dashboard from "../pages/Dashboard";

export const router = createBrowserRouter([
  // path : url yang dipakai, element: views yang akan ditampilkan

  {
    path: "/",
    element: <Template />,
    children: [
      { path: "/", element: <App /> },
      { path: "/login", element: <Login /> },
      { path: "/profile", element: <Profile /> },
      {path: "/dashboard", element: <Dashboard />},
    ],
},
]);
