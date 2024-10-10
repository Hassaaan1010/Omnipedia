import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Omniposts = ({ subjectId, omniposts, authorized }) => {
  const [sortBy, setSortBy] = useState("Recent");
  const [includeOnly, setIncludeOnly] = useState("");
  const [filtered, setFiltered] = useState([...omniposts]);
  const [sortedPosts, setSortedPosts] = useState([...omniposts]);

  useEffect(() => {
    let filteredArray = [...omniposts];
    console.log(filteredArray);
    if (includeOnly !== "") {
      filteredArray = filteredArray.filter(
        (omnipost) => omnipost.grade === includeOnly
      );
    }
    setFiltered(filteredArray);
  }, [includeOnly, omniposts]);

  useEffect(() => {
    let sortedArray = [...filtered];
    if (sortBy === "Recent") {
      sortedArray.sort(
        (first, second) =>
          new Date(second.createdAt) - new Date(first.createdAt)
      );
    } else {
      sortedArray.sort(
        (first, second) => second.likes.length - first.likes.length
      );
    }
    setSortedPosts(sortedArray);
  }, [sortBy, filtered]);

  const handleFilter = (e) => {
    setIncludeOnly(e.target.value);
  };

  const handleSort = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div>
      <h2>Omniposts</h2>
      <span>Sortby </span>
      <select name="sortBy" value={sortBy} onChange={handleSort} required>
        <option value="Recent">Recent</option>
        <option value="Likes">Likes</option>
      </select>{" "}
      |<span> Filter </span>
      <select
        name="filter"
        value={includeOnly}
        onChange={handleFilter}
        required
      >
        <option value="">Select grade</option>
        <option value="graduate">Graduate</option>
        <option value="undergraduate">Undergraduate</option>
        <option value="high school">High School</option>
        <option value="middle school">Middle School</option>
      </select>{" "}
      <ul>
        {sortedPosts.map((omnipostObject) => (
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
