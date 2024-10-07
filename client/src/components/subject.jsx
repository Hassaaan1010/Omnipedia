import axios from "axios";
import { useEffect, useState } from "react";
import { tokenValid } from "../utils/tokenValidation";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "./navbar";
import { use } from "bcrypt/promises";
import { configs } from "eslint-plugin-react";

const Subject = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const [tokenAuthorized, setTokenAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      // sending request to get subject. also find out if the user is the creator of the subject
      const res = axios.get(`http://localhost:4000/subjects/:${id}`, {
        userId: localStorage.getItem("userId"),
      });
    } catch (error) {}
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
          localStorage.clear();
        }
      };

      checkAuthorization();
    } else {
      localStorage.clear();
    }

    useEffect(() => {});
  }, [navigate]);

  return (
    <>
      <Navbar />
    </>
  );
};

export default Subject;
