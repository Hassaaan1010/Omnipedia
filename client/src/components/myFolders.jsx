// // import { useEffect, useState } from "react";
// // import { Link, useNavigate, useParams } from "react-router-dom";
// // import Navbar from "./navbar.jsx";
// // import { tokenValid } from "../utils/tokenValidation.js";
// // import axios from "axios";

// // const MyFolders = () => {
// //   const [showPopup, setShowPopup] = useState(false);
// //   const [newFolderName, setNewFolderName] = useState("");

// //   const { userId: profileId } = useParams();
// //   const token = localStorage.getItem("token");
// //   const [tokenAuthorized, setTokenAuthorized] = useState(false);
// //   const [owner, setOwner] = useState(false);
// //   const [response, setResponse] = useState({
// //     folders: [],
// //   });

// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     // get all folders of user by userId
// //     if (profileId === localStorage.getItem("userId") && tokenAuthorized) {
// //       setOwner(true);
// //     }
// //     try {
// //       const getFolders = async () => {
// //         const res = await axios.get(
// //           `http://localhost:4000/folders/all/${profileId}`
// //         );
// //         console.log("res.data:", res.data);
// //         setResponse({ folders: res.data.folders });
// //       };
// //       getFolders();
// //     } catch (error) {
// //       console.log(error);
// //       if (error.response?.status === 404) {
// //         navigate("/notFound");
// //       }
// //     }
// //   }, [profileId]);

// //   useEffect(() => {
// //     // authorization
// //     if (token && tokenValid(token)) {
// //       const checkAuthorization = async () => {
// //         try {
// //           const res = await axios.get("http://localhost:4000/home/", {
// //             headers: {
// //               Authorization: `Bearer ${token}`, // Correct Authorization header
// //             },
// //           });

// //           if (res.data.authorized) {
// //             console.log("auth :", res.data.authorized);
// //             setTokenAuthorized(true);
// //           }
// //         } catch (error) {
// //           console.error("Error during authorization check:", error);
// //           setTokenAuthorized(false);
// //           localStorage.clear();
// //         }
// //       };

// //       checkAuthorization();
// //     } else {
// //       setTokenAuthorized(false);
// //       localStorage.clear();
// //     }
// //   }, [token]); // Add token as a dependency

// //   const handleAddFolderClick = () => {
// //     setShowPopup(true);
// //   };

// //   const handleCancelAddFolder = () => {
// //     setShowPopup(false);
// //   };

// //   const handleFolderNameChange = (e) => {
// //     setNewFolderName(e.target.value);
// //   };

// //   const createNewFolder = async (e) => {
// //     e.preventDefault();
// //     try {
// //       console.log("did this trigger???");
// //       const folderRes = await axios.post(
// //         `http://localhost:4000/folders/create`,
// //         {
// //           userId: "profileId",
// //           folderName: newFolderName,
// //         },
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         }
// //       );
// //       console.log("new folder data", folderRes.data);
// //       // setResponse({
// //       //   folders: [...response.folders, folderRes.data.createdFolder._id],
// //       // });
// //       setShowPopup(false);
// //     } catch (error) {
// //       console.log(error);
// //       console.log("error", error.resposne?.data, error.status);
// //     }
// //   };

// //   return (
// //     <>
// //       <Navbar authorized={tokenAuthorized}></Navbar>
// //       <h2>My folders</h2>
// //       {response.folders.map((folder, i) => (
// //         <div style={{ backgroundColor: "lightgray" }} key={i}>
// //           <Link to={`http://localhost:5173/folder/${folder._id}`}>
// //             <h3>{folder.name}</h3>
// //           </Link>
// //         </div>
// //       ))}
// //       {tokenAuthorized && profileId === localStorage.getItem("userId") ? (
// //         <>
// //           <button onClick={handleAddFolderClick}>Create new Folder</button>
// //         </>
// //       ) : null}

// //       {showPopup && (
// //         <div className="popup-overlay">
// //           <div className="popup">
// //             <h2>Enter name for new folder</h2>
// //             <form onSubmit={createNewFolder}>
// //               <input
// //                 type="text"
// //                 name="folderName"
// //                 value={newFolderName}
// //                 onChange={handleFolderNameChange}
// //               />
// //               <button
// //                 type="submit"
// //                 style={{ backgroundColor: "grey", color: "white" }}
// //               >
// //                 Create
// //               </button>
// //             </form>
// //             <button onClick={handleCancelAddFolder}>Cancel</button>
// //           </div>
// //         </div>
// //       )}
// //     </>
// //   );
// // };

// // export default MyFolders;

// https://paste.mozilla.org/RPzrKnUx
// About History New snippet

//     JavaScript Expires in: 58 minutes
//     Delete Now
//     Raw
//     Slim
//     import { useEffect, useState } from "react";
//     import { Link, useNavigate, useParams } from "react-router-dom";
//     import Navbar from "./navbar.jsx";
//     import { tokenValid } from "../utils/tokenValidation.js";
//     import axios from "axios";

//     const MyFolders = () => {
//       const [showPopup, setShowPopup] = useState(false);
//       const [newFolderName, setNewFolderName] = useState("");

//       const { userId: profileId } = useParams();
//       const token = localStorage.getItem("token");
//       const [tokenAuthorized, setTokenAuthorized] = useState(false);
//       const [owner, setOwner] = useState(false);
//       const [response, setResponse] = useState({
//         folders: [],
//       });

//       const navigate = useNavigate();

//       useEffect(() => {
//         // get all folders of user by userId
//         if (profileId === localStorage.getItem("userId") && tokenAuthorized) {
//           setOwner(true);
//         }
//         try {
//           const getFolders = async () => {
//             const res = await axios.get(
//               `http://localhost:4000/folders/all/${profileId}`
//             );
//             console.log("res.data:", res.data);
//             setResponse({ folders: res.data.folders });
//           };
//           getFolders();
//         } catch (error) {
//           console.log(error);
//           if (error.response?.status === 404) {
//             navigate("/notFound");
//           }
//         }
//       }, [profileId, navigate, tokenAuthorized]);

//       useEffect(() => {
//         // authorization
//         if (token && tokenValid(token)) {
//           const checkAuthorization = async () => {
//             try {
//               const res = await axios.get("http://localhost:4000/home/", {
//                 headers: {
//                   Authorization: `Bearer ${token}`, // Correct Authorization header
//                 },
//               });

//               if (res.data.authorized) {
//                 console.log("auth :", res.data.authorized);
//                 setTokenAuthorized(true);
//               }
//             } catch (error) {
//               console.error("Error during authorization check:", error);
//               setTokenAuthorized(false);
//               localStorage.clear();
//             }
//           };

//           checkAuthorization();
//         } else {
//           setTokenAuthorized(false);
//           localStorage.clear();
//         }
//       }, [token]); // Add token as a dependency

//       const handleAddFolderClick = () => {
//         setShowPopup(true);
//       };

//       const handleCancelAddFolder = () => {
//         setShowPopup(false);
//       };

//       const handleFolderNameChange = (e) => {
//         setNewFolderName(e.target.value);
//       };

//       const createNewFolder = async () => {
//         console.log("did this trigger???");
//         try {
//             console.log("HERE: ")
//           await axios.post(`http://localhost:4000/folders/create`, {
//               userId: profileId,
//               folderName: newFolderName,
//             }, {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           )
//             // setResponse({
//             //   folders: [...response.folders, folderRes.data.createdFolder._id],
//             // });
//           setShowPopup(false);
//         } catch (error) {
//           console.log("THIS IS THE ERROR: ", error);
//           console.log("error", error.resposne?.data, error.status);
//         }
//       };

//       return (
//         <>
//           <Navbar authorized={tokenAuthorized}></Navbar>
//           <h2>My folders</h2>
//           {response.folders.map((folder, i) => (
//             <div style={{ backgroundColor: "lightgray" }} key={i}>
//               <Link to={`http://localhost:5173/folder/${folder._id}`}>
//                 <h3>{folder.name}</h3>
//               </Link>
//             </div>
//           ))}
//           {tokenAuthorized && profileId === localStorage.getItem("userId") ? (
//             <>
//               <button onClick={handleAddFolderClick}>Create new Folder</button>
//             </>
//           ) : null}

//           {showPopup && (
//             <div className="popup-overlay">
//               <div className="popup">
//                 <h2>Enter name for new folder</h2>
//                 <form onSubmit={createNewFolder}>
//                   <input
//                     type="text"
//                     name="folderName"
//                     value={newFolderName}
//                     onChange={handleFolderNameChange}
//                   />
//                   <button
//                     type="submit"
//                     style={{ backgroundColor: "grey", color: "white" }}
//                   >
//                     Create
//                   </button>
//                 </form>
//                 <button onClick={handleCancelAddFolder}>Cancel</button>
//               </div>
//             </div>
//           )}
//         </>
//       );
//     };

//     export default MyFolders;
//     Copy Snippet
//     Edit Snippet
//     Wordwrap

// Snippet content copied to clipboard.
// Are you sure to delete this snippet?
// No, don't delete
// paste.mozilla.org allows you to share code snippets and notes with others. These pastes require a link to be viewed; they are not private. Anyone with the link is able to see the paste and also delete it.

// Please refrain from sharing personal or sensitive information on this website to avoid it being viewed by other parties.

//     import { useEffect, useState } from "react";
//     import { Link, useNavigate, useParams } from "react-router-dom";
//     import Navbar from "./navbar.jsx";
//     import { tokenValid } from "../utils/tokenValidation.js";
//     import axios from "axios";

//     const MyFolders = () => {
//       const [showPopup, setShowPopup] = useState(false);
//       const [newFolderName, setNewFolderName] = useState("");

//       const { userId: profileId } = useParams();
//       const token = localStorage.getItem("token");
//       const [tokenAuthorized, setTokenAuthorized] = useState(false);
//       const [owner, setOwner] = useState(false);
//       const [response, setResponse] = useState({
//         folders: [],
//       });

//       const navigate = useNavigate();
//           useEffect(() => {
//         // get all folders of user by userId
//         if (profileId === localStorage.getItem("userId") && tokenAuthorized) {
//           setOwner(true);
//         }
//         try {
//           const getFolders = async () => {
//             const res = await axios.get(
//               `http://localhost:4000/folders/all/${profileId}`
//             );
//             console.log("res.data:", res.data);
//             setResponse({ folders: res.data.folders });
//           };
//           getFolders();
//         } catch (error) {
//           console.log(error);
//           if (error.response?.status === 404) {
//             navigate("/notFound");
//           }
//         }
//       }, [profileId, navigate, tokenAuthorized]);
//      //       useEffect(() => {
//         // authorization
//         if (token && tokenValid(token)) {
//           const checkAuthorization = async () => {
//             try {
//               const res = await axios.get("http://localhost:4000/home/", {
//                 headers: {
//                   Authorization: `Bearer ${token}`, // Correct Authorization header
//                 },
//               });
//      //               if (res.data.authorized) {
//                 console.log("auth :", res.data.authorized);
//                 setTokenAuthorized(true);
//               }
//             } catch (error) {
//               console.error("Error during authorization check:", error);
//               setTokenAuthorized(false);
//               localStorage.clear();
//             }
//           };
//      //           checkAuthorization();
//         } else {
//           setTokenAuthorized(false);
//           localStorage.clear();
//         }
//       }, [token]); // Add token as a dependency
//      //       const handleAddFolderClick = () => {
//         setShowPopup(true);
//       };
//      //       const handleCancelAddFolder = () => {
//         setShowPopup(false);
//       };
//      //       const handleFolderNameChange = (e) => {
//         setNewFolderName(e.target.value);
//       };
//      //       const createNewFolder = async () => {
//         console.log("did this trigger???");
//         try {
//             console.log("HERE: ")
//           await axios.post(`http://localhost:4000/folders/create`, {
//               userId: profileId,
//               folderName: newFolderName,
//             }, {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           )
//             // setResponse({
//             //   folders: [...response.folders, folderRes.data.createdFolder._id],
//             // });
//           setShowPopup(false);
//         } catch (error) {
//           console.log("THIS IS THE ERROR: ", error);
//           console.log("error", error.resposne?.data, error.status);
//         }
//       };
//      //       return (
//         <>
//           <Navbar authorized={tokenAuthorized}></Navbar>
//           <h2>My folders</h2>
//           {response.folders.map((folder, i) => (
//             <div style={{ backgroundColor: "lightgray" }} key={i}>
//               <Link to={`http://localhost:5173/folder/${folder._id}`}>
//                 <h3>{folder.name}</h3>
//               </Link>
//             </div>
//           ))}
//           {tokenAuthorized && profileId === localStorage.getItem("userId") ? (
//             <>
//               <button onClick={handleAddFolderClick}>Create new Folder</button>
//             </>
//           ) : null}
//      //           {showPopup && (
//             <div className="popup-overlay">
//               <div className="popup">
//                 <h2>Enter name for new folder</h2>
//                 <form onSubmit={createNewFolder}>
//                   <input
//                     type="text"
//                     name="folderName"
//                     value={newFolderName}
//                     onChange={handleFolderNameChange}
//                   />
//                   <button
//                     type="submit"
//                     style={{ backgroundColor: "grey", color: "white" }}
//                   >
//                     Create
//                   </button>
//                 </form>
//                 <button onClick={handleCancelAddFolder}>Cancel</button>
//               </div>
//             </div>
//           )}
//         </>
//       );
//     };
//      // export default MyFolders;

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "./navbar.jsx";
import { tokenValid } from "../utils/tokenValidation.js";
import axios from "axios";
const MyFolders = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
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
  //   const createNewFolder = async () => {
  //     console.log("did this trigger???");
  //     try {
  //       console.log("HERE: ");
  //       await axios.post(
  //         `http://localhost:4000/folders/create`,
  //         {
  //           userId: profileId,
  //           folderName: newFolderName,
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       // setResponse({
  //       //   folders: [...response.folders, folderRes.data.createdFolder._id],
  //       // });
  //       setShowPopup(false);
  //     } catch (error) {
  //       console.log("THIS IS THE ERROR: ", error);
  //       console.log("error", error.resposne?.data, error.status);
  //     }
  //   };
  const createNewFolder = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      console.log("did this trigger???");

      const resp = await fetch(`http://localhost:4000/folders/create`, {
        method: "POST", // Specify the request method
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
          Authorization: `Bearer ${token}`, // Include the authorization header
        },
        body: JSON.stringify({
          userId: profileId, // Use the actual profileId
          folderName: newFolderName,
        }),
      });

      if (!resp.ok) {
        // Check if the response is not ok (status code is not in the range 200-299)
        const errorData = await resp.json(); // Parse the error data
        throw new Error(`Error: ${errorData.message || resp.statusText}`); // Throw an error with the message
      }

      const folderRes = await resp.json(); // Parse the JSON response
      console.log("new folder data", folderRes);
      setShowPopup(false); // Close the popup
      setResponse({ folders: [...response.folders, folderRes.createdFolder] });
    } catch (error) {
      console.log("Error creating folder:", error);
      console.log("error response:", error.message);
    }
  };
  return (
    <>
      <Navbar authorized={tokenAuthorized}></Navbar>
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
