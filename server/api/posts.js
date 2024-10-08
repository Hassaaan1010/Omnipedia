import express from "express";
import { badRequestErr } from "../utils/errorHandling.js";
import { createPost } from "../data/post_data.js";

const router = express.Router();

const linkRegex = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?(\/[^\s]*)?$/i;

router
  .get("/", async (req, res) => {
    res.send("Posts get route reached.");
  })
  .post("/", async (req, res) => {
    try {
      console.log(req.body);
      let { links, data, userId } = req.body;
      let { topicId, title, grade, textContent } = data;

      const postId = await createPost(
        topicId,
        title,
        grade,
        textContent,
        userId,
        links
      );

      res.status(200).json({ message: "Posts created successfully", postId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating posts", error });
    }
  });

export default router;
