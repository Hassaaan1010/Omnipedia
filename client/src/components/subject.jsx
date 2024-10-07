import axios from "axios";
import { useEffect, useState } from "react";
import { tokenValid } from "../utils/tokenValidation";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "./navbar";

const Subject = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const [tokenAuthorized, setTokenAuthorized] = useState(false);
  const [response, setResponse] = useState({
    subjectName: "",
    topics: [],
    omniposts: [],
    owner: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const getPage = async () => {
      try {
        // sending request to get subject. also find out if the user is the creator of the subject
        const res = await axios.get(`http://localhost:4000/subjects/${id}`, {
          headers: {
            userId: localStorage.getItem("userId"),
          },
        });

        console.log("received res: ", res);

        // find out names of all topics
        setResponse({
          subjectName: res.data.subject.name,
          topics: res.data.fetchedTopics,
          omniposts: res.data.fetchedOmniposts,
          omniposts: [
            {
              _id: "67043da259b81b2392d5fdd5",
              title: "Khanacademy",
            },
            {
              _id: "67043da259b81b2392d5fdd6",
              title: "Apni Kaksha",
            },
          ],

          owner: res.data.owner,
        });
        console.log(
          res.data.subject.name,
          res.data.fetchedTopics,
          res.data.fetchedOmniposts,
          res.data.owner
        );
      } catch (error) {
        console.log("Error in get request.", error);
      }
    };
    getPage(); // Invoke the function to fetch data
  }, [id]); // Add id as a dependency to run when the id changes

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
          localStorage.clear();
        }
      };

      checkAuthorization();
    } else {
      localStorage.clear();
    }
  }, [token]); // Add token as a dependency

  return (
    <>
      <Navbar tokenAuthorized={true} />
      <h1>{response.subjectName}</h1>
      <div>
        <h2>Topics</h2>
        <ul>
          {response.topics.map(
            (
              topicObject // Use map instead of forEach
            ) => (
              <li key={topicObject._id}>
                {" "}
                {/* Provide a unique key */}
                <Link to={`http://localhost:5173/topic/${topicObject._id}`}>
                  {topicObject.name}
                </Link>
              </li>
            )
          )}
        </ul>
        {response.owner && (
          <button>
            <Link to={`http://localhost:5173/topics/add/${id}/`}>
              Add Topics
            </Link>
          </button>
        )}{" "}
      </div>
      <div>
        <h2>Omniposts</h2>
        <ul>
          {response.omniposts.map(
            (
              omnipostObject // Use map instead of forEach
            ) => (
              <li key={omnipostObject._id}>
                {" "}
                {/* Provide a unique key */}
                <Link
                  to={`http://localhost:5173/omniposts/${omnipostObject._id}`}
                >
                  {omnipostObject.title}
                </Link>
              </li>
            )
          )}
        </ul>
        <button>
          <Link to={`http://localhost:5173/omniposts/create/`}>
            Create Omnipost
          </Link>
        </button>
      </div>
      {/* Conditional rendering */}
    </>
  );
};

export default Subject;
