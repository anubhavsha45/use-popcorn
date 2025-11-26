import { use, useEffect, useState } from "react";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const KEY = "cee88759";
export default function App() {
  const [movies, setmovies] = useState([]);
  const [watchedmovies, setwatchedmovies] = useState([]);
  const [isloading, setisloading] = useState(false);
  const [error, seterror] = useState("");
  const [moviename, setmoviename] = useState("");
  const [selectedid, setselectedid] = useState(null);
  useEffect(
    function () {
      async function fetchMovie() {
        try {
          setisloading(true);
          seterror("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${moviename}`
          );
          if (!res.ok) throw new Error("Sorry cant fetch the movies right now");
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");
          setmovies(data.Search);
        } catch (err) {
          seterror(err.message);
        } finally {
          setisloading(false);
        }
      }
      if (moviename.length < 3) {
        setmovies([]);
        seterror("");
        return;
      }
      fetchMovie();
    },
    [moviename]
  );
  return (
    <>
      <div className="nav-bar">
        <Navbar>
          <Logo />
          <SearchMovies moviename={moviename} setmoviename={setmoviename} />
          <FoundResults movies={movies} />
        </Navbar>
      </div>
      <Main>
        <MoviesBox
          movies={movies}
          isloading={isloading}
          error={error}
          selectedid={selectedid}
          setselectedid={setselectedid}
        />
        <WatchedBox watchedmovies={watchedmovies} selectedid={selectedid} />
      </Main>
    </>
  );
}
function Navbar({ children }) {
  return <>{children}</>;
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function SearchMovies({ moviename, setmoviename }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search Movies..."
      value={moviename}
      onChange={(e) => setmoviename(e.target.value)}
    />
  );
}
function FoundResults({ movies }) {
  return <h1 className="num-results">Found {movies.length} results</h1>;
}
function Main({ children }) {
  return <div className="main">{children}</div>;
}
function MoviesBox({ movies, isloading, error, selectedid, setselectedid }) {
  const [clickedMovies, setclickedmovies] = useState(true);
  function toggleMovies() {
    setclickedmovies((m) => !m);
  }
  return (
    <div className="box">
      {clickedMovies ? (
        <>
          <button className="btn-toggle" onClick={toggleMovies}>
            -
          </button>
          {!isloading && !error && (
            <MoviesList
              movies={movies}
              selectedid={selectedid}
              setselectedid={setselectedid}
            />
          )}
          {isloading && <Loader />}
          {error && <Error error={error} />}
        </>
      ) : (
        <button className="btn-toggle" onClick={toggleMovies}>
          +
        </button>
      )}
    </div>
  );
}
function Error({ error }) {
  return <p className="error">{error}</p>;
}
function Loader() {
  return <div className="loader">loading....</div>;
}
function WatchedBox({ watchedmovies, selectedid }) {
  const [clickedwatched, setclickedwatched] = useState(true);
  const imdbRatingWatched = watchedmovies.reduce(
    (acc, curr, i, arr) => acc + curr.imdbRating / arr.length,
    0
  );
  const userRatingWatched = watchedmovies.reduce(
    (acc, curr, i, arr) => acc + curr.userRating / arr.length,
    0
  );
  const totalTimeWatched = watchedmovies.reduce(
    (acc, curr) => acc + curr.runtime,
    0
  );

  function toggleWatched() {
    setclickedwatched((m) => !m);
  }
  return (
    <div className="box">
      {selectedid ? (
        <MovieDetails selectedid={selectedid} />
      ) : clickedwatched ? (
        <>
          <div className="summary">
            <h2>MOVIES YOU WATCHED</h2>
            <div>
              <p>🔄️ {watchedmovies.length} movies</p>
              <p>⭐ {imdbRatingWatched}</p>
              <p>🌟 {userRatingWatched}</p>
              <p>⏳ {totalTimeWatched} min</p>
            </div>
          </div>

          <button className="btn-toggle" onClick={toggleWatched}>
            -
          </button>
          <WatchedList watchedmovies={watchedmovies} />
        </>
      ) : (
        <button className="btn-toggle" onClick={toggleWatched}>
          +
        </button>
      )}
    </div>
  );
}
function MovieDetails({ selectedid }) {
  return <div className="details">{selectedid}</div>;
}
function MoviesList({ movies, selectedid, setselectedid }) {
  return (
    <ul className="list list-movies">
      {movies.map((movie) => (
        <Movie
          movie={movie}
          selectedid={selectedid}
          setselectedid={setselectedid}
        />
      ))}
    </ul>
  );
}
function Movie({ movie, selectedid, setselectedid }) {
  function handleSelection(id) {
    setselectedid(id);
  }
  return (
    <li onClick={() => handleSelection(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>📅 {movie.Year}</p>
      </div>
    </li>
  );
}
function WatchedList({ watchedmovies }) {
  return (
    <ul className="list">
      {watchedmovies.map((watched) => (
        <WatchedMovie watched={watched} />
      ))}
    </ul>
  );
}
function WatchedMovie({ watched }) {
  return (
    <li>
      <img src={watched.Poster} alt={`${watched.Title} poster`} />
      <h3>{watched.Title}</h3>
      <div>
        <p>⭐ {watched.imdbRating}</p>
        <p>🌟 {watched.userRating}</p>
        <p>⏳ {watched.runtime} min</p>
      </div>
    </li>
  );
}
