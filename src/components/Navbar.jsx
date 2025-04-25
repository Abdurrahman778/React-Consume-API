// "use client"
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, User, Menu } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  function logoutHandler() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <Link className="navbar-brand fw-bold text-primary ms-3" to="/">
          Inventaris
        </Link>
      <div className="container-fluid px-4" style={{ color: "#393E46" }}>
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <Menu size={20} />
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {token && (
              <>
                <li className="nav-item">
                  <Link className="nav-link px-3" to="/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-3" to="/stuffs">
                    Stuff
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-3" to="/profile">
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-3" to="/inbound">
                    Inbound
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center">
            {!token ? (
              <Link
                className="btn btn-sm btn-primary rounded-pill px-4"
                to="/login"
              >
                Login
              </Link>
            ) : (
              <>
                {/* <div className="dropdown d-none d-sm-block me-3">
                  <a
                    className="btn btn-sm btn-light rounded-circle position-relative"
                    href="#"
                    role="button"
                    id="notificationDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <Bell size={18} />
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      2
                      <span className="visually-hidden">
                        unread notifications
                      </span>
                    </span>
                  </a>
                  <ul
                    className="dropdown-menu dropdown-menu-end shadow-sm"
                    aria-labelledby="notificationDropdown"
                  >
                    <li>
                      <h6 className="dropdown-header">Notifications</h6>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        New inventory item added
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Stock update required
                      </a>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <a className="dropdown-item small" href="#">
                        View all notifications
                      </a>
                    </li>
                  </ul>
                </div> */}

                <div className="dropdown">
                  <a
                    className="d-flex align-items-center text-decoration-none dropdown-toggle"
                    href="#"
                    role="button"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <div
                      className="rounded-circle bg-light d-flex align-items-center justify-content-center me-2"
                      style={{ width: "32px", height: "32px" }}
                    >
                      <User size={16} />
                    </div>
                    <span className="d-none d-md-block">Profile</span>
                  </a>
                  <ul
                    className="dropdown-menu dropdown-menu-end shadow-sm"
                    aria-labelledby="userDropdown"
                  >
                     {/* <li>
                      <Link className="dropdown-item" to="/profile">
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/settings">
                        Settings
                      </Link>
                    </li> 
                    <li>
                      <hr className="dropdown-divider" />
                    </li> */}
                    <li>
                      <a
                        className="dropdown-item text-danger"
                        href="#"
                        onClick={logoutHandler}
                      >
                        Logout
                      </a>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
