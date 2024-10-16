import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { tokenValid } from "../utils/tokenValidation";
import Navbar from "./navbar";
import DeleteButton from "./deleteButton";
import VoteForm from "./voteForm";
import BookmarkButton from "./bookmarkButton";
import axios from "axios";

const ViewOmnipost = () => {
  const { id: omnipostId } = useParams();
  const token = localStorage.getItem("token");
  const requesterId = localStorage.getItem("userId");
  const [tokenAuthorized, setTokenAuthorized] = useState(false);
  const [admin, setAdmin] = useState(false);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [bookmarked, setBookmarked] = useState(false);
  const [omnipost, setOmnipost] = useState({
    title: "",
    subjectId: "",
    userId: "",
    textContent: "",
    grade: "",
    links: [],
    likes: [],
    dislikes: [],
  });

  useEffect(() => {
    try {
      const getOmnipost = async () => {
        console.log(
          "request route: ",
          `http://localhost:4000/omniposts/${omnipostId}`
        );
        const response = await axios.get(
          `http://localhost:4000/omniposts/${omnipostId}`,
          {
            headers: {
              userId: localStorage.getItem("userId"),
            },
          }
        );
        const responseOmnipost = response.data.omnipost;
        console.log("resp omni :", responseOmnipost);
        setBookmarked(response.data.bookmarked);
        setOmnipost({
          title: responseOmnipost.title,
          subjectId: responseOmnipost.subjectId,
          userId: responseOmnipost.userId,
          textContent: responseOmnipost.textContent,
          grade: responseOmnipost.grade,
          links: responseOmnipost.linkUrls,
          likes: responseOmnipost.likes,
          dislikes: responseOmnipost.dislikes,
        });
      };
      getOmnipost();
      console.log(omnipost);
    } catch (error) {
      if (error.res?.status == 404) {
        navigate("/notFound");
      } else {
        console.log("Error : ", error.res?.data?.message);
      }
    }
  }, [omnipostId]);

  // authorization
  useEffect(() => {
    if (token && tokenValid(token)) {
      const checkAuthorization = async () => {
        try {
          const res = await axios.get("http://localhost:4000/home/checkAdmin", {
            headers: {
              Authorization: `Bearer ${token}`, // Correct Authorization header
            },
            params: {
              userId: userId,
            },
          });

          if (res.data.authorized) {
            console.log("auth :", res.data.authorized);
            setTokenAuthorized(true);
          }
          if (res.data.admin) {
            setAdmin(true);
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
        {omnipost.subjectId && (
          <button>
            <Link to={`http://localhost:5173/subject/${omnipost.subjectId}`}>
              Back
            </Link>
          </button>
        )}
        <h2>Omnipost : {omnipost.title}</h2>
        <span>
          <Link to={`http://localhost:5173/profile/${omnipost.userId}`}>
            Author
          </Link>
        </span>
        <br />
        <span>Grade : {omnipost.grade}</span>
        <p>Content: {omnipost.textContent}</p>
        <div className="Links">
          {omnipost.links.map((link, i) => {
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
              route={"omniposts"}
              omnipostId={omnipostId}
              likes={omnipost.likes}
              dislikes={omnipost.dislikes}
            ></VoteForm>
            {/* <BookmarkButton bookmarked={bookmarked}></BookmarkButton> */}
            {admin && (
              <DeleteButton
                type={"omnipost"}
                userId={userId}
                contentId={omnipostId}
                authorized={true}
              ></DeleteButton>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default ViewOmnipost;
