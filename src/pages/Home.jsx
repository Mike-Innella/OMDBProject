// (directory path: /src/pages/Home.jsx)
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import MovieList from "../components/MovieList";
import {
  getTopRatedMovies,
  getRecentReleases,
  searchMoviesWithDetails,
} from "../services/omdbApi";

import "../Styling/Pages.css";

const Home = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [recentReleases, setRecentReleases] = useState([]);
  const [loading, setLoading] = useState({
    search: false,
    topRated: true,
    recent: true,
  });
  const [error, setError] = useState({
    search: null,
    topRated: null,
    recent: null,
  });

  // Fetch top rated and recent release data on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const topRated = await getTopRatedMovies();
        setTopRatedMovies(topRated.Search || []);
        setLoading((prev) => ({ ...prev, topRated: false }));
      } catch (error) {
        console.error("Error fetching top rated movies:", error);
        setError((prev) => ({ ...prev, topRated: error.message }));
        setLoading((prev) => ({ ...prev, topRated: false }));
      }

      try {
        const recent = await getRecentReleases();
        setRecentReleases(recent.Search || []);
        setLoading((prev) => ({ ...prev, recent: false }));
      } catch (error) {
        console.error("Error fetching recent releases:", error);
        setError((prev) => ({ ...prev, recent: error.message }));
        setLoading((prev) => ({ ...prev, recent: false }));
      }
    };

    fetchInitialData();
  }, []);

  // Handle movie search
  const handleSearch = async (searchTerm) => {
    setLoading((prev) => ({ ...prev, search: true }));
    setError((prev) => ({ ...prev, search: null }));

    try {
      const results = await searchMoviesWithDetails(searchTerm);
      setSearchResults(results); // Already a full array
    } catch (error) {
      console.error("Search error:", error);
      setError((prev) => ({ ...prev, search: error.message }));
    } finally {
      setLoading((prev) => ({ ...prev, search: false }));
    }
  };

  return (
    <div className="home-page container">
      {/* Hero Section */}
      <section className="home-page__hero">
        <div className="home-page__hero-content">
          <h1>Find Your Favorite Movies</h1>
          <p>Search from thousands of titles and add them to your collection</p>
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      {/* Search Results */}
      {(searchResults.length > 0 || loading.search || error.search) && (
        <section className="home-page__search-results">
          <MovieList
            movies={searchResults}
            title="Search Results"
            loading={loading.search}
            error={error.search}
          />
        </section>
      )}

      {/* Top Rated Movies */}
      <section className="home-page__top-rated">
        <MovieList
          movies={topRatedMovies.slice(0, 5)}
          title="Top Rated Movies"
          loading={loading.topRated}
          error={error.topRated}
        />
      </section>

      {/* Recent Releases */}
      <section className="home-page__recent-releases">
        <MovieList
          movies={recentReleases.slice(0, 5)}
          title="Most Recent Releases"
          loading={loading.recent}
          error={error.recent}
        />
      </section>

      {/* View All Movies Button */}
      <section className="home-page__all-movies">
        <Link to="/all-movies" className="home-page__all-movies-btn">
          View All Movies
        </Link>
      </section>
    </div>
  );
};

export default Home;
