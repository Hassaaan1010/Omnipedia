import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "./navbar";
import { tokenValid } from "../utils/tokenValidation";
import { useState, useEffect } from "react";

const Subjects = () => {
  const token = localStorage.getItem("token");
  const [tokenAuthorized, setTokenAuthorized] = useState(false);
  const [response, setResponse] = useState({
    subjects: null,
  });

  useEffect(() => {
    try {
      const getSubjects = async () => {
        const res = await axios.get("http://localhost:4000/subjects/");
        console.log("resp : ", res.data);
        setResponse(res.data);
      };
      getSubjects();
    } catch (error) {
      console.log("Error fetching subjects.", error);
    }
  }, []);

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
  }, [token]); // Add token as a dependency // Add token as a dependency
  return (
    <>
      <Navbar authorized={tokenAuthorized}></Navbar>
      <h1>Subjects</h1>
      <button>
        <Link to="/subjects/create">Creat a Subject</Link>
      </button>
      <div className="container">
        <ul>
          {response.subjects &&
            response.subjects.map((subject) => {
              return (
                // Add return here

                <li key={subject._id}>
                  <div>
                    <Link to={`/subject/${subject._id}`}>{subject.name}</Link>
                  </div>
                </li>
              );
            })}
          <div>
            <li>Subject 2</li>
          </div>
          <div>
            <li>Subject 3</li>
          </div>
        </ul>
      </div>
    </>
  );
};

export default Subjects;
