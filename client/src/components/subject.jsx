import axios from "axios";
import { useEffect, useState } from "react";
import { tokenValid } from "../utils/tokenValidation";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "./navbar";
import Omniposts from "./omniposts";
import Topics from "./topics";

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
        if (error.status === 404) {
          navigate("/NotFound");
        }
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

  return (
    <>
      <Navbar authorized={tokenAuthorized} />
      <h2>{response.subjectName}</h2>
      <Topics
        topics={response.topics}
        owner={response.owner}
        subjectId={id}
        authorized={tokenAuthorized}
      />
      <Omniposts
        omniposts={response.omniposts}
        authorized={tokenAuthorized}
      ></Omniposts>
    </>
  );
};

export default Subject;
