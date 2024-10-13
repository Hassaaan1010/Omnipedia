import axios from "axios";
import { tokenValid } from "../utils/tokenValidation";
import { useEffect, useState } from "react";
import Navbar from "./navbar";
import Posts from "./posts";
import { useNavigate, useParams } from "react-router-dom";

const ViewFolder = () => {
  const { folderId } = useParams();
  const token = localStorage.getItem("token");
  const [tokenAuthorized, setTokenAuthorized] = useState(false);
  const navigate = useNavigate();
  const [response, setResponse] = useState({
    message: "",
    posts: [],
  });

  useEffect(() => {
    try {
      const getSavedPosts = async () => {
        const resp = await axios.get(
          `http://localhost:4000/folders/${folderId}`
        );
        console.log("response", resp.data);
        setResponse({
          message: resp.data.message,
          posts: resp.data.fetchedPosts,
        });
      };

      getSavedPosts();
    } catch (error) {
      console.log("ERROR", error);
      if (error.status === 404) {
        navigate("/notFound");
      }
    }
  }, [folderId]);

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
      <Navbar authorized={tokenAuthorized}></Navbar>
      <h1>View Folder</h1>
      <Posts posts={response.posts}></Posts>
    </>
  );
};

export default ViewFolder;
