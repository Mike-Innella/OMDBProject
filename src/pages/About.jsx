// (directory path: /src/pages/About.jsx)
import React from "react";
import { Link } from "react-router-dom";
import "../Styling/Pages.css";

const About = () => {
  return (
    <div className="about-page">
      {/* Page Header */}
      <div className="about__header">
        <h1>About OMDB Movie Store</h1>
      </div>

      {/* About Section */}
      <section className="about__section">
        <div className="about__content">
          <h2>Our Story</h2>
          <p>
            Welcome to OMDB Movie Store, your premier destination for
            discovering and collecting movies from around the world. Founded in
            2025, our platform connects movie enthusiasts with a vast library of
            films spanning all genres, eras, and cultures.
          </p>
          <p>
            We've partnered with the Open Movie Database (OMDB) to provide you
            with comprehensive information about thousands of titles, making it
            easier than ever to find your next favorite film.
          </p>

          <h2>Our Mission</h2>
          <p>
            At OMDB Movie Store, we believe that great cinema should be
            accessible to everyone. Our mission is to create a user-friendly
            platform where movie lovers can discover, learn about, and collect
            films that inspire, entertain, and provoke thought.
          </p>

          <h2>What We Offer</h2>
          <div className="about__features-grid">
            <div className="about__feature-item">
              <h3>Extensive Collection</h3>
              <p>
                Access to thousands of movies from classic masterpieces to the
                latest blockbusters.
              </p>
            </div>
            <div className="about__feature-item">
              <h3>Detailed Information</h3>
              <p>
                Comprehensive details including directors, cast, plot summaries,
                ratings and more.
              </p>
            </div>
            <div className="about__feature-item">
              <h3>Personalized Experience</h3>
              <p>
                Create an account to track your favorite movies and build your
                collection.
              </p>
            </div>
            <div className="about__feature-item">
              <h3>Curated Recommendations</h3>
              <p>
                Discover new films based on your preferences and viewing
                history.
              </p>
            </div>
          </div>

          <h2>How It Works</h2>
          <ol className="about__how-it-works">
            <li>
              <strong>Browse or Search:</strong> Explore our curated collections
              or search for specific titles, actors, or directors.
            </li>
            <li>
              <strong>Discover:</strong> Learn more about each movie with
              detailed information and reviews.
            </li>
            <li>
              <strong>Add to Cart:</strong> Select the movies you want to add to
              your collection.
            </li>
            <li>
              <strong>Checkout:</strong> Complete your purchase and start
              enjoying your new additions.
            </li>
          </ol>

          {/* CTA Section */}
          <div className="about__cta">
            <h2>Ready to Start Your Movie Journey?</h2>
            <p>
              Explore our vast collection and find your next favorite film
              today!
            </p>
            <div className="about__cta-buttons">
              <Link to="/" className="btn btn--primary">
                Browse Movies
              </Link>
              <Link to="/contact" className="btn btn--secondary">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
