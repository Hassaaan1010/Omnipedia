import { Link } from "react-router-dom";
const Posts = ({ posts }) => {
  return (
    <>
      <h4>Posts List</h4>
      <div>
        {posts.map((post) => (
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
