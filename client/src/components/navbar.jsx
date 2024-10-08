import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ authorized }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = (event) => {};
  return (
    <nav className="p-3 text-bg-dark">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <a
            href="/"
            className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"
          >
            <h1>Omnipedia</h1>
          </a>
          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li>
              <Link className="nav-link px-2 text-secondary" to="/home">
                Home
              </Link>
            </li>
            <li>
              <Link className="nav-link px-2 text-secondary" to="/subjects/">
                Subjects
              </Link>
            </li>
          </ul>

          <form
            className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3"
            role="search"
          >
            <input
              type="search"
              className="form-control form-control-dark text-bg-dark"
              placeholder="Search a subject or topic..."
              aria-label="Search"
              value={searchQuery}
              onChange={handleChange}
            />
            <button type="submit" onClick={handleSearch}>
              Search
            </button>
          </form>

          {authorized ? (
            <>
              <h4>Logout</h4>
              <h3>{localStorage.getItem("username")}</h3>
            </>
          ) : (
            <div className="text-end" name="Profile/LoginAndSignup">
              <button type="button" className="btn btn-outline-light me-2">
                <Link to="/login">Login</Link>
              </button>
              <button type="button" className="btn btn-warning">
                <Link to="/register">Register</Link>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
