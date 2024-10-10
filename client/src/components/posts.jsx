import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const Posts = ({ posts }) => {
  const [sortBy, setSortBy] = useState("Recent");
  const [includeOnly, setIncludeOnly] = useState("");
  const [filtered, setFiltered] = useState([...posts]);
  const [sortedPosts, setSortedPosts] = useState([...posts]);

  // filter
  useEffect(() => {
    let filteredArray = [...posts];

    if (includeOnly !== "") {
      filteredArray = filteredArray.filter(
        (post) => post.grade === includeOnly
      );
    }

    setFiltered(filteredArray);
  }, [includeOnly, posts]);

  // sort
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
    console.log("e.target.value", e.target.value);
    setSortBy(e.target.value);
    console.log("\nhandled sort : ", sortBy);
  };

  return (
    <>
      <h4>Posts List</h4>
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
      <div>
        {sortedPosts.map((post) => (
          <div
            className="postContainer"
            style={{
              backgroundColor: "lightgray",
              margin: "10px",
              color: "black",
            }}
            key={post._id}
          >
            <li>
              <Link to={`http://localhost:5173/post/${post._id}`}>
                <h3>{post.title}</h3>
              </Link>
              <p>Grade: {post.grade}</p>
              <span>
                Likes: {post.likes.length} | Dislikes: {post.dislikes.length}{" "}
              </span>
            </li>
          </div>
        ))}
      </div>
    </>
  );
};

export default Posts;

// code of shame:
// filter function here
// useEffect(() => {
//   let filteredArray = [...posts];

//   if (includeOnly !== "") {
//     // console.log(posts[0].grade);
//     // console.log("test type comparing", posts[1].grade === includeOnly);
//     // console.log("unfilt arr", filteredArray);
//     filteredArray = filteredArray.filter((post) => post.grade == includeOnly);
//     // console.log("filt arr:", filteredArray);
//     setFiltered(filteredArray);
//   } else {
//     setFiltered(posts);
//     console.log("after filter", filtered);
//   }
//   let sortedArray = [...filtered];
//   console.log("presort:", sortedArray);
//   console.log("sorting...by", sortBy);
//   if (sortBy == "Recent") {
//     // sort by recent
//     // new Date("2024-10-10T16:58:33.866Z") > new Date("2024-10-10T16:55:50.202Z")
//     // true
//     sortedArray.sort(
//       (first, second) =>
//         new Date(second.createdAt) - new Date(first.createdAt)
//     );
//   } else {
//     // sort by likes
//     sortedArray.sort(
//       (first, second) => second.likes.length - first.likes.length
//     );
//   }
//   setSortedPosts(sortedArray);
// }, [includeOnly, sortBy, posts]);
