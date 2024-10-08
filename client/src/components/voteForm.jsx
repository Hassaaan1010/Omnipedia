import React, { useState } from "react";
import "./likeDislike.css"; // Import your custom styles

const VoteForm = () => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const handleLike = () => {
    if (disliked) setDisliked(false); // Remove dislike if present
    setLiked(!liked); // Toggle like
  };

  const handleDislike = () => {
    if (liked) setLiked(false); // Remove like if present
    setDisliked(!disliked); // Toggle dislike
  };

  return (
    <div>
      <button className={`btn ${liked ? "green" : ""}`} onClick={handleLike}>
        <i className="fa fa-thumbs-up fa-lg" aria-hidden="true"></i>
      </button>
      <button
        className={`btn ${disliked ? "red" : ""}`}
        onClick={handleDislike}
      >
        <i className="fa fa-thumbs-down fa-lg" aria-hidden="true"></i>
      </button>
    </div>
  );
};

export default VoteForm;
