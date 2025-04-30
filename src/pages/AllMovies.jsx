// /src/pages/AllMovies.jsx

import React, { useState, useEffect } from "react";
import MovieList from "../components/MovieList";
import { getAllMovies } from "../services/omdbApi";

const AllMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getAllMovies(1); // Fetch the first page of results
        setMovies(data.Search || []);
      } catch (err) {
        setError(err.message || "Failed to fetch movies.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="all-movies-page">
      <MovieList
        movies={movies}
        title="All Movies"
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default AllMovies;
