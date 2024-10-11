import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { tokenValid } from "../utils/tokenValidation";

const SearchResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [tokenAuthorized, setTokenAuthorized] = useState(false);
  const [searchQuery, setSearchQuery] = useState(
    new URLSearchParams(location.search).get("q") || ""
  );
  const [response, setResponse] = useState({
    subjectResults: [],
    topicResults: [],
  });
  const [errorMessage, setErrorMessage] = useState("");

  const stopWords = [
    "a",
    "an",
    "the",
    "in",
    "on",
    "at",
    "and",
    "or",
    "is",
    "was",
    "to",
    "for",
    "no",
    "not",
    "with",
    "by",
    "of",
    "between",
  ];

  useEffect(() => {
    // authorization
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
          setTokenAuthorized(false);
          localStorage.clear();
        }
      };

      checkAuthorization();
    } else {
      setTokenAuthorized(false);
      localStorage.clear();
    }
  }, [token]); // Add token as a dependency

  useEffect(() => {
    setErrorMessage("");

    const fetchResults = async () => {
      const query = new URLSearchParams(location.search).get("q");
      if (!query) {
        console.log("query not found", query);
        return;
      }
      try {
        let filteredQuery = query
          .split(" ")
          .filter((word) => !stopWords.includes(word.toLowerCase()))
          .join(" ");

        const res = await axios.get("http://localhost:4000/search", {
          params: { query: filteredQuery },
        });

        setResponse({
          subjectResults: res.data.fetchedSubjects,
          topicResults: res.data.fetchedTopics,
        });
        setErrorMessage("");
      } catch (error) {
        console.error("Error fetching search results:", error);
        setErrorMessage("Could not fetch search results.");
        if (error.response?.data?.message) {
          setErrorMessage(error.response?.data?.message);
        }
      }
    };

    fetchResults();
  }, [location.search]);

  const handleSearch = async (event) => {
    setErrorMessage("");
    event.preventDefault();
    const query = searchQuery.trim();

    if (query) {
      try {
        let filteredQuery = query
          .split(" ")
          .filter((word) => !stopWords.includes(word.toLowerCase()))
          .join(" ");

        const res = await axios.get("http://localhost:4000/search", {
          params: { query: filteredQuery },
        });

        setResponse({
          subjectResults: res.data.fetchedSubjects,
          topicResults: res.data.fetchedTopics,
        });

        setErrorMessage("");
        navigate(`/search?q=${encodeURIComponent(query)}`); // Update URL with the query
      } catch (error) {
        console.error("Error fetching search results:", error);
        setErrorMessage("Could not fetch search results.");
      }
    }
  };

  return (
    <>
      <a
        href="/"
        className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"
      >
        <h1>Omnipedia</h1>
      </a>
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="search"
          className="form-control"
          placeholder="Search a subject or topic..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <h2>Search results for "{searchQuery}"</h2>
      {errorMessage && <p>{errorMessage}</p>}
      <div>
        <h2>Subjects</h2>
        {response.subjectResults.length ? (
          response.subjectResults.map((subject, index) => (
            <p key={index}>
              <Link to={`http://localhost:5173/subject/${subject._id}`}>
                {subject.name}
              </Link>
            </p>
          ))
        ) : (
          <p>No subjects found</p>
        )}
      </div>
      <div>
        <h2>Topics</h2>
        {response.topicResults.length ? (
          response.topicResults.map((topic, idx) => (
            <p key={idx}>
              <Link
                to={`http://localhost:5173/topic/${topic.subjectId}/${topic._id}`}
              >
                {topic.name}
              </Link>
            </p>
          ))
        ) : (
          <p>No topics found</p>
        )}
      </div>

      {tokenAuthorized && (
        <button>
          <Link to="/subjects/create">Create a Subject</Link>
        </button>
      )}
    </>
  );
};

export default SearchResults;

// code of shame
// import axios from "axios";
// import Navbar from "./navbar";
// import { useEffect, useState } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";

// const SearchResults = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const token = localStorage.getItem("token");
//   const [tokenAuthorized, setTokenAuthorized] = useState(false);
//   const [searchQuery, setSearchQuery] = useState(
//     new URLSearchParams(location.search).get("q") || ""
//   );
//   const [response, setResponse] = useState({
//     subjectResults: [],
//     topicResults: [],
//   });
//   const [errorMessage, setErrorMessage] = useState("");

//   const stopWords = [
//     "a",
//     "an",
//     "the",
//     "in",
//     "on",
//     "at",
//     "and",
//     "or",
//     "is",
//     "was",
//     "to",
//     "for",
//     "no",
//     "not",
//     "with",
//     "by",
//     "of",
//     "between",
//   ];

//   // Fetch search results when query changes or page loads
//   useEffect(() => {
//     const fetchResults = async () => {
//       try {
//         let filteredQuery = searchQuery
//           .split(" ")
//           .filter((word) => !stopWords.includes(word.toLowerCase()))
//           .join(" ");

//         const res = await axios.get("http://localhost:4000/search", {
//           params: { query: filteredQuery },
//         });

//         setResponse({
//           subjectResults: res.data.fetchedSubjects,
//           topicResults: res.data.fetchedTopics,
//         });
//         setErrorMessage("");
//       } catch (error) {
//         console.error("Error fetching search results:", error);
//         setErrorMessage("Could not fetch search results.");
//       }
//     };

//     if (searchQuery) fetchResults();
//   }, [searchQuery]);

//   const handleSearchChange = (event) => {
//     setSearchQuery(event.target.value);
//   };

//   const handleSearch = (event) => {
//     event.preventDefault();
//     const query = searchQuery.trim();
//     if (query) {
//       navigate(`/search?q=${encodeURIComponent(query)}`);
//       setSearchQuery(query); // Trigger search with updated query
//     }
//   };

//   return (
//     <>
//       <a
//         href="/"
//         className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"
//       >
//         <h1>Omnipedia</h1>
//       </a>
//       <form className="search-form" onSubmit={handleSearch}>
//         <input
//           type="search"
//           className="form-control"
//           placeholder="Search a subject or topic..."
//           value={searchQuery}
//           onChange={handleSearchChange}
//         />
//         <button type="submit">Search</button>
//       </form>

//       <h2>Search results for "{searchQuery}"</h2>
//       {errorMessage && <p>{errorMessage}</p>}
//       <div>
//         <h2>Subjects</h2>
//         {response.subjectResults.length ? (
//           response.subjectResults.map((subject, index) => (
//             <p key={index}>
//               <Link to={`http://localhost:5173/subject/${subject._id}`}>
//                 {subject.name}
//               </Link>
//             </p>
//           ))
//         ) : (
//           <p>No subjects found</p>
//         )}
//       </div>
//       <div>
//         <h2>Topics</h2>
//         {response.topicResults.length ? (
//           response.topicResults.map((topic, idx) => (
//             <p key={idx}>
//               <Link
//                 to={`http://localhost:5173/topic/${topic.subjectId}/${topic._id}`}
//               >
//                 {topic.name}
//               </Link>
//             </p>
//           ))
//         ) : (
//           <p>No topics found</p>
//         )}
//       </div>

//       {tokenAuthorized && (
//         <button>
//           <Link to="/subjects/create">Create a Subject</Link>
//         </button>
//       )}
//     </>
//   );
// };

// export default SearchResults;
