import { Link } from "react-router-dom";

const Omniposts = ({ subjectId, omniposts, authorized }) => {
  return (
    <div>
      <h2>Omniposts</h2>
      <ul>
        {omniposts.map((omnipostObject) => (
          <li key={omnipostObject._id}>
            <Link to={`http://localhost:5173/omniposts/${omnipostObject._id}`}>
              {omnipostObject.title}
            </Link>
          </li>
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
