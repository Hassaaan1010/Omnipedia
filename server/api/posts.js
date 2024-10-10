import express from "express";
import { badRequestErr, sendErrResp } from "../utils/errorHandling.js";
import { createPost } from "../data/post_data.js";
import { apiLimiter } from "../middleware/rateLimiter.js";
import { authorizeToken } from "../middleware/jwtAuthorizer.js";
import Post from "../models/post.js";
const router = express.Router();

const linkRegex = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?(\/[^\s]*)?$/i;

router
  .get("/:id", apiLimiter, async (req, res) => {
    console.log("posts get /:id route reached");
    const { id } = req.params;
    console.log(id);
    try {
      const fetchedPost = await Post.findOne({ _id: id });
      console.log(fetchedPost);
      res.status(200).json({ post: fetchedPost });
    } catch (error) {
      sendErrResp(res, { status: error.status, message: error.message });
    }
  })
  .get("/", apiLimiter, async (req, res) => {
    res.send("Posts get route reached.");
  })
  .post("/", apiLimiter, authorizeToken, async (req, res) => {
    try {
      console.log(req.body);
      let { links, data, userId } = req.body;
      let { topicId, title, grade, textContent } = data;

      const [postId, subjectId] = await createPost(
        topicId,
        title,
        grade,
        textContent,
        userId,
        links
      );

      res.status(200).json({
        message: "Posts created successfully",
        postId,
        topicId,
        subjectId,
      });
    } catch (error) {
      console.error(error);
      sendErrResp(res, { status: error.status, message: error.message });
    }
  })
  .post("/like/", async (req, res) => {
    console.log("reaced like route");
    const postId = req.body.postId;
    let userId = req.body.userId;
    console.log("data : ", postId, userId);

    try {
      const updatedPost = await Post.findOneAndUpdate(
        { _id: postId },
        {
          $pull: { dislikes: userId },
          $addToSet: { likes: userId },
        },
        { new: true }
      );

      console.log("Post updated: ", updatedPost);
      res.status(204).json({ success: true });
    } catch (error) {
      console.log("error liking : ", error);
      sendErrResp(res, { status: error.status, message: error.message });
    }
  })
  .post("/dislike/", async (req, res) => {
    console.log("reached dislike route");
    const postId = req.body.postId;
    const userId = req.body.userId;
    console.log("data : ", postId, userId);
    try {
      const updatedPost = await Post.findOneAndUpdate(
        { _id: postId },
        {
          $pull: { likes: userId },
          $addToSet: { dislikes: userId },
        },
        { new: true }
      );

      console.log("fetched :", updatedPost);
      res.status(204).json({ success: true });
    } catch (error) {
      console.log("error disliking : ", error);
      sendErrResp(res, { status: error.status, message: error.message });
    }
  });

export default router;
