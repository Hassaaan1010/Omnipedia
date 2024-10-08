import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { tokenValid } from "../utils/tokenValidation";
import axios from "axios";
import Navbar from "./navbar";
import PostForm from "./postForm";

const CreatePost = () => {
  const token = localStorage.getItem("token");
  const [tokenAuthorized, setTokenAuthorized] = useState(false);

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

  return (
    <>
      <Navbar authorized={tokenAuthorized}></Navbar>
      <h2>Create posts page</h2>
      <PostForm />
    </>
  );
};

export default CreatePost;
