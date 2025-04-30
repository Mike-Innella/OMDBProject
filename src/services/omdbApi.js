// (directory path: /src/services/omdbApi.js)

// Constants
const API_KEY = "b750bac";
const BASE_URL = "https://www.omdbapi.com/";

/**
 * Search for movies by title
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
 * Get top rated movies (simulated)
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
  const results = [];

  try {
    for (const title of popularTitles) {
      if (results.length >= count) break;

      const response = await searchMovies(title);
      if (response.Search) {
        results.push(...response.Search.slice(0, 3));
      }
    }

    return { Search: results.slice(0, count) };
  } catch (error) {
    console.error("Error fetching top rated movies:", error);
    throw error;
  }
};

/**
 * Get most recent releases (simulated)
 * @param {number} count
 * @returns {Promise}
 */
export const getRecentReleases = async (count = 10) => {
  const currentYear = new Date().getFullYear();

  try {
    const response = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&s=movie&y=${currentYear}&type=movie`
    );
    const data = await response.json();

    if (data.Response === "False") {
      const fallbackResponse = await fetch(
        `${BASE_URL}?apikey=${API_KEY}&s=movie&y=${currentYear - 1}&type=movie`
      );
      const fallbackData = await fallbackResponse.json();

      if (fallbackData.Response === "False") {
        throw new Error(
          fallbackData.Error || "Failed to fetch recent releases"
        );
      }

      return { Search: fallbackData.Search.slice(0, count) };
    }

    return { Search: data.Search.slice(0, count) };
  } catch (error) {
    console.error("Error fetching recent releases:", error);
    throw error;
  }
};

/**
 * Get all movies (paginated)
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
