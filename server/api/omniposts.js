import express from "express";
import { apiLimiter } from "../middleware/rateLimiter.js";
import { authorizeToken } from "../middleware/jwtAuthorizer.js";
import { badRequestErr, sendErrResp } from "../utils/errorHandling.js";

const router = express.Router();

const linkRegex = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?(\/[^\s]*)?$/i;

router
  .get("/", async (req, res) => {
    try {
      console.log("reached omni get route");
      res.status(200);
    } catch (error) {
      sendErrResp(res, { status: error.status, message: error.message });
    }
  })
  .get("/:id", apiLimiter, async (req, res) => {
    res.send("reached get omni/:id route reached");
  })
  .post("/create", async (params) => {
    console.log(req.body);
    try {
      let { links, data, userId } = req.body;
      let { subjectId, title, grade, textContent } = data;

      const [postId] = await createOmnipost(
        subjectId,
        title,
        grade,
        textContent,
        userId,
        links
      );

      res.status(200).json({
        message: "omniosts created successfully",
        postId,
        subjectId,
      });
      console.log("reached omni/create post route");
    } catch (error) {
      sendErrResp(res, { status: error.status, message: error.message });
    }
  });

export default router;
