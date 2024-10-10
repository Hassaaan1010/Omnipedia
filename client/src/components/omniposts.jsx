import { Link } from "react-router-dom";

const Omniposts = ({ subjectId, omniposts, authorized }) => {
  return (
    <div>
      <h2>Omniposts</h2>
      <ul>
        {omniposts.map((omnipostObject) => (
          <div
            className="postContainer"
            style={{
              backgroundColor: "lightgray",
              margin: "10px",
              color: "black",
            }}
            key={omnipostObject._id}
          >
            <li key={omnipostObject._id}>
              <Link
                to={`http://localhost:5173/omniposts/${omnipostObject._id}`}
              >
                {omnipostObject.title}
              </Link>
              <p>Grade: {omnipostObject.grade}</p>
              <span>
                Likes: {omnipostObject.likes.length} | Dislikes:{" "}
                {omnipostObject.dislikes.length}{" "}
              </span>
            </li>
          </div>
        ))}
      </ul>
      {(authorized && (
        <button>
          <Link to={`http://localhost:5173/omniposts/create/${subjectId}`}>
            Create Omnipost
          </Link>
        </button>
      )) || (
        <button>
          <Link to="http://localhost:5173/login/">Login to Post</Link>
        </button>
      )}
    </div>
  );
};

export default Omniposts;
