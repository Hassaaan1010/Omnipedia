import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { tokenValid } from "../utils/tokenValidation";
import Navbar from "./navbar";
import VoteForm from "./voteForm";
import BookmarkButton from "./bookmarkButton";
import axios from "axios";

const ViewPost = () => {
  const { id: postId } = useParams();
  const token = localStorage.getItem("token");
  const [tokenAuthorized, setTokenAuthorized] = useState(false);
  const navigate = useNavigate();

  const [post, _] = useState({
    title: "",
    userId: "",
    textContent: "",
    grade: "",
    likes: [],
    dislikes: [],
  });

  useEffect(() => {
    try {
      const getPost = async (params) => {
        const response = await axios.get(
          `http://localhost:4000/posts/${postId}`
        );
        const post = response.data;
      };
      getPost();
    } catch (error) {
      if (error.res?.status == 404) {
        navigate("/notFound");
      } else {
        console.log("Error : ", error.res?.data?.message);
      }
    }
  });

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

      <div>
        <h2>Post : {}</h2>
        <span>Author</span>
        <br />
        <span>Grade</span>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. A, earum
          amet. Molestiae possimus placeat nihil nesciunt deserunt. Repellat
          quae, eius recusandae odio nobis assumenda ipsam, et explicabo beatae
          non corporis.
        </p>
        <VoteForm></VoteForm>
        <BookmarkButton></BookmarkButton>
      </div>
    </>
  );
};

export default ViewPost;
