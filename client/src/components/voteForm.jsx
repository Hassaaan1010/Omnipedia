import React, { useEffect, useState } from "react";
import "./likeDislike.css"; // Import your custom styles
import axios from "axios";

// props : likes, disliks, auth, userId postId

const VoteForm = (props) => {
  const token = localStorage.getItem("token");
  // const [opinion, setOpinion] = useState(undefined);
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
        console.log(`http://localhost:4000/${props.route}/like/`, {
          userId: props.userId,
          postId: props.postId || null,
          omnipostId: props.omnipostId || null,
        });
        const res = await axios.post(
          // `http://localhost:4000/posts/like/`,
          `http://localhost:4000/${props.route}/like/`,
          {
            userId: props.userId,
            postId: props.postId || null,
            omnipostId: props.omnipostId || null,
          },
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
        console.log(`http://localhost:4000/${props.route}/like/`, {
          userId: props.userId,
          postId: props.postId || null,
          omnipostId: props.omnipostId || null,
        });
        const res = await axios.post(
          `http://localhost:4000/${props.route}/dislike/`,
          {
            userId: props.userId,
            postId: props.postId || null,
            omnipostId: props.omnipostId || null,
          },
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
