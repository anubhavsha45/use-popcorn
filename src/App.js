import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
const KEY = "cee88759";
export default function App() {
  const [movies, setmovies] = useState([]);
  const [watchedmovies, setwatchedmovies] = useState(function () {
    const storeValue = localStorage.getItem("watched");
    return storeValue ? JSON.parse(storeValue) : [];
  });
  const [isloading, setisloading] = useState(false);
  const [error, seterror] = useState("");
  const [moviename, setmoviename] = useState("");
  const [selectedid, setselectedid] = useState(null);
  function onAddBtn(movie) {
    setwatchedmovies((watched) => [...watched, movie]);
  }
  function handleDeletion(id) {
    setwatchedmovies((movies) => movies.filter((m) => m.imdbID !== id));
  }
  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watchedmovies));
    },
    [watchedmovies],
  );

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovie() {
        try {
          setisloading(true);
          seterror("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${moviename}`,
            { signal: controller.signal },
          );
          if (!res.ok) throw new Error("Sorry cant fetch the movies right now");
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");
          setmovies(data.Search);
        } catch (err) {
          if (err.message !== "AbortError") {
            seterror(err.message);
          }
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
      return function () {
        controller.abort();
      };
    },
    [moviename],
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
        <WatchedBox
          watchedmovies={watchedmovies}
          selectedid={selectedid}
          setselectedid={setselectedid}
          onAddBtn={onAddBtn}
          handleDeletion={handleDeletion}
        />
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
  const inputEl = useRef(null);
  useEffect(
    function () {
      inputEl.current.focus();
      function callback(e) {
        if (document.activeElement === inputEl.current) return;
        if (e.code === "Enter") {
          inputEl.current.focus();
          setmoviename("");
        }
      }
      document.addEventListener("keydown", callback);
      return () => document.addEventListener("keydown", callback);
    },
    [setmoviename],
  );
  return (
    <input
      className="search"
      type="text"
      placeholder="Search Movies..."
      value={moviename}
      onChange={(e) => setmoviename(e.target.value)}
      ref={inputEl}
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
function WatchedBox({
  watchedmovies,
  selectedid,
  setselectedid,
  onAddBtn,
  handleDeletion,
}) {
  function onclickBack() {
    setselectedid(null);
  }
  const [clickedwatched, setclickedwatched] = useState(true);
  const imdbRatingWatched = watchedmovies.reduce(
    (acc, curr, i, arr) => acc + curr.imdbRating / arr.length,
    0,
  );
  const userRatingWatched = watchedmovies.reduce(
    (acc, curr, i, arr) => acc + curr.userRating / arr.length,
    0,
  );
  const totalTimeWatched = watchedmovies.reduce(
    (acc, curr) => acc + curr.runtime,
    0,
  );

  function toggleWatched() {
    setclickedwatched((m) => !m);
  }
  return (
    <div className="box">
      {selectedid ? (
        <MovieDetails
          selectedid={selectedid}
          onclickBack={onclickBack}
          onAddBtn={onAddBtn}
          watchedmovies={watchedmovies}
        />
      ) : clickedwatched ? (
        <>
          <div className="summary">
            <h2>MOVIES YOU WATCHED</h2>
            <div>
              <p>🔄️ {watchedmovies.length} movies</p>
              <p>⭐ {imdbRatingWatched.toFixed(2)}</p>
              <p>🌟 {userRatingWatched.toFixed(2)}</p>
              <p>⏳ {totalTimeWatched} min</p>
            </div>
          </div>

          <button className="btn-toggle" onClick={toggleWatched}>
            -
          </button>
          <WatchedList
            watchedmovies={watchedmovies}
            handleDeletion={handleDeletion}
          />
        </>
      ) : (
        <button className="btn-toggle" onClick={toggleWatched}>
          +
        </button>
      )}
    </div>
  );
}
function MovieDetails({
  selectedid,
  back,
  onclickBack,
  onAddBtn,
  watchedmovies,
}) {
  const [movie, setmovie] = useState({});
  const [userRating, setuserRating] = useState("");
  const countRef = useRef(0);
  useEffect(
    function () {
      if (userRating) countRef.current++;
    },
    [userRating],
  );
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;
  const isWatched = watchedmovies.map((m) => m.imdbID).includes(selectedid);
  const rateWatched = watchedmovies.find((m) => m.imdbID === selectedid);
  useEffect(
    function () {
      async function getMovieDetails() {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedid}`,
        );
        const data = await res.json();
        setmovie(data);
      }
      getMovieDetails();
    },
    [selectedid],
  );
  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;
      return function () {
        document.title = "usePopcorn";
      };
    },
    [title],
  );
  useEffect(
    function () {
      function callBack(e) {
        if (e.code === "Escape") {
          onclickBack();
        }
      }
      document.addEventListener("keydown", callBack);
      return function () {
        document.removeEventListener("keydown", callBack);
      };
    },
    [onclickBack],
  );
  function handleAdd() {
    const newMovie = {
      imdbID: selectedid,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ")[0]),
      userRating,
      countdecisions: countRef.current,
    };
    if (isWatched) return;
    onAddBtn(newMovie);
    onclickBack();
  }
  return (
    <div className="details">
      <header>
        <button className="btn-back" onClick={onclickBack}>
          &larr;
        </button>
        <img src={poster} alt={`Poster of the movie ${title}`} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {year} &bull; {runtime}
          </p>
          <p>{released}</p>
          <p>{genre}</p>
          <p>⭐ {imdbRating}</p>
        </div>
      </header>
      <section>
        <div className="rating">
          {" "}
          {isWatched ? (
            <p>
              You rated this movie : {rateWatched.userRating} <span>⭐</span>
            </p>
          ) : (
            <div className="rating">
              <StarRating
                maxRating={10}
                size={24}
                onSetRating={setuserRating}
              />
              {userRating > 0 && (
                <button className="btn-add" onClick={handleAdd}>
                  + Add to list
                </button>
              )}
            </div>
          )}
        </div>

        <p>
          <em>{plot}</em>
        </p>
        <p>Starring {actors}</p>
        <p>Directed by {director}</p>
      </section>
    </div>
  );
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
function WatchedList({ watchedmovies, handleDeletion }) {
  return (
    <ul className="list">
      {watchedmovies.map((watched) => (
        <WatchedMovie watched={watched} handleDeletion={handleDeletion} />
      ))}
    </ul>
  );
}
function WatchedMovie({ watched, handleDeletion }) {
  return (
    <li>
      <img src={watched.poster} alt={`${watched.title} poster`} />
      <h3>{watched.title}</h3>
      <div>
        <p>⭐ {watched.imdbRating}</p>
        <p>🌟 {watched.userRating}</p>
        <p>⏳ {watched.runtime} min</p>
      </div>
      <button
        className="btn-delete"
        onClick={() => handleDeletion(watched.imdbID)}
      >
        ❌
      </button>
    </li>
  );
}
