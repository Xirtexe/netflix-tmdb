import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import axios from "../axios";
import ReactPlayer from "react-player";

function Movie() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [mVideo, setMVideo] = useState("");
  const [isVideo, setIsVideo] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const { data } = await axios.get(
          `/movie/${id}?api_key=dae65ee16695fcfc443985edb181f1e4&language=en-US`
        );
        setMovie(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };
    fetchMovie();
  }, [id]);

  const fetchTrailer = async () => {
    try {
      const { data } = await axios.get(`/movie/${id}/videos`);
      const trailer = data.results.find(
        (v) => v.site === "YouTube" && v.type === "Trailer"
      );
      return trailer ? trailer.key : "";
    } catch (error) {
      console.error("Error fetching trailer:", error);
      return "";
    }
  };

  const handleButtonClick = async () => {
    if (!mVideo) {
      const key = await fetchTrailer();
      setMVideo(key);
      if (window.innerWidth < 768 && key) {
        window.open(`https://www.youtube.com/watch?v=${key}`, "_blank");
        return;
      }
    }

    if (window.innerWidth < 768 && mVideo) {
      window.open(`https://www.youtube.com/watch?v=${mVideo}`, "_blank");
      return;
    }

    const btn = buttonRef.current;
    if (btn) btn.innerText = isVideo ? "Watch Trailer Now!" : "Back To Poster";
    setIsVideo((prev) => !prev);
  };

  if (!movie)
    return (
      <div className="fade-mv skeleton">
        <div className="movie-pos skeleton-box"></div>
        <div className="movie-info">
          <div className="skeleton-text title"></div>
          <div className="skeleton-text overview"></div>
          <div className="skeleton-text overview short"></div>
          <div className="skeleton-text meta"></div>
          <div className="skeleton-text meta"></div>
          <div className="skeleton-text meta"></div>
          <div className="skeleton-btn"></div>
        </div>
      </div>
    );

  return (
    <div
      className="movie-details"
      style={{
        background: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path}) center/cover no-repeat`,
        height: "100%",
      }}
    >
      <div className="fade-mv">
        {isVideo ? (
          <div
            style={{
              borderRadius: "8px",
              height: "600px",
              width: "800px",
              margin: "0 auto",
              aspectRatio: "16/9",
            }}
          >
            <ReactPlayer
              src={`https://www.youtube.com/watch?v=${mVideo}`}
              width="100%"
              height="100%"
              controls
              style={{ borderRadius: "8px" }}
            />
          </div>
        ) : (
          <img
            className="movie-pos"
            src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
            alt={movie.title}
          />
        )}

        <div className="movie-info">
          <h1>{movie.title}</h1>
          <p id="m-ovr">{movie.overview}</p>
          <br />
          <p><strong>Release Date:</strong> {movie.release_date}</p>
          <p><strong>Rating:</strong> {(movie.vote_average ?? 0).toFixed(1)}</p>
          <p><strong>Runtime:</strong> {movie.runtime} min</p>
          <p>
            <strong>Genres:</strong>{" "}
            {movie.genres?.map((g) => g.name).join(", ")}
          </p>
          <br />
          <button ref={buttonRef} onClick={handleButtonClick} className="button">
            Watch Trailer Now!
          </button>
        </div>
      </div>
    </div>
  );
}

export default Movie;
