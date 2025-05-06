import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bell, User, Menu } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("access_token");
  const user = JSON.parse(localStorage.getItem("user")); // Get user data

  function logoutHandler() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  // Check if route is active
  const isActive = (path) => location.pathname === path;

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
                  <Link 
                    className={`nav-link px-3 ${isActive('/dashboard') ? 'active fw-bold' : ''}`} 
                    to="/dashboard"
                  >
                    Dashboard
                  </Link>
                </li>

                {/* Staff Menu Items */}
                {user?.role === "staff" ? (
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link px-3 dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                    >
                      Lending
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <Link className="dropdown-item" to="/staff/lendings">
                          New Lending
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/lendings/data">
                          Lending Data
                        </Link>
                      </li>
                    </ul>
                  </li>
                ) : (
                  // Admin Menu Items
                  <>
                    <li className="nav-item">
                      <Link 
                        className={`nav-link px-3 ${isActive('/admin/stuffs') ? 'active fw-bold' : ''}`} 
                        to="/stuffs"
                      >
                        Inventory
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link 
                        className={`nav-link px-3 ${isActive('/admin/inbound') ? 'active fw-bold' : ''}`} 
                        to="/inbound"
                      >
                        Inbound
                      </Link>
                    </li>
                  </>
                )}
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
                    <span className="d-none d-md-block">
                      {user?.username || 'Profile'}
                      {/* {user?.role && (
                        <small className="d-block text-muted">
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </small>
                      )} */}
                    </span>
                  </a>
                  <ul
                    className="dropdown-menu dropdown-menu-end shadow-sm"
                    aria-labelledby="userDropdown"
                  >
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        My Profile
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
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
