import React, { useState, useRef, useEffect } from "react";
import "../Styling/SearchBar.css";

// Custom debounce hook to delay search execution
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const SearchBar = ({ onSearch, onClear }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);
  // Increase debounce delay to 800ms to reduce API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 800);
  // Track the last search term to prevent duplicate searches
  const lastSearchedTermRef = useRef("");

  // Auto-focus input after clearing
  useEffect(() => {
    if (!searchTerm && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchTerm]);

  // Perform search when debounced search term changes
  useEffect(() => {
    // Skip if the debounced term is the same as the last searched term
    if (debouncedSearchTerm === lastSearchedTermRef.current) {
      return;
    }

    const performSearch = async () => {
      // Only search if there's a term to search for
      if (debouncedSearchTerm.trim()) {
        setIsSearching(true);
        try {
          await onSearch(debouncedSearchTerm);
          // Update the last searched term
          lastSearchedTermRef.current = debouncedSearchTerm;
        } catch (err) {
          console.error("Live search error:", err);
        } finally {
          setIsSearching(false);
        }
      }
      // Only clear if we had a previous search term and now it's empty
      else if (
        debouncedSearchTerm === "" &&
        lastSearchedTermRef.current !== ""
      ) {
        if (onClear) {
          onClear();
          // Update the last searched term
          lastSearchedTermRef.current = "";
        }
      }
    };

    performSearch();
  }, [debouncedSearchTerm, onSearch, onClear]);

  // Update search term without triggering immediate search
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;

    // Skip if the search term is the same as the last searched term
    if (searchTerm === lastSearchedTermRef.current) {
      return;
    }

    setIsSearching(true);
    try {
      await onSearch(searchTerm);
      // Update the last searched term
      lastSearchedTermRef.current = searchTerm;
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleTagClick = async (e, tag) => {
    e.preventDefault();

    // Skip if the tag is the same as the last searched term
    if (tag === lastSearchedTermRef.current) {
      return;
    }

    setSearchTerm(tag);
    setIsSearching(true);
    try {
      await onSearch(tag);
      // Update the last searched term
      lastSearchedTermRef.current = tag;
    } catch (error) {
      console.error("Tag search error:", error);
    } finally {
      setIsSearching(false);
    }

    // Focus the input after setting the tag
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit} className="search-bar__form">
        <input
          ref={inputRef}
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
          {["Star Wars", "Marvel", "Harry Potter", "Lord of the rings"].map(
            (tag) => (
              <button
                key={tag}
                className="search-bar__tag"
                type="button"
                onClick={(e) => handleTagClick(e, tag)}
              >
                {tag}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
