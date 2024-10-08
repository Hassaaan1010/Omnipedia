const Posts = ({ posts }) => {
  return (
    <>
      <h4>Posts List</h4>
      <div>
        {posts.map((post) => (
          <div key={post._id}>
            <li>
              <h3>{post.title}</h3>
              <p>Likes: {post.likes.length}</p>
              <p>Dislikes: {post.dislikes.length}</p>
              <p>Grade: {post.grade.join(", ")}</p>
            </li>
          </div>
        ))}
      </div>
    </>
  );
};

export default Posts;
