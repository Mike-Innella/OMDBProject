// (directory path: /src/pages/MovieDetails.jsx)
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieDetails } from "../services/omdbApi";
import { CartContext } from "../context/CartContext";
import "../Styling/Pages.css";
import "../Styling/MovieDetails.css";

const MovieDetails = () => {
  const { imdbID } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const handleAddToCart = () => {
    if (movie) {
      // Add price to movie object before adding to cart
      const movieWithPrice = {
        ...movie,
        price: discountedPrice || price
      };
      
      addToCart(movieWithPrice);
      setAddedToCart(true);
      
      // Reset the "Added to Cart" message after 2 seconds
      setTimeout(() => {
        setAddedToCart(false);
      }, 2000);
    }
  };

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

  const getPriceFromYear = (year) => {
    const currentYear = new Date().getFullYear();
    const releaseYear = parseInt(year);
    if (isNaN(releaseYear)) return 9.99;
    const maxPrice = 25;
    const minPrice = 5;
    const age = currentYear - releaseYear;
    const decay = age * 0.4;
    const price = Math.max(minPrice, maxPrice - decay);
    return parseFloat(price.toFixed(2));
  };

  const getDiscountedPrice = (title, year) => {
    const releaseYear = parseInt(year);
    const isEligible =
      title.length % 2 === 0 || new Date().getFullYear() - releaseYear > 10;
    if (!isEligible) return null;
    return parseFloat((getPriceFromYear(year) * 0.75).toFixed(2)); // 25% off
  };

  if (loading) return <div className="movie-details__loading">Loading...</div>;
  if (error) return <div className="movie-details__error">{error}</div>;
  if (!movie) return null;

  const price = getPriceFromYear(movie.Year);
  const discountedPrice = getDiscountedPrice(movie.Title, movie.Year);

  const posterUrl =
    movie.Poster && movie.Poster !== "N/A"
      ? movie.Poster
      : "https://via.placeholder.com/300x450?text=No+Poster+Available";

  return (
    <div className="movie-details container">
      <div className="movie-details__content">
        <div className="movie-details__poster-container">
          <img
            src={posterUrl}
            alt={`${movie.Title} poster`}
            className="movie-details__poster"
          />
        </div>

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

          {discountedPrice ? (
            <p>
              <strong>Price:</strong>{" "}
              <span style={{ textDecoration: "line-through", color: "gray" }}>
                ${price.toFixed(2)}
              </span>{" "}
              <span style={{ color: "green", fontWeight: "bold" }}>
                ${discountedPrice.toFixed(2)}
              </span>{" "}
              <span
                style={{
                  backgroundColor: "#ff4d4f",
                  color: "white",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                  marginLeft: "8px",
                }}
              >
                25% OFF!
              </span>
            </p>
          ) : (
            <p>
              <strong>Price:</strong> ${price.toFixed(2)}
            </p>
          )}

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
      
      <div className="movie-details__footer">
        <button className="movie-details__back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        
        <div className="movie-details__actions">
          <button 
            className="movie-details__add-to-cart" 
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
          {addedToCart && (
            <span className="movie-details__added-message">
              Added to cart!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
