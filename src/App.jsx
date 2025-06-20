import React, { useState, useEffect, useRef } from "react";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const searchContainerRef = useRef(null);
  const [showButton, setShowButton] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const openModal = (movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

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

        const combined = [...data1.results, ...data2.results];

        // Sort by popularity descending
        combined.sort((a, b) => b.popularity - a.popularity);

        setMovies(combined);
        setOriginalMovies(combined);
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
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div
        className="min-h-screen text-white 
    "
      >
        <header
          className={`sticky top-0 z-50 px-6 transition-all duration-300 ${
            isScrolled
              ? darkMode
                ? "bg-gray-900/90 shadow-md"
                : "bg-gray-100/90 shadow-md"
              : "bg-transparent"
          }`}
        >
          <div className="flex justify-between">
            <div className="flex justify-left ">
              <div className="flex justify-center items-center">
                <img src={logo} alt="HanapFlix Logo" className="w-30" />
                <div
                  className={`text-2xl font-bold transition-all duration-300 ${
                    isScrolled
                      ? darkMode
                        ? "text-white"
                        : "text-black"
                      : "hidden"
                  }`}
                >
                  HanapFlix
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div
                className={` transition-all duration-300 ${
                  isScrolled ? "flex" : "hidden"
                }`}
              >
                <ion-icon
                  name="search-outline"
                  onClick={() => {
                    searchMovies();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-4xl mr-2 text-gray-500 cursor-pointer"
                ></ion-icon>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <span className="mr-2 text-lg text-black dark:text-white">
                  {darkMode ? "🌙 Dark" : "☀ Light"}
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                  />
                  <div className="w-16 h-8 bg-gray-300 dark:bg-gray-700 rounded-full shadow-inner transition-colors duration-300 relative">
                    <div
                      className={`absolute top-0.5 left-0.5 w-9 h-7 bg-white rounded-full shadow transform transition-transform duration-300 ${
                        darkMode ? "translate-x-8" : ""
                      }`}
                    ></div>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </header>
        <div className="px-10 mb-10">
          <h1 className="text-4xl font-bold text-center text-black mb-6 dark:text-white">
            HanapFlix
          </h1>
          <div className="flex justify-center mb-8">
            <div ref={searchContainerRef} className="sm:w-[80%] w-1/2 relative">
              <div
                className={`search-container  rounded-xl ${
                  showDropdown && recentSearches.length > 0
                    ? "rounded-b-none"
                    : ""
                }`}
              >
                <ion-icon
                  name="search-outline"
                  onClick={searchMovies}
                  className="text-4xl mr-2 text-gray-500 cursor-pointer"
                ></ion-icon>
                <input
                  type="text"
                  placeholder="Search for a movie..."
                  className="text-3xl py-2 w-full outline-none bg-transparent  "
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
                    className=" text-3xl text-gray-400 hover:text-gray-600 cursor-pointer"
                  ></ion-icon>
                )}
              </div>
              {showDropdown && recentSearches.length > 0 && (
                <>
                  <hr className="border-t border-gray-300 dark:border-white/50 px-5" />
                  <div className="dropdown-container">
                    {recentSearches.slice(0, 5).map((item, index) => (
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
                          className="text-2xl mr-2 text-gray-500"
                        ></ion-icon>
                        {item}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {loading ? (
            <p className="text-centet text-lg ">Please wait a moment...</p>
          ) : (
            <>
              {!query && (
                <div className="text-4xl font-bold mb-8 dark:text-white text-black">
                  Popular Shows
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
                {movies.map((movie) => (
                  <div key={movie.id} className="group image-container">
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full object-contain"
                        onClick={() => openModal(movie)}
                      />
                    ) : (
                      <div className="h-full bg-gray-700 rounded-md flex items-center justify-center text-sm text-gray-400">
                        No image
                      </div>
                    )}

                    {/* Show on hover */}
                    <div className="description">
                      <h2 className="text-xl font-semibold">{movie.title}</h2>
                      <p className="text-lg">
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

                {selectedMovie && (
                  <div
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 rounded-xl"
                    onClick={closeModal}
                  >
                    <div
                      className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-lg max-w-xl w-full shadow-lg relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ion-icon
                        name="close-outline"
                        onClick={closeModal}
                        className="absolute top-4 right-4 text-gray-500
                     hover:text-gray-200 text-4xl cursor-pointer bg-black rounded-full hover:scale-105"
                      ></ion-icon>
                      <img
                        src={`https://image.tmdb.org/t/p/w400${selectedMovie.poster_path}`}
                        alt={selectedMovie.title}
                        className="w-full rounded mb-4"
                      />
                      <div className="p-4">
                        <h2 className="text-3xl font-bold mb-2">
                          {selectedMovie.title}
                        </h2>
                        <p className="text-xl mb-4">{selectedMovie.overview}</p>
                        <p className="text-xl mb-4"></p>
                        <p className="text-md font-semibold">
                          Release Date:{" "}
                          {selectedMovie.release_date
                            ? new Date(
                                selectedMovie.release_date
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        {showButton && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-4 right-6  bg:gray-200/80 dark:bg:gray-200 text-white  rounded-full shadow-lg hover:bg-gray-600/50 transition"
          >
            <ion-icon name="chevron-up-outline" class="w-16 h-16"></ion-icon>
          </button>
        )}
        <footer className="mt-4 flex text-black text-center justify-center items-center p-10 text-lg dark:text-white ">
          Copyrights 2025 © HanapFlix. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
