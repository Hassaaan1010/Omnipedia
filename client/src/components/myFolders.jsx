import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "./navbar.jsx";
import { tokenValid } from "../utils/tokenValidation.js";
import axios from "axios";

const MyFolders = () => {
  const { userId: profileId } = useParams();
  const token = localStorage.getItem("token");
  const [tokenAuthorized, setTokenAuthorized] = useState(false);
  const [owner, setOwner] = useState(false);
  const [response, setResponse] = useState({
    folders: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    // get all folders of user by userId
    if (profileId === localStorage.getItem("userId") && tokenAuthorized) {
      setOwner(true);
    }
    try {
      const getFolders = async () => {
        const res = axios.get(`http://localhost:4000/folders/all/${profileId}`);
        console.log("res.data:", res.data);
        setResponse({ folders: res.data.folders });
      };
      getFolders();
    } catch (error) {
      console.log(error);
      if (error.response?.status === 404) {
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
      <h2>My folders</h2>
    </>
  );
};

export default MyFolders;
