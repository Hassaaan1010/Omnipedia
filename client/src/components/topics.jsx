import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AddTopic from "./addTopic";

const Topics = ({ topics, owner, subjectId, authorized, setResponse }) => {
  const [showPopup, setShowPopUp] = useState(false);
  const [topicsList, setTopicsList] = useState(topics);

  // useEffect(() => {}, [topicsList]);

  console.log("topics: ", topics);
  console.log("topicList", topicsList);
  return (
    <div>
      <h2>Topics</h2>
      <ul>
        {topics.map((topicObject) => (
          <li key={topicObject._id}>
            <Link
              to={`http://localhost:5173/topic/${subjectId}/${topicObject._id}`}
            >
              {topicObject.name}
            </Link>
          </li>
        ))}
      </ul>
      {/* Conditional rendering for "Add Topics" button */}
      {owner && authorized && (
        <>
          {/* this link should send a post request to server at /topics/ with subject in header */}
          <button
            onClick={() => {
              setShowPopUp(true);
            }}
          >
            Add Topics
          </button>
        </>
      )}
      {
        // add topic popup
        showPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <AddTopic
                subjectId={subjectId}
                setShowPopUp={setShowPopUp}
                setResponse={setResponse}
              ></AddTopic>
              <button
                onClick={() => {
                  setShowPopUp(false);
                }}
              >
                Back
              </button>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default Topics;
