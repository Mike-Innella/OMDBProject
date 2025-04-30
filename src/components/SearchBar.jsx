// (directory path: /src/components/SearchBar.jsx)
import React, { useState } from "react";
import "../Styling/SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Handle input change
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    if (!searchTerm.trim()) return;

    setIsSearching(true);

    try {
      await onSearch(searchTerm);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      {/* Search Bar */}
      <div className="search-bar">
        <form onSubmit={handleSubmit} className="search-bar__form">
          <input
            type="text"
            className="search-bar__input"
            placeholder="Search for movies..."
            value={searchTerm}
            onChange={handleInputChange}
            disabled={isSearching}
          />
          <button
            className="search-bar__button"
            type="submit"
            disabled={isSearching || !searchTerm.trim()}
          >
            {isSearching ? <span className="search-bar__spinner" /> : "Search"}
          </button>
        </form>

        {/* Suggestion Tags */}
        <div className="search-bar__suggestions">
          <p>Popular Searches</p>
          <div className="search-bar__tags">
            <button
              className="search-bar__tag"
              type="button"
              onClick={(e) => {
                setSearchTerm("Star Wars");
                handleSubmit(e);
              }}
            >
              Star Wars
            </button>

            <button
              className="search-bar__tag"
              type="button"
              onClick={(e) => {
                setSearchTerm("Marvel");
                handleSubmit(e);
              }}
            >
              Marvel
            </button>

            <button
              className="search-bar__tag"
              type="button"
              onClick={(e) => {
                setSearchTerm("Harry Potter");
                handleSubmit(e);
              }}
            >
              Harry Potter
            </button>

            <button
              className="search-bar__tag"
              type="button"
              onClick={(e) => {
                setSearchTerm("Lord of the rings");
                handleSubmit(e);
              }}
            >
              Lord of the rings
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBar;
