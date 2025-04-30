// (directory path: /src/components/MovieList.jsx)
import React from "react";
import MovieCard from "./MovieCard";
import "../Styling/MovieList.css";

const MovieList = ({ movies, title, loading, error }) => {
  // if loading, show spinner
  if (loading) {
    return (
      <div className="movie-list">
        <h2 className="movie-list__title">{title}</h2>
        <div className="movie-list__loading">
          <p>Loading movies...</p>
        </div>
      </div>
    );
  }

  // if error occurred
  if (error) {
    return (
      <div className="movie-list">
        <h2 className="movie-list__title">{title}</h2>
        <div className="movie-list__error">
          <p>Error loading movies: {error}</p>
        </div>
      </div>
    );
  }

  // if no movies found
  if (!movies || movies.length === 0) {
    return (
      <div className="movie-list">
        <h2 className="movie-list__title">{title}</h2>
        <div className="movie-list__empty">
          <p>No movies found.</p>
        </div>
      </div>
    );
  }

  // Render list
  return (
    <div className="movie-list">
      <h2 className="movie-list__title">{title}</h2>
      <div className="movie-list__grid">
        {movies.map((movie) => (
          <div className="movie-list__item" key={movie.imdbID}>
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieList;
