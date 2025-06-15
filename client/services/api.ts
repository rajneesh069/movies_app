export const TMDB_CONFIG = {
  BASE_URL: "https://movies-app-cyyz.onrender.com",
  headers: {
    accept: "application/json",
  },
};

export const fetchMovies = async ({ query }: { query: string }) => {
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    console.error(`Error fetching the data: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data.results;
};
