// (directory path: /src/pages/MovieDetails.jsx)
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieDetails } from "../services/omdbApi";
import "../Styling/Pages.css";
import "../Styling/MovieDetails.css"

const MovieDetails = () => {
  const { imdbID } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await getMovieDetails(imdbID);
        setMovie(data);
      } catch (err) {
        setError("Movie not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [imdbID]);

  if (loading) return <div className="movie-details__loading">Loading...</div>;
  if (error) return <div className="movie-details__error">{error}</div>;
  if (!movie) return null;

  const posterUrl =
    movie.Poster && movie.Poster !== "N/A"
      ? movie.Poster
      : "https://via.placeholder.com/300x450?text=No+Poster+Available";

  return (
    <div className="movie-details container">
      <button className="movie-details__back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="movie-details__content">
        <img
          src={posterUrl}
          alt={`${movie.Title} poster`}
          className="movie-details__poster"
        />

        <div className="movie-details__info">
          <h1>{movie.Title}</h1>
          <p>
            <strong>Released:</strong> {movie.Released}
          </p>
          <p>
            <strong>Genre:</strong> {movie.Genre}
          </p>
          <p>
            <strong>Runtime:</strong> {movie.Runtime}
          </p>
          <p>
            <strong>Director:</strong> {movie.Director}
          </p>
          <p>
            <strong>Actors:</strong> {movie.Actors}
          </p>
          <p>
            <strong>Language:</strong> {movie.Language}
          </p>
          <p>
            <strong>Country:</strong> {movie.Country}
          </p>
          <p>
            <strong>Awards:</strong> {movie.Awards}
          </p>
          <p>
            <strong>Plot:</strong> {movie.Plot}
          </p>

          {movie.Ratings && movie.Ratings.length > 0 && (
            <div>
              <strong>Ratings:</strong>
              <ul>
                {movie.Ratings.map((rating, index) => (
                  <li key={index}>
                    {rating.Source}: {rating.Value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
