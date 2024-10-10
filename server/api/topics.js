import express from "express";
import Topic from "../models/topic.js";
import Post from "../models/post.js";
import {
  badRequestErr,
  notFoundErr,
  sendErrResp,
} from "../utils/errorHandling.js";

const router = express.Router();

router
  .post("/", async (req, res) => {
    try {
      console.log("reaced topic post route");
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating topics", error });
    }
  })
  .get("/:subjectId/:topicId", async (req, res) => {
    console.log("topics/:subjectid/:topicid get request");
    const { subjectId, topicId } = req.params;

    console.log(topicId);
    try {
      // Get the topic from Topics
      if (topicId.length !== 24 || subjectId.length !== 24) {
        throw badRequestErr("Invalid resource link.");
      }

      const fetchedTopic = await Topic.findOne({ _id: topicId });

      if (!fetchedTopic) {
        throw notFoundErr("Topic Not Found");
      }

      // Fetch the posts with only specific fields
      const fetchedPosts = await Post.find(
        { _id: { $in: fetchedTopic.posts } },
        "likes dislikes title grade createdAt" // This is the projection: fields to return
      ).sort({ createdAt: -1 }); //sorting by most recent first

      // llm_content will not show up in db req until it points to a valid post
      console.log(fetchedTopic);
      console.log(fetchedPosts);

      res.status(200).json({
        topic: fetchedTopic,
        posts: fetchedPosts,
      });
    } catch (error) {
      console.log(error);
      sendErrResp(res, { status: error.status, message: error.message });
    }
  });

export default router;
