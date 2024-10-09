// import React, { useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";

// const PostForm = () => {
//   const [formData, setFormData] = useState({
//     userId: "", // Replace with actual user ID
//     topicId: "", // Replace with actual topic ID
//     title: "",
//     grade: "",
//     textContent: "",
//     // linkUrls: [],
//   });
//   const [links, setLinks] = useState([""]); // Initialize with one empty input

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     // if (name === "linkUrls") {
//     //   setFormData((prev) => ({
//     //     ...prev,
//     //     linkUrls: value.split(",").map((link) => link.trim()), // Assuming comma-separated links
//     //   }));
//     // } else {
//     // }
//   };

//   // Handle input changes for links
//   const handleLinkChange = (index, e) => {
//     const newLinks = [...links];
//     newLinks[index] = e.target.value;
//     setLinks(newLinks);
//   };

//   // Add a new link input
//   const addTopic = () => {
//     setLinks([...links, ""]); // Add an empty string for the new input
//   };

//   // Remove a link input
//   const removeLink = (index) => {
//     const newLinks = links.filter((_, i) => i !== index);
//     setLinks(newLinks);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const data = new FormData();

//     // Add the rest of the form data to FormData
//     for (const key in formData) {
//       if (Array.isArray(formData[key])) {
//         formData[key].forEach((value) => data.append(key, value)); // Append array values
//       } else {
//         data.append(key, formData[key]);
//       }
//     }
//     console.log("DATA", data);
//     try {
//       const response = await axios.post("http://localhost:4000/posts/", data, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       console.log("Post created successfully:", response.data);
//       // Reset the form if needed
//       setFormData({
//         userId: localStorage.getItem("userId"),
//         topicId: useParams(),
//         title: "",
//         grade: "",
//         textContent: "",
//         linkUrls: [],
//       });
//       setFileUpload(null);
//     } catch (error) {
//       console.error("Error creating post:", error);
//     }
//   };

//   return (
//     <>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Topic ID:</label>
//           <input
//             type="text"
//             name="topicId"
//             value={formData.topicId}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div>
//           <label>Title:</label>
//           <input
//             type="text"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div>
//           <label>Grade:</label>
//           <select
//             name="grade"
//             value={formData.grade}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Select grade</option>
//             <option value="undergraduate">Undergraduate</option>
//             <option value="senior_high">Senior High</option>
//             <option value="high_school">High School</option>
//             <option value="middle_school">Middle School</option>
//           </select>
//         </div>
//         <div>
//           <label>Text Content:</label>
//           <textarea
//             name="textContent"
//             value={formData.textContent}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div>
//           {links.map((topic, index) => (
//             <div key={index}>
//               <input
//                 type="text"
//                 value={topic}
//                 onChange={(e) => handleLinkChange(index, e)}
//                 required
//               />
//               <button type="button" onClick={() => removeLink(index)}>
//                 Remove
//               </button>
//             </div>
//           ))}
//           <button type="button" onClick={addTopic}>
//             Add Topic
//           </button>
//         </div>

//         <button type="submit" onClick={handleSubmit}>
//           Create Post
//         </button>
//       </form>
//     </>
//   );
// };

// export default PostForm;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const PostForm = () => {
  const token = localStorage.getItem("token");
  const { topicId } = useParams(); // Extract topicId from URL parameters
  const userId = localStorage.getItem("userId"); // Get userId from localStorage
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    topicId: topicId, // Set topicId from URL params
    title: "",
    grade: "",
    textContent: "",
  });

  const [links, setLinks] = useState([""]); // Initialize with one empty input

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle input changes for links
  const handleLinkChange = (index, e) => {
    const newLinks = [...links];
    newLinks[index] = e.target.value;
    setLinks(newLinks);
  };

  // Add a new link input
  const addLink = () => {
    setLinks([...links, ""]); // Add an empty string for the new input
  };

  // Remove a link input
  const removeLink = (index) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("links : ", links);
    console.log("data : ", formData);

    // Append the links to FormData
    // links.forEach((link) => data.append("linkUrls", link));

    try {
      const response = await axios.post(
        "http://localhost:4000/posts/",
        {
          links: links,
          data: formData,
          userId: userId,
        },
        {
          headers: {
            // Add this headers property
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Post created successfully:", response.data);
      // Reset the form if needed
      const subjectId = response.data.subjectId;
      navigate(`/posts/${response.data.postId}`);
    } catch (error) {
      setErrorMessage(error?.response?.data?.message);

      console.error("Error creating post:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Grade:</label>
          <select
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            required
          >
            <option value="">Select grade</option>
            <option value="undergraduate">Undergraduate</option>
            <option value="senior_high">Senior High</option>
            <option value="high_school">High School</option>
            <option value="middle_school">Middle School</option>
          </select>
        </div>
        <div>
          <label>Text Content:</label>
          <textarea
            name="textContent"
            value={formData.textContent}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          {links.map((link, index) => (
            <div key={index}>
              <input
                type="text"
                value={link}
                onChange={(e) => handleLinkChange(index, e)}
              />
              <button type="button" onClick={() => removeLink(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addLink}>
            Add Link
          </button>
        </div>
        <p style={{ color: "red" }}>{errorMessage}</p>

        <button type="submit">Create Post</button>
      </form>
    </>
  );
};

export default PostForm;
