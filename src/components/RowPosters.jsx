import React, { useEffect, useState } from "react";
import axios from "../axios";
import { Link } from "react-router";

function RowPosters() {
  const [movies, setMovies] = useState([]);
  const [dramaMovies, setDramaMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);

  const [skeleton, setSkeleton] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [trendingRes, dramaRes, actionRes, comedyRes] = await Promise.all(
          [
            axios.get(
              "trending/movie/week?api_key=dae65ee16695fcfc443985edb181f1e4"
            ),
            axios.get(
              "discover/movie?api_key=dae65ee16695fcfc443985edb181f1e4&with_genres=18&sort_by=popularity.desc&page=1"
            ),
            axios.get(
              "discover/movie?api_key=dae65ee16695fcfc443985edb181f1e4&with_genres=28&sort_by=popularity.desc&page=1"
            ),
            axios.get(
              "discover/movie?api_key=dae65ee16695fcfc443985edb181f1e4&with_genres=35&sort_by=popularity.desc&page=1"
            ),
          ]
        );

        setMovies(trendingRes.data.results);
        setDramaMovies(dramaRes.data.results);
        setActionMovies(actionRes.data.results);
        setComedyMovies(comedyRes.data.results);
        setTimeout(() => {
          setSkeleton(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  const categories = [
    { title: "Trending", movies },
    { title: "Drama", movies: dramaMovies },
    { title: "Action", movies: actionMovies },
    { title: "Comedy", movies: comedyMovies },
  ];

  return skeleton ? (
    <div className="bottom-con">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div key={idx}>
          <div className="skeleton-title shimmer"></div>
          <div className="posters">
            {Array.from({ length: 10 }).map((_, i) => (
              <div className="poster-container" key={i}>
                <div className="poster skeleton shimmer"></div>
                <div className="poster-overlay skeleton-overlay">
                  <div className="poster-bottom">
                    <div className="poster-info">
                      <div className="skeleton-text short shimmer"></div>
                      <div className="skeleton-text tiny shimmer"></div>
                    </div>
                    <div className="poster-btn skeleton-btn shimmer"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="bottom-con">
      {categories.map((category) => (
        <div key={category.title}>
          <h1>{category.title}</h1>
          <div className="posters">
            {category.movies.map((movie) => (
              <div className="poster-container" key={movie.id}>
                <img
                  className="poster"
                  src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                  alt={movie.title}
                />
                <div className="poster-overlay">
                  <div className="poster-bottom">
                    <div className="poster-info">
                      <h3>{movie.title}</h3>
                      <p>{movie.release_date}</p>
                    </div>
                    <Link to={`/movie/${movie.id}`} className="poster-btn">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default RowPosters;
