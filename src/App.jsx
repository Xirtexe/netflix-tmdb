import React from "react";
import Banner from "./components/Banner";
import Navbar from "./components/Navbar";
import RowPosters from "./components/RowPosters";
import { createBrowserRouter, RouterProvider } from "react-router";
import Movie from "./components/Movie";
import PosterShowCase from "./components/PosterShowCase";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Navbar />
          <Banner />
          <RowPosters />
        </>
      ),
    },
    {
      path: "/movie/:id",
      element: <Movie />,
    },
    {
      path: "/discover/:q",
      element: <PosterShowCase />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
