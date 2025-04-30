// (directory path: /src/services/omdbApi.js)

// Constants
const API_KEY = process.env.REACT_APP_OMDB_API_KEY || "b750bac";
const BASE_URL = "https://www.omdbapi.com/";

/**
 * Search for movies by title (basic metadata only)
 * @param {string} searchTerm
 * @param {number} page
 * @returns {Promise}
 */
export const searchMovies = async (searchTerm, page = 1) => {
  try {
    if (!searchTerm) {
      console.error("Search term is required");
      return { Search: [], totalResults: "0", Response: "True" };
    }

    const response = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(
        searchTerm
      )}&page=${page}`
    );
    
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return { Search: [], totalResults: "0", Response: "True" };
    }
    
    const data = await response.json();

    if (data.Response === "False") {
      console.error("API returned error:", data.Error);
      return { Search: [], totalResults: "0", Response: "True" };
    }

    return data;
  } catch (error) {
    console.error("Error searching movies:", error);
    return { Search: [], totalResults: "0", Response: "True" };
  }
};

/**
 * Get detailed info for a specific movie by ID
 * @param {string} imdbId
 * @returns {Promise}
 */
export const getMovieDetails = async (imdbId) => {
  try {
    if (!imdbId) {
      console.error("IMDb ID is required");
      return null;
    }

    const response = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&i=${imdbId}&plot=full`
    );
    
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return null;
    }
    
    const data = await response.json();

    if (data.Response === "False") {
      console.error("API returned error:", data.Error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
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
  let detailedResults = [];

  try {
    for (const title of popularTitles) {
      if (detailedResults.length >= count) break;

      try {
        const basicResponse = await searchMovies(title);
        if (basicResponse.Search) {
          const moviesToFetch = basicResponse.Search.slice(0, 3);
          
          // Use Promise.allSettled instead of Promise.all
          const fullMoviesPromises = await Promise.allSettled(
            moviesToFetch.map((movie) => {
              if (movie && movie.imdbID) {
                return getMovieDetails(movie.imdbID);
              }
              return Promise.resolve(null);
            })
          );
          
          // Filter out failed promises and extract values from fulfilled ones
          const fullMovies = fullMoviesPromises
            .filter(result => result.status === 'fulfilled' && result.value)
            .map(result => result.value);
            
          detailedResults.push(...fullMovies);
        }
      } catch (titleError) {
        console.error(`Error fetching movies for title "${title}":`, titleError);
        // Continue with the next title instead of failing the entire operation
        continue;
      }
    }

    return { Search: detailedResults.slice(0, count) };
  } catch (error) {
    console.error("Error fetching top rated movies:", error);
    // Return a valid response structure instead of throwing
    return { Search: [], totalResults: "0", Response: "True" };
  }
};

/**
 * Get most recent releases (simulated list with full metadata)
 * @param {number} count
 * @returns {Promise}
 */
export const getRecentReleases = async (count = 10) => {
  const currentYear = new Date().getFullYear();
  let detailedResults = [];

  const fetchRecent = async (year) => {
    try {
      const response = await fetch(
        `${BASE_URL}?apikey=${API_KEY}&s=movie&y=${year}&type=movie`
      );
      const data = await response.json();
      return data.Search || [];
    } catch (error) {
      console.error(`Error fetching movies for year ${year}:`, error);
      return [];
    }
  };

  try {
    let movies = await fetchRecent(currentYear);

    if (!movies.length) {
      movies = await fetchRecent(currentYear - 1);
    }

    const moviesToFetch = movies.slice(0, count);

    // Use Promise.allSettled instead of Promise.all
    const fullDetailsPromises = await Promise.allSettled(
      moviesToFetch.map((movie) => {
        if (movie && movie.imdbID) {
          return getMovieDetails(movie.imdbID);
        }
        return Promise.resolve(null);
      })
    );

    // Filter out failed promises and extract values from fulfilled ones
    detailedResults = fullDetailsPromises
      .filter(result => result.status === 'fulfilled' && result.value)
      .map(result => result.value);

    return { Search: detailedResults };
  } catch (error) {
    console.error("Error fetching recent releases:", error);
    // Return a valid response structure instead of throwing
    return { Search: [], totalResults: "0", Response: "True" };
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
      console.error("API returned error:", data.Error);
      // Return a valid response structure instead of throwing
      return { Search: [], totalResults: "0", Response: "True" };
    }

    return data;
  } catch (error) {
    console.error("Error fetching all movies:", error);
    // Return a valid response structure instead of throwing
    return { Search: [], totalResults: "0", Response: "True" };
  }
};

/**
 * Get all movies with detailed information including ratings
 * @param {number} page
 * @returns {Promise}
 */
export const getAllMoviesWithDetails = async (page = 1) => {
  try {
    const basicData = await getAllMovies(page);
    
    if (!basicData.Search) return basicData;
    
    // Use Promise.allSettled instead of Promise.all to handle individual failures
    const detailedResultsPromises = await Promise.allSettled(
      basicData.Search.map(movie => {
        // Add null check
        if (movie && movie.imdbID) {
          return getMovieDetails(movie.imdbID);
        }
        return Promise.resolve(null); // Return a resolved promise with null for invalid movies
      })
    );
    
    // Filter out failed promises and extract values from fulfilled ones
    const detailedResults = detailedResultsPromises
      .filter(result => result.status === 'fulfilled' && result.value)
      .map(result => result.value);
    
    return { ...basicData, Search: detailedResults };
  } catch (error) {
    console.error("Error fetching all movies with details:", error);
    // Return a valid response structure instead of throwing
    return { Search: [], totalResults: "0", Response: "True" };
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

    // Use Promise.allSettled instead of Promise.all to handle individual failures
    const detailedResultsPromises = await Promise.allSettled(
      basicResults.Search.map((movie) => {
        // Add null check
        if (movie && movie.imdbID) {
          return getMovieDetails(movie.imdbID);
        }
        return Promise.resolve(null); // Return a resolved promise with null for invalid movies
      })
    );

    // Filter out failed promises and extract values from fulfilled ones
    const detailedResults = detailedResultsPromises
      .filter(result => result.status === 'fulfilled' && result.value)
      .map(result => result.value);

    return detailedResults;
  } catch (error) {
    console.error("Error searching movies with details:", error);
    return [];
  }
};
