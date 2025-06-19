import React from "react";
import { useState, useEffect } from "react";
import logo from "/src/assets/Logo.png";
const API_KEY = "136d55d9c6878da748d19b6aa4870c86"; // Replace with your key

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [originalMovies, setOriginalMovies] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  // let debounceTimeout;

  const searchMovies = async () => {
    if (!query) return;
    setRecentSearches((prev) => {
      const updated = [query, ...prev.filter((q) => q !== query)];
      return updated.slice(0, 5); // Limit to 5 recent searches
    });
    setLoading(true);
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}`
    );
    const data = await res.json();
    setMovies(data.results || []);
    setLoading(false);
    setShowDropdown(false);
  };

  useEffect(() => {
    const fetchInitialMovies = async () => {
      setLoading(true);
      try {
        const [res1, res2] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=1`
          ),
          fetch(
            `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=2`
          ),
        ]);
        const data1 = await res1.json();
        const data2 = await res2.json();
        setMovies([...data1.results, ...data2.results]);
        setOriginalMovies([...data1.results, ...data2.results]);
      } catch (err) {
        console.error("Error fetching initial movies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialMovies();
  }, []);
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div
        className="min-h-screen text-white 
    "
      >
        <header>
          <div className="flex justify-between">
            <div className="flex justify-left items-left">
              <img src={logo} alt="HanapFlix Logo" className="w-30" />
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <span className="mr-2 text-sm text-black dark:text-white">
                {darkMode ? "🌙 Dark" : "☀ Light"}
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
                <div className="w-11 h-6 bg-gray-300 dark:bg-gray-700 rounded-full shadow-inner transition-colors duration-300"></div>
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ${
                    darkMode ? "translate-x-5" : ""
                  }`}
                ></div>
              </div>
            </label>
          </div>
        </header>
        <h1 className="text-4xl font-bold text-center text-black mb-6 dark:text-white">
          HanapFlix
        </h1>
        <div className="flex justify-center mb-8">
          <div className="sm:w-1/2 w-1/3">
            <div className="flex items-center bg-white text-black rounded-xl pl-3 pr-2 h-14 border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600 relative">
              <ion-icon
                name="search-outline"
                onClick={searchMovies}
                className="text-xl mr-2 text-gray-500"
              ></ion-icon>
              <input
                type="text"
                placeholder="Search for a movie..."
                className="py-2 w-[92%] outline-none bg-transparent  "
                value={query}
                onChange={(e) => {
                  const value = e.target.value;
                  setQuery(value);

                  if (value === "") {
                    setMovies(originalMovies);
                  } else {
                    setShowDropdown(true);
                  }
                }}
                onFocus={() => setShowDropdown(true)}
                onKeyDown={(e) => e.key === "Enter" && searchMovies()}
              />

              {query && (
                <ion-icon
                  name="close-outline"
                  onClick={() => {
                    setQuery("");
                    setMovies(originalMovies);
                  }}
                  className=" text-xl text-gray-400 hover:text-gray-600 cursor-pointer"
                ></ion-icon>
              )}
            </div>
            {showDropdown && recentSearches.length > 0 && (
              <div className="bg-white dark:bg-gray-800 text-black dark:text-white mt-1 rounded-md shadow-md border border-gray-200 overflow-y-auto absolute z-10 w-[32%] sm:w-[47%]">
                {recentSearches.map((item, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => {
                      setQuery(item);
                      setShowDropdown(false);
                      inputRef.current.focus();
                    }}
                  >
                    <ion-icon
                      name="search-outline"
                      onClick={searchMovies}
                      className="text-xl mr-2 text-gray-500"
                    ></ion-icon>
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="bg-gray-800 rounded-xl hover:scale-110 hover:z-10 hover:cursor-pointer transition-transform duration-200 shadow-lg relative"
              >
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                    className="rounded-md w-full object-cover"
                  />
                ) : (
                  <div className=" bg-gray-700 rounded-md flex items-center justify-center text-sm text-gray-400">
                    No image
                  </div>
                )}
                <div className="absolute bottom-0 bg-white/40 rounded-t-xl w-full p-4">
                  <h2 className="text-lg font-semibold text-gray-100">
                    {movie.title}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {movie.release_date
                      ? new Date(movie.release_date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "N/A"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
