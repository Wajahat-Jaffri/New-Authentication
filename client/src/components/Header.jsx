import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleAboutClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate("/login");
    }
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? "bg-white text-green-700 px-4 py-2 rounded-lg font-semibold shadow"
      : "text-white hover:bg-white/20 px-4 py-2 rounded-lg transition duration-300";

  return (
    <header className="bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        {/* Logo */}
        <h1 className="text-2xl font-bold text-white tracking-wide">
          Authentication
        </h1>

        {/* Nav */}
        <nav className="flex items-center gap-3">

          {/* Home */}
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>

          {/* About (always visible but protected click) */}
          <NavLink
            to="/about"
            onClick={handleAboutClick}
            className={linkClass}
          >
            About
          </NavLink>

          {/* Authenticated UI */}
          {isAuthenticated ? (
            <>
              <span className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium">
                👋 {user?.name}
              </span>

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition duration-300 shadow-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="bg-white text-green-700 hover:bg-gray-100 px-4 py-2 rounded-lg font-semibold transition duration-300 shadow"
              >
                Register
              </NavLink>
            </>
          )}

        </nav>
      </div>
    </header>
  );
};

export default Header;