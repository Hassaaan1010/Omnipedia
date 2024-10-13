import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "./navbar.jsx";
import { tokenValid } from "../utils/tokenValidation.js";
import axios from "axios";

const MyFolders = (props) => {
  const [showPopup, setShowPopup] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const profileId = props.profileId;
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
        console.log(profileId);
        const res = await axios.get(
          `http://localhost:4000/folders/all/${profileId}`
        );
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
  }, [profileId, navigate, tokenAuthorized]);

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

  const handleAddFolderClick = () => {
    setShowPopup(true);
  };
  const handleCancelAddFolder = () => {
    setShowPopup(false);
  };
  const handleFolderNameChange = (e) => {
    setNewFolderName(e.target.value);
  };

  const createNewFolder = async (e) => {
    e.preventDefault();
    console.log("did this trigger???");
    try {
      console.log("HERE: ");
      const folderResponse = await axios.post(
        `http://localhost:4000/folders/create`,
        {
          userId: profileId,
          folderName: newFolderName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (folderResponse.status == 201) {
        console.log("got positive resp");
        setResponse({
          folders: [...response.folders, folderResponse.data.createdFolder],
        });
        console.log("new resp fold", response.folders);
        setShowPopup(false);
      }
    } catch (error) {
      console.log("THIS IS THE ERROR: ", error);
      console.log("error", error.resposne?.data, error.status);
    }
  };

  return (
    <>
      {/* <Navbar authorized={tokenAuthorized}></Navbar> */}
      <h2>My folders</h2>
      {response.folders.map((folder, i) => (
        <div style={{ backgroundColor: "lightgray" }} key={i}>
          <Link to={`http://localhost:5173/folder/${folder._id}`}>
            <h3>{folder.name}</h3>
          </Link>
        </div>
      ))}
      {tokenAuthorized && profileId === localStorage.getItem("userId") ? (
        <>
          <button onClick={handleAddFolderClick}>Create new Folder</button>
        </>
      ) : null}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Enter name for new folder</h2>
            <form onSubmit={createNewFolder}>
              <input
                type="text"
                name="folderName"
                value={newFolderName}
                onChange={handleFolderNameChange}
              />
              <button
                type="submit"
                style={{ backgroundColor: "grey", color: "white" }}
              >
                Create
              </button>
            </form>
            <button onClick={handleCancelAddFolder}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
};
export default MyFolders;
