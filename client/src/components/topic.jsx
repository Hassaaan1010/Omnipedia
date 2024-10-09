import axios from "axios";
import { useEffect, useState } from "react";
import { tokenValid } from "../utils/tokenValidation";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "./navbar";
import Posts from "./posts";

const Topic = () => {
  const token = localStorage.getItem("token");
  const [tokenAuthorized, setTokenAuthorized] = useState(false);
  const { subjectId, topicId } = useParams();
  const [response, setResponse] = useState({
    subjectId: "",
    topicName: "",
    posts: [],
    llm_content: null,
  });

  const navigate = useNavigate();

  // Fetch topic data
  useEffect(() => {
    const getPage = async () => {
      console.log("Reached topic page");
      try {
        const res = await axios.get(
          `http://localhost:4000/topics/${subjectId}/${topicId}`
        );
        console.log("DATA REC : ", res.data);
        setResponse({
          subjectId: res.data.topic.subjectId,
          topicName: res.data.topic.name,
          posts: res.data.posts, // Use posts from the response
          llm_content: res.data.llm_content || null, // Assuming llm_content might be part of data
        });
        console.log("response : ", response);
      } catch (error) {
        console.error("Error in get request:", error);
        if (error.response && error.response.status === 404) {
          navigate("/NotFound");
        } else {
          console.log("Other error:", error);
        }
      }
    };
    getPage(); // Invoke the function to fetch data
  }, [subjectId, topicId]); // Add both subjectId and topicId as dependencies

  // Authorization check
  useEffect(() => {
    const checkAuthorization = async () => {
      if (token && tokenValid(token)) {
        try {
          const res = await axios.get("http://localhost:4000/home/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.data.authorized) {
            setTokenAuthorized(true); // Set true if authorized
          } else {
            setTokenAuthorized(false); // Not authorized
            localStorage.clear(); // Clear local storage if not authorized
          }
        } catch (error) {
          console.error("Error during authorization check:", error);
          setTokenAuthorized(false);
          localStorage.clear();
        }
      } else {
        setTokenAuthorized(false); // Token is invalid or not present
        localStorage.clear();
      }
    };

    checkAuthorization();
  }, [token]); // Only depend on token

  console.log("Posts:", response.posts); // Log posts for debugging

  return (
    <>
      <Navbar authorized={tokenAuthorized} />{" "}
      {/* Pass authorized state to Navbar */}
      <button>
        <Link to={`/subject/${subjectId}`}>Back</Link> {/* Use relative path */}
      </button>
      <h3>{response.topicName.toUpperCase()}</h3>
      <Posts posts={response.posts} />
      <button>
        <Link to={`http://localhost:5173/posts/create/${topicId}`}>
          Create Post
        </Link>
      </button>
    </>
  );
};

export default Topic;
