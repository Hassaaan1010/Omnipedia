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
  const [following, setFollowing] = useState(false);
  const [response, setResponse] = useState({
    subjectName: "",
    topics: [],
    omniposts: [],
    owner: false,
  });
  const navigate = useNavigate();

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
          // omniposts: ,

          owner: res.data.owner,
        });
        setFollowing(res.data.following);
        console.log(
          res.data.subject.name,
          res.data.fetchedTopics,
          res.data.fetchedOmniposts,
          res.data.owner
        );
        console.log("foll? :", res.data.following);
      } catch (error) {
        if (error.status === 404) {
          navigate("/NotFound");
        }
        console.log("Error in get request.", error.res?.message || error);
      }
    };
    getPage(); // Invoke the function to fetch data
  }, [id, following]); // Add id as a dependency to run when the id changes

  async function handleFollow(e) {
    e.preventDefault();
    try {
      if (!tokenAuthorized) {
        navigate("/login");
      }
      const resp = await axios.post(
        `http://localhost:4000/subjects/changeFollowing/${localStorage.getItem(
          "userId"
        )}`,
        {
          following: following,
          subjectId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFollowing(!following);
      console.log("foll? :", resp.data.following);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Navbar authorized={tokenAuthorized} />
      <h2>
        {response.subjectName}
        <span>
          {tokenAuthorized && (
            <button
              style={{
                height: "30px",
                width: "80px",
                fontSize: "15px",
                textAlign: "center",
                lineHeight: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
              onClick={handleFollow}
            >
              {following ? "Unfollow" : "Follow"}
            </button>
          )}
        </span>
      </h2>

      <Topics
        topics={response.topics}
        owner={response.owner}
        subjectId={id}
        authorized={tokenAuthorized}
      />
      <Omniposts
        subjectId={id}
        omniposts={response.omniposts}
        authorized={tokenAuthorized}
      ></Omniposts>
    </>
  );
};

export default Subject;
