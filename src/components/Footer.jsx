// (directory path: /src/components/Footer.jsx)
import React from "react";
import { Link } from "react-router-dom";
import "../Styling/Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        {/* Navigation Links */}
        <div className="footer__links">
          <ul>
            <li>
              <Link className="footer__link" to="/about">
                About
              </Link>
            </li>
            <li>
              <Link className="footer__link" to="/contact">
                Contact
              </Link>
            </li>
            <li>
              <Link className="footer__link" to="/login">
                Login/Signup
              </Link>
            </li>
            <li>
              <Link className="footer__link" to="/profile">
                Profile
              </Link>
            </li>
            <li>
              <Link className="footer__link" to="/cart">
                Cart
              </Link>
            </li>
          </ul>
        </div>

        {/* Admin Dashboard Shortcut */}
        <div className="footer__admin">
          <Link className="footer__admin-link" to="/admin">
            Admin Dashboard
          </Link>
        </div>

        {/* Copyright */}
        <div className="footer__copyright">
          <p>&copy; {currentYear} OMDB Movie Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
