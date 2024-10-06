// import { useState, useEffect } from "react";
// import { defineConfig } from "vite";

import axios from "axios";
import { useEffect, useState } from "react";
import { tokenValid } from "../utils/tokenValidation";

const Home = () => {
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [tokenAuthorized, setTokenAuthorized] = useState(false);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (tokenValid(token)) {
      // cannot async/await useEffect. Create internal async function
      async function checkTokenAuthorization() {
        const res = await axios.get("http://localhost:4000/home/", {
          headers: {
            Authorization: `bearer ${token}`,
          },
        });
        setTokenAuthorized(res.data.authorized);
      }

      checkTokenAuthorization();
    } else {
      localStorage.clear();
      nav;
    }
  }, []);

  return (
    <>
      <header className="p-3 text-bg-dark">
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
                <a href="/home/" className="nav-link px-2 text-secondary">
                  Home
                </a>
              </li>
              <li>
                <a href="/subjects/" className="nav-link px-2 text-secondary">
                  Subjects
                </a>
              </li>

              <li>
                <a href="#" className="nav-link px-2 text-white">
                  About
                </a>
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
                value={search}
                onChange={handleChange}
              />
            </form>

            {tokenAuthorized ? (
              <>
                <h4>Logout</h4>
                <h3>Profile</h3>
              </> // Render Profile component if token exists
            ) : (
              <div className="text-end" name="Profile/LoginAndSignup">
                <button type="button" className="btn btn-outline-light me-2">
                  Login
                </button>
                <button type="button" className="btn btn-warning">
                  Sign-up
                </button>
              </div> // Show login/signup message if no token is found
            )}
          </div>
        </div>
      </header>
      <ul>
        <li>followed subject 1</li>
        <li>followed subject 2</li>
        <li>followed subject 3</li>
        <li>followed subject 4</li>
        <li>followed subject 5</li>
      </ul>
    </>
  );
};

export default Home;
