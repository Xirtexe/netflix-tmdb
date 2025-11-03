import React, { useEffect, useState } from "react";
import axios from "../axios";
import { Link } from "react-router";

function Banner() {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const [skeleton, setSkeleton] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      const response = await axios.get(
        "trending/movie/day?api_key=dae65ee16695fcfc443985edb181f1e4"
      );
      setMovies(response.data.results);
      setTimeout(() => {
        setSkeleton(false);
      }, 1000);
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrentIndex((prev) =>
          movies.length ? (prev + 1) % movies.length : 0
        );
        setFade(false);
      }, 200);
    }, 15000); // change every 5 seconds

    return () => clearInterval(interval);
  }, [movies]);

  if (!movies.length) return null;

  const movie = movies[currentIndex];

  return skeleton ? (
    <div className="banner skeleton-banner">
      <div className="fade-bottom">
        <div className="content">
          <div className="skeleton-title shimmer"></div>
          <div className="skeleton-buttons">
            <div className="skeleton-btn shimmer"></div>
            <div className="skeleton-btn shimmer"></div>
          </div>
          <div className="skeleton-text shimmer"></div>
          <div className="skeleton-text shimmer"></div>
          <div className="skeleton-text short shimmer"></div>
        </div>
      </div>
    </div>
  ) : (
    <div
      className={`banner ${fade ? "fade" : ""}`}
      style={{
        background: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path}) center/cover no-repeat`,
      }}
    >
      <div className="fade-bottom">
        <div className="content">
          <h1 className={`con-h1 ${fade ? "fadeh1" : ""}`}>{movie.title}</h1>
          <div className="buttons">
            <button className="button">Watch List</button>
            <Link to={`/movie/${movie.id}`} className="button">
              View Details
            </Link>
          </div>
          <h3 className={`con-h3 ${fade ? "fadeh3" : ""}`}>{movie.overview}</h3>
        </div>
      </div>
    </div>
  );
}

export default Banner;
