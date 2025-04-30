// /src/pages/AllMovies.jsx

import React, { useState, useEffect } from "react";
import MovieList from "../components/MovieList";
import { getAllMoviesWithDetails } from "../services/omdbApi";

const AllMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch movies for a specific page
  const fetchMovies = async (pageNum) => {
    try {
      setLoading(true);
      const data = await getAllMoviesWithDetails(pageNum);
      
      if (!data.Search || data.Search.length === 0) {
        setHasMore(false);
      } else {
        setMovies(prev => [...prev, ...data.Search]);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch movies.");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchMovies(1);
  }, []);

  // Handle load more button click
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMovies(nextPage);
  };

  return (
    <div className="all-movies-page">
      <MovieList
        movies={movies}
        title="All Movies"
        loading={loading}
        error={error}
      />
      
      {hasMore && (
        <div className="all-movies-page__load-more">
          <button 
            className="all-movies-page__load-more-button" 
            onClick={handleLoadMore}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More Movies"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AllMovies;
