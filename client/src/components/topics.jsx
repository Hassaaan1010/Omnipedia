import { Link } from "react-router-dom";

const Topics = ({ topics, owner, subjectId, authorized }) => {
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
        <button>
          {/* this link should send a post request to server at /topics/ with subject in header */}
          <Link to={`http://localhost:5173/topics/add/${subjectId}/`}>
            Add Topics
          </Link>
        </button>
      )}
    </div>
  );
};

export default Topics;
