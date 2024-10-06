import { useState } from "react";
import { Link } from "react-router-dom";

const CreateSubject = () => {
  const [subjectName, setSubjectName] = useState("");
  const [topics, setTopics] = useState([""]); // Initialize with one empty input

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
  const handleSubmit = (e) => {
    e.preventDefault();
    // You can process subjectName and topics here
    console.log("Subject Name:", subjectName);
    console.log("Topics:", topics);
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
    </>
  );
};

export default CreateSubject;
