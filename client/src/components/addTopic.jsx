import axios from "axios";
import { useEffect, useState } from "react";

const AddTopic = ({ subjectId, setShowPopUp, setResponse }) => {
  const [topicName, setTopicName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const topicResponse = await axios.post(
        `http://localhost:4000/topics/create`,
        {
          subjectId: subjectId,
          topicName: topicName,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (topicResponse) {
        setShowPopUp(false);
        setResponse((prevResponse) => ({
          ...prevResponse.topics,
          topics: [...prevResponse.topics, topicResponse.data?.newTopic],
          omniposts: [...prevResponse.omniposts],
        }));
      }
      console.log("topic added successfully");
    } catch (error) {
      console.log("ERROR", error);
      if (error.status == 404) {
        setErrorMessage(error.response?.data?.message || "Invalid input.");
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="topicName"
          id="topicName"
          value={topicName}
          onChange={(e) => {
            setErrorMessage("");
            setTopicName(e.target.value);
          }}
        />
        <button type="submit">Create</button>
        <p>{errorMessage}</p>
      </form>
    </>
  );
};

export default AddTopic;
