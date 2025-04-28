import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Brain, Settings, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Header = ({
  openSignUpModal,
  openLoginModal,
  darkMode,
  setDarkMode,
}) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Apply dark mode to the document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`${darkMode ? 'bg-gray-900 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-200'} border-b sticky top-0 z-20`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Brain className={`h-6 w-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            <Link
              to={currentUser ? "/dashboard" : "/"}
              className="text-xl font-bold"
            >
              Tabula Rasa
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            {currentUser ? (
              <>
                {/* Hamburger Menu Button for Mobile */}
                <button
                  onClick={toggleMenu}
                  className={`md:hidden p-1.5 rounded-full ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>

                {/* Navigation Links */}
                <nav
                  className={`${
                    isMenuOpen ? "flex" : "hidden"
                  } md:flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-1 absolute md:static top-14 left-0 right-0 
                  ${darkMode ? 'bg-gray-900 md:bg-transparent' : 'bg-white md:bg-transparent'} 
                  p-4 md:p-0 border-b md:border-0 shadow-md md:shadow-none z-10`}
                >
                  <Link
                    to="/dashboard"
                    className={`px-3 py-2 text-sm ${
                      location.pathname === "/dashboard"
                        ? darkMode ? "bg-purple-900 text-purple-300" : "bg-purple-100 text-purple-600"
                        : darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"
                    } rounded-md flex items-center`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    Home
                  </Link>
                  <Link
                    to="/knowledge-map"
                    className={`px-3 py-2 text-sm ${
                      location.pathname === "/knowledge-map"
                        ? darkMode ? "bg-purple-900 text-purple-300" : "bg-purple-100 text-purple-600"
                        : darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"
                    } rounded-md flex items-center`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                    Knowledge Map
                  </Link>
                  <Link
                    to="/synaptic-sprint"
                    className={`opacity-50 cursor-not-allowed px-3 py-2 text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    } rounded-md flex items-center`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Synaptic Sprint
                  </Link>
                  <Link
                    to="/calendar"
                    className={`opacity-50 cursor-not-allowed px-3 py-2 text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    } rounded-md flex items-center`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Calendar
                  </Link>
                </nav>

                {/* Right Side Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`p-1.5 rounded-full ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    {darkMode ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                      </svg>
                    )}
                  </button>

                  <button className={`p-1.5 rounded-full ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'} hidden md:block`}>
                    <Settings className="h-4 w-4" />
                  </button>

                  <button
                    onClick={handleLogout}
                    className={`p-1.5 rounded-full ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'} hidden md:block`}
                  >
                    <LogOut className="h-4 w-4" />
                  </button>

                  <Link
                    to="/profile"
                    className={`${darkMode ? 'bg-purple-700 hover:bg-purple-800' : 'bg-purple-600 hover:bg-purple-700'} text-white text-sm px-4 py-1.5 rounded-md`}
                  >
                    My Profile
                  </Link>
                </div>
              </>
            ) : (
              <>
                <button className={`hidden md:inline-flex text-sm px-4 py-2 ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'} rounded-md`}>
                  About
                </button>
                <button className={`hidden md:inline-flex text-sm px-4 py-2 ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'} rounded-md`}>
                  Features
                </button>
                <button className={`hidden md:inline-flex text-sm px-4 py-2 ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'} rounded-md`}>
                  Pricing
                </button>
                <button
                  onClick={openLoginModal}
                  className={`text-sm px-4 py-1.5 border ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-md`}
                >
                  Login
                </button>
                <button
                  onClick={openSignUpModal}
                  className={`text-sm px-4 py-1.5 ${darkMode ? 'bg-purple-700 hover:bg-purple-800' : 'bg-purple-600 hover:bg-purple-700'} text-white rounded-md`}
                >
                  Sign Up
                </button>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-1.5 rounded-full ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  {darkMode ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;