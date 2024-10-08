import express from "express";
import { badRequestErr, sendErrResp } from "../utils/errorHandling.js";
import { createPost } from "../data/post_data.js";
import { apiLimiter } from "../middleware/rateLimiter.js";
import { authorizeToken } from "../middleware/jwtAuthorizer.js";

const router = express.Router();

const linkRegex = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?(\/[^\s]*)?$/i;

router
  .get("/", async (req, res) => {
    res.send("Posts get route reached.");
  })
  .get("/:id", apiLimiter, async (req, res) => {
    res.send("posts get /:id route reached");
  })
  .post("/", apiLimiter, authorizeToken, async (req, res) => {
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
      sendErrResp(res, { status: error.status, message: error.message });
    }
  });

export default router;
