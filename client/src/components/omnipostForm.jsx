import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const OmnipostForm = () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId"); // Get userId from localStorage
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [links, setLinks] = useState([""]); // Initialize with one empty input

  const { subjectId } = useParams(); // Extract topicId from URL parameters
  const [formData, setFormData] = useState({
    subjectId: subjectId, // Set subjectId from URL params
    title: "",
    grade: "",
    textContent: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMessage("");
  };

  // Handle input changes for links
  const handleLinkChange = (index, e) => {
    const newLinks = [...links];
    newLinks[index] = e.target.value;
    setLinks(newLinks);
    setErrorMessage("");
  };

  // Add a new link input
  const addLink = () => {
    setLinks([...links, ""]); // Add an empty string for the new input
    setErrorMessage("");
  };

  // Remove a link input
  const removeLink = (index) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks);
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("data", {
      links: links,
      data: formData,
      userId: userId,
    });
    try {
      const res = await axios.post(
        "http://localhost:4000/omniposts/",
        {
          links: links,
          data: formData,
          userId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("omnipost created successfully", res.data.message);
      navigate(`/subject/${subjectId}`);
    } catch (error) {
      setErrorMessage(error?.response?.data?.message);
      console.log("Error in creating omnipost", error);
    }
  };

  return (
    <>
      <br />
      <h6>
        Posts that span most or all topics of the subject, like a playlist,
        course or courebook
      </h6>
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
            <option value="graduate">Graduate</option>
            <option value="undergraduate">Undergraduate</option>
            <option value="high school">High School</option>
            <option value="middle school">Middle School</option>
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

        <button type="submit">Create Omnipost</button>
      </form>
    </>
  );
};

export default OmnipostForm;
