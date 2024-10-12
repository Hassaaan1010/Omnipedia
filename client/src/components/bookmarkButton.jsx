import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

const BookmarkButton = () => {
  // State to track whether the item is bookmarked
  const { id: postId } = useParams();
  const [showPopup, setShowPopUp] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [newFolderForm, setNewFolderForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [savedFolder, setSavedFolder] = useState("");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    try {
      const getBookmarkedState = async () => {
        const bookmarkResponse = await axios.get(
          "http://localhost:4000/checkBookmarked/",
          {
            params: { userId, postId },
          }
        );
        console.log("Response:", bookmarkResponse.data);
        setIsBookmarked(bookmarkResponse.data.isBookmarked);
        if (isBookmarked) {
          setSavedFolder(bookmarkResponse.data.folderId);
        }
      };
      getBookmarkedState();
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      throw error;
    }
  }, [postId]);

  const showFolders = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/folders/all/${userId}`
      );
      console.log("res.data:", res.data);
      setFolders(res.data.folders);
    } catch (error) {
      console.log("error occured while fetching folders", error);
    }
  };

  // Toggle bookmark state
  const toggleBookmark = async () => {
    if (!isBookmarked) {
      setIsBookmarked(true);
      await showFolders();
      setShowPopUp(true);
    } else {
      setIsBookmarked(false);
      try {
        await axios.post(
          `http://localhost:4000/folders/removePost/`,
          {
            postId: postId,
            userId: userId,
            folderId: savedFolder,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } catch (error) {
        console.log("Error", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (newFolderForm && selectedFolder == "Create New") {
        console.log("creating new folder and adding post...".toUpperCase());
        // post data to 4000/createAndAdd
        const res = await axios.post(
          `http://localhost:4000/folders/createAndAdd`,
          {
            folderName: newFolderName,
            postId: postId,
            userId: userId,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Created folder and added post successfully");
      } else {
        console.log("adding post...");

        // post data to 4000/addPost/
        const res = await axios.post(
          `http://localhost:4000/folders/addPost/`,
          {
            postId: postId,
            folderId: selectedFolder,
            userId: userId,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Added post successfully");
      }
    } catch (error) {
      console.log("Error in adding post/ create and add post", error);
      console.log(
        "Error:",
        error.response?.data?.message,
        "Status:",
        error.response?.status
      );
    }

    // end with
    setShowPopUp(false);
  };

  const onCancel = () => {
    setIsBookmarked((prevState) => !prevState);
    setShowPopUp(false);
  };

  const handleFolderSelect = (e) => {
    e.preventDefault();
    setSelectedFolder(e.target.value);
  };

  useEffect(() => {
    console.log("selected folder :", selectedFolder);
    if (selectedFolder == "Create New") {
      setNewFolderForm(true);
    } else {
      setNewFolderForm(false);
    }
  }, [selectedFolder, newFolderForm]);

  return (
    <>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <div className="folderList">
              <form onSubmit={handleSubmit}>
                {/* select options */}
                <select
                  name="selectFolder"
                  onChange={handleFolderSelect}
                  defaultValue={selectedFolder}
                  required
                >
                  <option value="" disabled>
                    Select
                  </option>
                  {folders.map((folder, i) => (
                    <option key={i} value={folder._id}>
                      {folder.name}
                    </option>
                  ))}
                  <option value="Create New">Create New</option>
                </select>
                {/* optional create stuff */}
                {newFolderForm && (
                  <>
                    <h2>Enter name for new folder</h2>
                    <input
                      type="text"
                      name="folderName"
                      value={newFolderName}
                      onChange={(e) => {
                        setNewFolderName(e.target.value);
                      }}
                    />
                  </>
                )}
                {/* submit button */}
                <button
                  type="submit"
                  style={{ backgroundColor: "red", color: "white" }}
                >
                  Save
                </button>
              </form>
            </div>

            <button onClick={onCancel}>Cancel</button>
          </div>
        </div>
      )}
      <button
        onClick={toggleBookmark}
        style={{
          backgroundColor: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        {/* SVG Bookmark Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill={isBookmarked ? "gold" : "gray"} // Change color based on state
          className="bi bi-bookmark-fill"
          viewBox="0 0 16 16"
        >
          <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />
        </svg>
      </button>
    </>
  );
};

export default BookmarkButton;
