import { useNavigate } from "react-router";
import axios from "../axios";
import React, { useState } from "react";

function Navbar() {
  const [svalue, setSvalue] = useState("");
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    setSvalue(e.target.value);
  };

  const handleOnClick = async () => {
    if (svalue.trim() !== "") {
      const val = svalue;
      setSvalue("Please Wait...");

      try {
        const response = await axios.get(
          `/search/movie?query=${encodeURIComponent(
            val
          )}&include_adult=false&language=en-US&page=1`
        );

        if (response.data.results && response.data.results.length === 1) {
          navigate(`/movie/${response.data.results[0].id}`);
        } else if (response.data.results.length > 1) {
          navigate(`/discover/${encodeURIComponent(
            val
          )}`);
        } else {
          navigate(`/discover/${encodeURIComponent(
            val
          )}`);
        }
      } catch (error) {
        console.error("Error searching movie:", error);
      } finally {
        setSvalue("");
      }
    }
  };

  return (
    <div className="navbar">
      <img
        id="logo"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1920px-Netflix_2015_logo.svg.png"
        alt="logo"
      />

      <div className="av-sr">
        <input
          value={svalue}
          onChange={handleOnChange}
          type="text"
          placeholder='Search "Avengers"... '
        />
        <i onClick={handleOnClick} className="fa-solid fa-magnifying-glass"></i>
        <img
          id="avatar"
          src="https://i.pinimg.com/originals/0d/dc/ca/0ddccae723d85a703b798a5e682c23c1.png"
          alt=""
        />
      </div>
    </div>
  );
}

export default Navbar;
