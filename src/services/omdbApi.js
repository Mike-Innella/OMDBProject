// (directory path: /src/services/omdbApi.js)

// Constants
const API_KEY = "b750bac";
const BASE_URL = "https://www.omdbapi.com/";

/**
 * Search for movies by title (basic metadata only)
 * @param {string} searchTerm
 * @param {number} page
 * @returns {Promise}
 */
export const searchMovies = async (searchTerm, page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(
        searchTerm
      )}&page=${page}`
    );
    const data = await response.json();

    if (data.Response === "False") {
      throw new Error(data.Error || "Failed to fetch movies");
    }

    return data;
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
};

/**
 * Get detailed info for a specific movie by ID
 * @param {string} imdbId
 * @returns {Promise}
 */
export const getMovieDetails = async (imdbId) => {
  try {
    const response = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&i=${imdbId}&plot=full`
    );
    const data = await response.json();

    if (data.Response === "False") {
      throw new Error(data.Error || "Failed to fetch movie details");
    }

    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

/**
 * Get top rated movies (simulated list with full metadata)
 * @param {number} count
 * @returns {Promise}
 */
export const getTopRatedMovies = async (count = 10) => {
  const popularTitles = [
    "Inception",
    "Interstellar",
    "The Dark Knight",
    "Minecraft",
    "The Godfather",
  ];
  const detailedResults = [];

  try {
    for (const title of popularTitles) {
      if (detailedResults.length >= count) break;

      const basicResponse = await searchMovies(title);
      if (basicResponse.Search) {
        const moviesToFetch = basicResponse.Search.slice(0, 3);
        const fullMovies = await Promise.all(
          moviesToFetch.map((movie) => getMovieDetails(movie.imdbID))
        );
        detailedResults.push(...fullMovies);
      }
    }

    return { Search: detailedResults.slice(0, count) };
  } catch (error) {
    console.error("Error fetching top rated movies:", error);
    throw error;
  }
};

/**
 * Get most recent releases (simulated list with full metadata)
 * @param {number} count
 * @returns {Promise}
 */
export const getRecentReleases = async (count = 10) => {
  const currentYear = new Date().getFullYear();
  const detailedResults = [];

  const fetchRecent = async (year) => {
    const response = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&s=movie&y=${year}&type=movie`
    );
    const data = await response.json();
    return data.Search || [];
  };

  try {
    let movies = await fetchRecent(currentYear);

    if (!movies.length) {
      movies = await fetchRecent(currentYear - 1);
    }

    const moviesToFetch = movies.slice(0, count);

    const fullDetails = await Promise.all(
      moviesToFetch.map((movie) => getMovieDetails(movie.imdbID))
    );

    return { Search: fullDetails };
  } catch (error) {
    console.error("Error fetching recent releases:", error);
    throw error;
  }
};

/**
 * Get all movies (paginated) — basic metadata only
 * @param {number} page
 * @returns {Promise}
 */
export const getAllMovies = async (page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&s=movie&type=movie&page=${page}`
    );
    const data = await response.json();

    if (data.Response === "False") {
      throw new Error(data.Error || "Failed to fetch movies");
    }

    return data;
  } catch (error) {
    console.error("Error fetching all movies:", error);
    throw error;
  }
};

/**
 * Search for movies and retrieve full details for each
 * @param {string} searchTerm
 * @returns {Promise<Array>}
 */
export const searchMoviesWithDetails = async (searchTerm) => {
  try {
    const basicResults = await searchMovies(searchTerm);
    if (!basicResults.Search) return [];

    const detailedResults = await Promise.all(
      basicResults.Search.map((movie) => getMovieDetails(movie.imdbID))
    );

    return detailedResults;
  } catch (error) {
    console.error("Error searching movies with details:", error);
    return [];
  }
};
