import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaBusAlt, FaBars, FaTimes, FaHeadset } from "react-icons/fa"; // added headset icon
import { logout } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import { persistor } from "../redux/store";
import { toast } from "react-toastify";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    toast.success("Logout successfully");
    persistor.purge();
    navigate("/login");
  };

  // Define links
  const links = [
    { name: "Search", path: "/search" },
    { name: "My Bookings", path: "/my-bookings" },
  ];

  if (isLoggedIn) {
    links.push({ name: "Customer Support", path: "/support", icon: <FaHeadset className="inline mb-1 mr-1" /> });
    links.push({ name: "Logout", path: "#", onClick: handleLogout });
  } else {
    links.push({ name: "Login", path: "/login" });
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-blue-700 font-bold text-xl">
          <FaBusAlt /> TripEase
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6 text-gray-700 font-medium">
          {links.map(({ name, path, onClick, icon }) => (
            <Link
              key={name}
              to={path}
              onClick={onClick ? (e) => { e.preventDefault(); onClick(); } : undefined}
              className="hover:text-blue-600 transition cursor-pointer"
            >
              {icon} {name}
            </Link>
          ))}
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="md:hidden text-gray-700 text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="md:hidden px-6 pb-4 bg-white"
          >
            <div className="flex flex-col gap-4 text-gray-700 font-medium">
              {links.map(({ name, path, onClick, icon }) => (
                <Link
                  key={name}
                  to={path}
                  onClick={(e) => {
                    if (onClick) {
                      e.preventDefault();
                      onClick();
                    }
                    setMenuOpen(false);
                  }}
                  className="hover:text-blue-600 transition cursor-pointer"
                >
                  {icon} {name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
