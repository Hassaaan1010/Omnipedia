import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { tokenValid } from "../utils/tokenValidation";
import axios from "axios";

const CreateSubject = () => {
  const [subjectName, setSubjectName] = useState("");
  const [topics, setTopics] = useState([""]); // Initialize with one empty input
  const [message, setMessage] = useState("");
  const [messageStyle, setMessageStyle] = useState({
    color: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && tokenValid(token)) {
      const checkAuthorization = async () => {
        try {
          const res = await axios.get("http://localhost:4000/subjects/", {
            headers: {
              Authorization: `Bearer ${token}`, // Correct Authorization header
            },
          });

          if (!res.data.authorized) {
            console.log("auth :", res.data.authorized);
            navigate("/login"); // Redirect to login if not authorized
          }
        } catch (error) {
          console.error("Error during authorization check:", error);
          navigate("/login"); // Redirect to login on any error
        }
      };

      checkAuthorization();
    } else {
      localStorage.clear();
      navigate("/login"); // Redirect to login if the token is invalid
      // continue on page
    }
  }, [navigate]); // Add navigate as a dependency

  // Handle input changes for subject name
  const handleSubjectNameChange = (e) => {
    setSubjectName(e.target.value);
  };

  // Handle input changes for topics
  const handleTopicChange = (index, e) => {
    const newTopics = [...topics];
    newTopics[index] = e.target.value;
    setTopics(newTopics);
  };

  // Add a new topic input
  const addTopic = () => {
    setTopics([...topics, ""]); // Add an empty string for the new input
  };

  // Remove a topic input
  const removeTopic = (index) => {
    const newTopics = topics.filter((_, i) => i !== index);
    setTopics(newTopics);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // You can process subjectName and topics here
    console.log("Subject Name:", subjectName);
    console.log("Topics:", topics);

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const res = await axios.post(
        "http://localhost:4000/subjects/create",
        {
          userId: userId,
          subjectName: subjectName,
          topics: topics,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );
      if (res.status === 201) {
        setMessageStyle({ color: "green" });
        setMessage("Subject created successfully");
        console.log("subject created successfully");
      }
    } catch (error) {
      setMessageStyle({ color: "red" });
      setMessage("Error : " + error?.response?.data?.message);
      console.log("Error in subject creation.", error.response.data.message);
    }
  };

  return (
    <>
      <Link to="\home">Back</Link>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Subject Name:
            <input
              type="text"
              value={subjectName}
              onChange={handleSubjectNameChange}
              required
            />
          </label>
        </div>
        <div>
          <h4>Topics:</h4>
          <p>Example: Thermodynamics MC_203</p>
          {topics.map((topic, index) => (
            <div key={index}>
              <input
                type="text"
                value={topic}
                onChange={(e) => handleTopicChange(index, e)}
                required
              />
              <button type="button" onClick={() => removeTopic(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addTopic}>
            Add Topic
          </button>
        </div>
        <button type="submit">Create Subject</button>
      </form>
      <p style={messageStyle}>{message}</p>
    </>
  );
};

export default CreateSubject;
