import Navbar from "./navbar";
import OmnipostForm from "./omnipostForm";
import { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { tokenValid } from "../utils/tokenValidation";
import axios from "axios";

const CreateOmnipost = () => {
  const { subjectId } = useParams();
  const token = localStorage.getItem("token");
  const requesterId = localStorage.getItem("userId");
  const [tokenAuthorized, setTokenAuthorized] = useState(false);
  const navigate = useNavigate();

  // authorization
  useEffect(() => {
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
          navigate("/login");
        }
      };

      checkAuthorization();
    } else {
      setTokenAuthorized(false);
      localStorage.clear();
      navigate("/login");
    }
  }, [token]); // Add token as a dependency

  return (
    <>
      <Navbar authorized={tokenAuthorized}></Navbar>
      <div>
        <button>
          <Link to={`http://localhost:5173/subject/${subjectId}`}>Back</Link>
        </button>
      </div>
      <OmnipostForm></OmnipostForm>
    </>
  );
};

export default CreateOmnipost;
