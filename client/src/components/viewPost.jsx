import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { tokenValid } from "../utils/tokenValidation";
import Navbar from "./navbar";
import VoteForm from "./voteForm";
import BookmarkButton from "./bookmarkButton";
import axios from "axios";

const ViewPost = () => {
  const { id: postId } = useParams();
  const token = localStorage.getItem("token");
  const requesterId = localStorage.getItem("userId");
  const [tokenAuthorized, setTokenAuthorized] = useState(false);
  const navigate = useNavigate();
  //   const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [post, setPost] = useState({
    title: "",
    topicId: "",
    userId: "",
    textContent: "",
    grade: "",
    links: [],
    likes: [],
    dislikes: [],
  });

  useEffect(() => {
    try {
      const getPost = async () => {
        const response = await axios.get(
          `http://localhost:4000/posts/${postId}`,
          {
            headers: {
              userId: localStorage.getItem("userId"),
            },
          }
        );
        const responsePost = response.data.post;
        // if (tokenAuthorized && requesterId in post.likes) {
        //   // person liked post
        //   setLiked(true);
        // } else if (tokenAuthorized && requesterId in post.dislikes) {
        //   // person disliked post
        //   setLiked(false);
        // } else {
        // }

        setBookmarked(response.data.bookmarked);
        setPost({
          title: responsePost.title,
          topicId: responsePost.topicId,
          userId: responsePost.userId,
          textContent: responsePost.textContent,
          grade: responsePost.grade,
          links: responsePost.linkUrls,
          likes: responsePost.likes,
          dislikes: responsePost.dislikes,
        });
      };
      getPost();
      console.log(post.links);
    } catch (error) {
      if (error.res?.status == 404) {
        navigate("/notFound");
      } else {
        console.log("Error : ", error.res?.data?.message);
      }
    }
  }, [postId]);

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
        <h2>Post : {post.title}</h2>
        <span>
          <Link to={`http://localhost:5173/profile/${post.userId}`}>
            Author
          </Link>
        </span>
        <br />
        <span>Grade : {post.grade}</span>
        <p>Content: {post.textContent}</p>
        <div className="Links">
          {post.links.map((link, i) => {
            return (
              <li key={i}>
                <h4>
                  <Link to={link}>{link}</Link>
                </h4>
              </li>
            );
          })}
        </div>
        {tokenAuthorized ? (
          <>
            <VoteForm
              authorized={tokenAuthorized}
              userId={requesterId}
              postId={postId}
              likes={post.likes}
              dislikes={post.dislikes}
            ></VoteForm>
            <BookmarkButton bookmarked={bookmarked}></BookmarkButton>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default ViewPost;
