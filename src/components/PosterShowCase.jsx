import axios from "../axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

const genresList = [
  { genre: "action", id: 28 },
  { genre: "adventure", id: 12 },
  { genre: "animation", id: 16 },
  { genre: "comedy", id: 35 },
  { genre: "crime", id: 80 },
  { genre: "documentary", id: 99 },
  { genre: "drama", id: 18 },
  { genre: "family", id: 10751 },
  { genre: "fantasy", id: 14 },
  { genre: "history", id: 36 },
  { genre: "horror", id: 27 },
  { genre: "music", id: 10402 },
  { genre: "mystery", id: 9648 },
  { genre: "romance", id: 10749 },
  { genre: "science fiction", id: 878 },
  { genre: "tv movie", id: 10770 },
  { genre: "thriller", id: 53 },
  { genre: "war", id: 10752 },
  { genre: "western", id: 37 },
];

function PosterShowCase() {
  const { q } = useParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const capitalizeFirstLetter = str => str[0].toUpperCase() + str.slice(1)

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let response;

        const query = q?.toLowerCase().trim();

        const matchedGenre = genresList.find(
          (g) => g.genre === query
        );

        if (query === "trending") {
          response = await axios.get(
            `trending/movie/week?api_key=dae65ee16695fcfc443985edb181f1e4`
          );
        } else if (matchedGenre) {
          response = await axios.get(
            `discover/movie?api_key=dae65ee16695fcfc443985edb181f1e4&with_genres=${matchedGenre.id}&sort_by=popularity.desc&page=1`
          );
        } else {
          response = await axios.get(
            `/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`
          );
        }

        if (response.data.results && response.data.results.length === 1) {
          navigate(`/movie/${response.data.results[0].id}`);
        } else {
          setMovies(response.data.results || []);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [q, navigate]);

  const categories = [{ title: capitalizeFirstLetter(q), movies }];

  return loading ? (
    <div className="poster-section">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div key={idx}>
          <div className="place-title place-shimmer"></div>
          <div className="poster-grid">
            {Array.from({ length: 10 }).map((_, i) => (
              <div className="poster-item" key={i}>
                <div className="place-poster place-shimmer"></div>
                <div className="place-overlay">
                  <div className="place-bottom">
                    <div className="place-info">
                      <div className="place-text-short place-shimmer"></div>
                      <div className="place-text-tiny place-shimmer"></div>
                    </div>
                    <div className="place-btn place-shimmer"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="poster-section">
      {categories.map((category) => (
        <div key={category.title}>
          <h1 className="poster-heading">{category.title}</h1>
          <div className="poster-grid">
            {category.movies.map((movie) => (
              <div className="poster-item" key={movie.id}>
                <img
                  className="poster-image"
                  src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                  alt={movie.title}
                />
                <div className="poster-overlay">
                  <div className="poster-bottom">
                    <div className="poster-info">
                      <h3 className="poster-title">{movie.title}</h3>
                      <p className="poster-date">{movie.release_date}</p>
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

export default PosterShowCase;
