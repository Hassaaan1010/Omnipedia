import React, { useEffect, useState } from "react";
import "./likeDislike.css"; // Import your custom styles
import axios from "axios";

const VoteForm = (props) => {
  const token = localStorage.getItem("token");
  const [opinion, setOpinion] = useState(undefined);
  console.log("voteform props", props);
  const [vote, setVote] = useState({
    liked: false,
    disliked: false,
  });
  useEffect(() => {
    console.log("dislikes", props.dislikes);
    if (props.likes.includes(props.userId)) {
      setVote({ liked: true, disliked: false });
    } else if (props.dislikes.includes(props.userId)) {
      setVote({ liked: false, disliked: true });
    }
  }, [props.likes, props.dislikes, props.userId]);
  const handleLike = async () => {
    // if vote isnt already liked
    if (!vote.liked) {
      setVote({ liked: true, disliked: false });
      try {
        const res = await axios.post(
          `http://localhost:4000/posts/like/`,
          { userId: props.userId, postId: props.postId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("like success : ", res.data.success);
      } catch (error) {
        console.log("error in liking :", error);
      }
    }
  };
  const handleDislike = async () => {
    // if vote isnt already liked
    if (!vote.disliked) {
      setVote({ liked: false, disliked: true });
      try {
        const res = await axios.post(
          `http://localhost:4000/posts/dislike/`,
          { userId: props.userId, postId: props.postId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("dislike success : ", res.data.success);
      } catch (error) {
        console.log("error in liking :", error);
      }
    }
  };

  return (
    <div>
      <button
        className={`btn ${vote.liked ? "green" : ""}`}
        onClick={handleLike}
      >
        <i className="fa fa-thumbs-up fa-lg" aria-hidden="true"></i>
      </button>
      <button
        className={`btn ${vote.disliked ? "red" : ""}`}
        onClick={handleDislike}
      >
        <i className="fa fa-thumbs-down fa-lg" aria-hidden="true"></i>
      </button>
    </div>
  );
};

export default VoteForm;

/*   const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const handleLike = () => {
    if (disliked) setDisliked(false); // Remove dislike if present
    setLiked(!liked); // Toggle like
  };

  const handleDislike = () => {
    if (liked) setLiked(false); // Remove like if present
    setDisliked(!disliked); // Toggle dislike
    try {
      const res = axios.post(
        `http://localhost:4000/post/like/${props.userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.log("Error in liking", error);
    }
  };
  console.log("props liked : ", props.liked); */
