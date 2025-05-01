// (directory path: /src/components/Header.jsx)
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { CartContext } from "../context/CartContext";
import "../Styling/Header.css";

const Header = () => {
  // Context hooks
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { getItemCount } = useContext(CartContext);

  // Mobile menu state
  const [menuOpen, setMenuOpen] = useState(false);

  // Toggle burger menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <div className="header__container">
        {/* Logo */}
        <div className="header__logo">
          <Link to="/">OMDB Movie Store</Link>
        </div>

        {/* Theme Toggle Button */}
        <button
          className={`header__theme-toggle ${
            theme === "dark" ? "dark" : "light"
          }`}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        {/* Burger Menu Button (Mobile) */}
        <button
          className={`header__burger-menu ${menuOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className={`header__nav ${menuOpen ? "open" : ""}`}>
        <ul>
          <li>
            <Link to="/about" onClick={() => setMenuOpen(false)}>
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>
              Contact
            </Link>
          </li>
          <li>
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              Login/Signup
            </Link>
          </li>
          <li>
            <Link to="/profile" onClick={() => setMenuOpen(false)}>
              Profile
            </Link>
          </li>
          <li>
            <Link
              to="/cart"
              className="header__cart-link"
              onClick={() => setMenuOpen(false)}
            >
              <span>Cart</span>
              {!menuOpen && (
                <span className="header__cart-count">{getItemCount()}</span>
              )}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
