import Navbar from "./navbar";
import MyFolders from "./myFolders";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { tokenValid } from "../utils/tokenValidation";
import { Link } from "react-router-dom";
import Subjects from "./subjects";
import axios from "axios";

const Profile = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const [tokenAuthorized, setTokenAuthorized] = useState(false);
  const [response, setResponse] = useState({
    userId: "",
    username: "",
    email: "",
    grade: "",
    posts: [],
    ownedSubjects: [],
    followingSubjects: [],
    folders: [],
    owner: false,
  });
  const [showFolders, setShowFolders] = useState(false);
  console.log("showfold", showFolders);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const getUser = async () => {
        const res = await axios.get(`http://localhost:4000/users/${id}`, {
          params: {
            authorized: tokenAuthorized,
            requesterId: localStorage.getItem("userId"),
          },
        });
        console.log("data  :", res.data);
        setResponse({
          userId: res.data.user._id,
          username: res.data.user.username,
          email: res.data.user.email,
          grade: res.data.user.grade,
          posts: res.data.user.posts,
          ownedSubjects: res.data.mySubjectsNames,
          folders: res.data.user.folders || [],
          followingSubjects: res.data.user.followingSubjects,
          owner: res.data.owner,
        });
      };
      getUser();
      console.log(response);
    } catch (error) {
      if (error.res.status !== 404) {
        console.log(
          "Error fetching user:",
          error.response.status,
          error.response.message
        );
        navigate("/home");
      }
      navigate("/notFound");
    }
  }, [id, tokenAuthorized, navigate]);

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

  const handleShowFolders = () => {
    setShowFolders(true);
  };

  const handleHideFolders = () => {
    setShowFolders(false);
  };

  return (
    <>
      <Navbar authorized={tokenAuthorized}></Navbar>
      <div
        className="container"
        style={{
          backgroundColor: "lightGrey",
          color: "black",
          padding: "10px",
          borderRadius: "10px",
        }}
      >
        <div>
          <div
            className="circle"
            style={{
              height: "100px",
              width: "100px",
              borderRadius: "50px",
              backgroundColor: "blue", //for a ranked profile rim, take number of posts//n and for a const rank : [] , take the result index of the []
              borderBottomWidth: "10px",
            }}
          >
            <div
              style={{
                height: "90px",
                width: "90px",
                backgroundColor: "white",
                borderRadius: "45px",
                position: "relative",
                left: "5px",
                top: "5px",
              }}
            ></div>
          </div>
          <h2>{response.username}</h2>
          <h3>Email : {response.email}</h3>
        </div>
        <div>
          <h3>
            <u>Achievements</u>
          </h3>
          <p>Number of posts: {response.posts.length}</p>
          <div>
            <h2>Created subjects</h2>
            <ul>
              {response.ownedSubjects.map((subject) => (
                <li key={subject._id}>{subject.name}</li>
              ))}
            </ul>
          </div>
          <Subjects userId={id}></Subjects>
        </div>
        <div>
          {/* <Link to={`http://localhost:5173/folders/${response.userId}`}>
            Folders
          </Link> */}
          <button onClick={handleShowFolders}>Folders</button>
        </div>
        <div className="foldersPopup">
          {showFolders && (
            <div className="popup-overlay">
              <div className="popup">
                <MyFolders profileId={id}></MyFolders>
                {/* <h1>Folders</h1> */}
                <button onClick={handleHideFolders}>Back</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
