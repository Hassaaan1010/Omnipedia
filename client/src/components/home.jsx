// import { useState, useEffect } from "react";
// import { defineConfig } from "vite";

import axios from "axios";
import { useEffect, useState } from "react";
import { tokenValid } from "../utils/tokenValidation";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./navbar";
import Subjects from "./subjects";

const Home = () => {
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [tokenAuthorized, setTokenAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && tokenValid(token)) {
      const checkAuthorization = async () => {
        try {
          const res = await axios.get("http://localhost:4000/home/", {
            headers: {
              Authorization: `Bearer ${token}`, // Correct Authorization header
            },
          });

          if (res.data.authorized) {
            console.log("auth :", res.data.authorized);
            setTokenAuthorized(true);
          }
        } catch (error) {
          console.error("Error during authorization check:", error);
          localStorage.clear();
        }
      };

      checkAuthorization();
    } else {
      localStorage.clear();
    }
  }, [navigate]);

  return (
    <>
      <Navbar search={search} authorized={tokenAuthorized} />
      <li>
        <Link
          to={`http://localhost:5173/subject/${"67043da159b81b2392d5fdd1"}`}
        >
          Mathematics
        </Link>
      </li>
      {tokenAuthorized ? (
        <Subjects userId={localStorage.getItem("userId")}></Subjects>
      ) : (
        <></>
      )}
    </>
  );
};

// const Home = () => {
//   const [search, setSearch] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [tokenAuthorized, setTokenAuthorized] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setSearch(e.target.value);
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (token && tokenValid(token)) {
//       const checkAuthorization = async () => {
//         try {
//           const res = await axios.get("http://localhost:4000/home/", {
//             headers: {
//               Authorization: `Bearer ${token}`, // Correct Authorization header
//             },
//           });

//           if (res.data.authorized) {
//             console.log("auth :", res.data.authorized);
//             // navigate("/login"); // Redirect to login if not authorized
//             setTokenAuthorized(true);
//           }
//         } catch (error) {
//           console.error("Error during authorization check:", error);
//           navigate("/login"); // Redirect to login on any error
//         }
//       };

//       checkAuthorization();
//     } else {
//       // navigate("/login"); // Redirect to login if the token is invalid
//       localStorage.clear();
//       // continue on page
//     }
//   }, [navigate]); // Add navigate as a dependency

//   return (
//     <>
//       <nav className="p-3 text-bg-dark">
//         <div className="container">
//           <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
//             <a
//               href="/"
//               className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"
//             >
//               <h1>Omnipedia</h1>
//             </a>
//             <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
//               <li>
//                 <a href="/home/" className="nav-link px-2 text-secondary">
//                   Home
//                 </a>
//               </li>
//               <li>
//                 <a href="/subjects/" className="nav-link px-2 text-secondary">
//                   Subjects
//                 </a>
//               </li>

//               <li>
//                 <a href="#" className="nav-link px-2 text-white">
//                   About
//                 </a>
//               </li>
//             </ul>

//             <form
//               className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3"
//               role="search"
//             >
//               <input
//                 type="search"
//                 className="form-control form-control-dark text-bg-dark"
//                 placeholder="Search a subject or topic..."
//                 aria-label="Search"
//                 value={search}
//                 onChange={handleChange}
//               />
//             </form>
//             {tokenAuthorized ? (
//               <>
//                 <h4>Logout</h4>
//                 <h3>Profile</h3>
//               </> // Render Profile component if token exists
//             ) : (
//               <div className="text-end" name="Profile/LoginAndSignup">
//                 <button type="button" className="btn btn-outline-light me-2">
//                   <Link to="/login">Login</Link>
//                 </button>
//                 <button type="button" className="btn btn-warning">
//                   <Link to="/register">Register</Link>
//                 </button>
//               </div> // Show login/signup message if no token is found
//             )}
//           </div>
//         </div>
//       </nav>
//       <ul>
//         <li>followed subject 1</li>
//         <li>followed subject 2</li>
//         <li>followed subject 3</li>
//         <li>followed subject 4</li>
//         <li>followed subject 5</li>
//       </ul>
//     </>
//   );
// };

export default Home;
