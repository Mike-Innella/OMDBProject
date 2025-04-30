// (directory path: /src/components/MovieCard.jsx)
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "../Styling/MovieCard.css";

const MovieCard = ({ movie }) => {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Handle missing poster image
  const posterUrl =
    movie.Poster && movie.Poster !== "N/A"
      ? movie.Poster
      : "https://via.placeholder.com/300x450?text=No+Poster+Available";

  // Generate price based on year
  const generatePrice = () => {
    if (!movie.Year) return "$9.99";
    const year = parseInt(movie.Year);
    if (year >= 2020) return "$19.99";
    if (year >= 2010) return "$14.99";
    if (year >= 2000) return "$12.99";
    if (year >= 1990) return "$9.99";
    return "$7.99";
  };

  // Navigate to detail route
  const handleCardClick = () => {
    navigate(`/movie/${movie.imdbID}`);
  };

  // Add to cart (stop propagation)
  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(movie);
  };

  return (
    <div className="movie-card" onClick={handleCardClick}>
      <div className="movie-card__poster">
        <img src={posterUrl} alt={`${movie.Title} poster`} />
        <div className="movie-card__year">{movie.Year}</div>
        <div className="movie-card__price">{generatePrice()}</div>
      </div>

      <div className="movie-card__info">
        <h3 className="movie-card__title">{movie.Title}</h3>
        <p className="movie-card__plot--short">
          {movie.Plot && movie.Plot !== "N/A"
            ? movie.Plot.length > 100
              ? `${movie.Plot.substring(0, 100)}...`
              : movie.Plot
            : "Plot information not available"}
        </p>
      </div>

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
