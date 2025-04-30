// (directory path: /src/context/ThemeContext.js)
import React, { createContext, useState, useEffect } from "react";

// Create theme context
export const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Get initial theme preference from localStorage or default to "light"
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme : "light";
  };

  // Theme state
  const [theme, setTheme] = useState(getInitialTheme);

  // Apply theme class to document body and save preference
  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  // Toggle between light and dark theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Provide context value
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
