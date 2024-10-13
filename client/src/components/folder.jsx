import axios from "axios";
import { tokenValid } from "../utils/tokenValidation";
import { useEffect, useState } from "react";
import Navbar from "./navbar";
import { useNavigate, useParams } from "react-router-dom";

const ViewFolder = () => {
  const { folderId } = useParams();
  const token = localStorage.getItem("token");
  const [tokenAuthorized, setTokenAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const getSavedPosts = async () => {
        const resp = await axios.get(
          `http://localhost:4000/folders/${folderId}`
        );
        console.log("response", resp.data);
      };
      getSavedPosts();
    } catch (error) {
      console.log("ERROR", error);
      if (error.status === 404) {
        navigate("/notFound");
      }
    }
  });

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
    </>
  );
};

export default ViewFolder;
