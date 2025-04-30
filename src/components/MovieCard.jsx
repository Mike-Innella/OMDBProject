// (directory path: /src/components/MovieCard.jsx)
import React, { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import "../Styling/MovieCard.css";

const MovieCard = ({ movie }) => {
  const { addToCart } = useContext(CartContext);
  const [showDetails, setShowDetails] = useState(false);

  // Handle missing poster image
  const posterUrl =
    movie.Poster && movie.Poster !== "N/A"
      ? movie.Poster
      : "https://via.placeholder.com/300x450?text=No+Poster+Available";

  // Generate price based on year
  const generatePrice = () => {
    if (!movie.Year) return "$9.99";

    const year = parseInt(movie.Year);
    let price = 9.99;

    if (year >= 2020) {
      price = 19.99; // New releases
    } else if (year >= 2010) {
      price = 14.99; // Recent movies
    } else if (year >= 2000) {
      price = 12.99; // 2000s movies
    } else if (year >= 1990) {
      price = 9.99; // 90s movies
    } else {
      price = 7.99; // Classics
    }

    return `$${price.toFixed(2)}`;
  };

  // Toggle movie details
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  // Handle add to cart
  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent triggering card click
    addToCart(movie);
  };

  return (
    <div className="movie-card" onClick={toggleDetails}>
      <div className="movie-card__poster">
        <img src={posterUrl} alt={`${movie.Title} poster`} />
        <div className="movie-card__year">{movie.Year}</div>
        <div className="movie-card__price">{generatePrice()}</div>
      </div>

      <div className="movie-card__info">
        <h3 className="movie-card__title">{movie.Title}</h3>

        {/* Show limited info by default */}
        {!showDetails ? (
          <p className="movie-card__plot--short">
            {movie.Plot
              ? movie.Plot.length > 100
                ? `${movie.Plot.substring(0, 100)}...`
                : movie.Plot
              : "Plot information not available"}
          </p>
        ) : (
          // Show detailed info when expanded
          <div className="movie-card__details">
            {movie.Director && movie.Director !== "N/A" && (
              <p>
                <strong>Director: </strong>
                {movie.Director}
              </p>
            )}

            {movie.Released && movie.Released !== "N/A" && (
              <p>
                <strong>Released: </strong>
                {movie.Released}
              </p>
            )}

            {movie.Runtime && movie.Runtime !== "N/A" && (
              <p>
                <strong>Runtime: </strong>
                {movie.Runtime}
              </p>
            )}

            {movie.Genre && movie.Genre !== "N/A" && (
              <p>
                <strong>Genre: </strong>
                {movie.Genre}
              </p>
            )}

            {movie.Plot && movie.Plot !== "N/A" && (
              <p>
                <strong>Plot: </strong>
                {movie.Plot}
              </p>
            )}

            {movie.Actors && movie.Actors !== "N/A" && (
              <p>
                <strong>Actors: </strong>
                {movie.Actors}
              </p>
            )}

            {movie.Language && movie.Language !== "N/A" && (
              <p>
                <strong>Language: </strong>
                {movie.Language}
              </p>
            )}

            {movie.Country && movie.Country !== "N/A" && (
              <p>
                <strong>Country: </strong>
                {movie.Country}
              </p>
            )}

            {movie.Awards && movie.Awards !== "N/A" && (
              <p>
                <strong>Awards: </strong>
                {movie.Awards}
              </p>
            )}

            {movie.Ratings && movie.Ratings.length > 0 && (
              <div className="movie-card__ratings">
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
        )}
      </div>

      {/* Add to cart button */}
      <button
        className="movie-card__add-to-cart-button"
        onClick={handleAddToCart}
        aria-label={`Add ${movie.Title} to cart`}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default MovieCard;
