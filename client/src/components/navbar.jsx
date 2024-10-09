import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ authorized }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showPopup, setShowPopup] = useState(false); // Control for popup visibility
  const navigate = useNavigate();
  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleLogoutClick = () => {
    // Trigger the popup to confirm
    setShowPopup(true);
  };

  const confirmLogout = async () => {
    try {
      // Clear localStorage and navigate to "/home"
      localStorage.clear();
      setShowPopup(false);
      navigate("/login");
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  const cancelLogout = () => {
    // Close the popup if logout is canceled
    setShowPopup(false);
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
            {authorized ? (
              <>
                <li>
                  <Link
                    className="nav-link px-2 text-secondary"
                    to="/subjects/create"
                  >
                    Create a Subject
                  </Link>
                </li>
                {/* <li>
                  <Link
                    className="nav-link px-2 text-secondary"
                    to={`/subjects/getFollowing/${localStorage.getItem(
                      "userId"
                    )}`}
                  >
                    Subjects
                  </Link>
                </li> */}
              </>
            ) : null}
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
              style={{ height: "30px" }}
              onChange={handleChange}
            />
            {"  "}
            <button
              type="submit"
              style={{ height: "40px" }}
              onClick={handleSearch}
            >
              Search
            </button>
          </form>

          {authorized ? (
            <>
              <button
                type="button"
                onClick={handleLogoutClick}
                className="btn btn-outline-light me-2"
              >
                Logout
              </button>
              {showPopup && (
                <div className="popup-overlay">
                  <div className="popup">
                    <h3>Are you sure you want to logout?</h3>
                    <button onClick={confirmLogout}>Confirm</button>
                    <button onClick={cancelLogout}>Cancel</button>
                  </div>
                </div>
              )}
              <h3>
                <button>
                  <Link
                    to={`http://localhost:5173/profile/${localStorage.getItem(
                      "userId"
                    )}`}
                  >
                    Profile
                  </Link>
                </button>
              </h3>
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
