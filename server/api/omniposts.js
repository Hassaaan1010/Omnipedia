import express from "express";
import { apiLimiter } from "../middleware/rateLimiter.js";
import { authorizeToken } from "../middleware/jwtAuthorizer.js";
import { badRequestErr, sendErrResp } from "../utils/errorHandling.js";
import { createOmnipost } from "../data/omnipost_data.js";
import OmniPost from "../models/omnipost.js";

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
    console.log("reached get omni/:id route reached");
    console.log("params headers", req.params, req.headers);
    const omnipostId = req.params.id;
    console.log("omnipostId idharrrr:", omnipostId);
    if (!omnipostId) {
      throw badRequestErr("no omnipostid provided");
    }
    try {
      const fetchedOmniposts = await OmniPost.findOne({ _id: omnipostId });
      res.status(200).json({ omnipost: fetchedOmniposts });
    } catch (error) {
      console.log(error);
      sendErrResp(res, { status: error.status, message: error.message });
    }
  })
  .post("/", async (req, res) => {
    console.log("reached create omnipost route");
    console.log(req.body);
    try {
      let { links, data, userId } = req.body;
      let { subjectId, title, grade, textContent } = data;

      const [omnipostId] = await createOmnipost(
        subjectId,
        title,
        grade,
        textContent,
        userId,
        links
      );

      res.status(200).json({
        message: "omniposts created successfully",
        omnipostId,
        subjectId,
      });
    } catch (error) {
      console.log(error);
      sendErrResp(res, { status: error.status, message: error.message });
    }
  })

  .post("/like/", async (req, res) => {
    console.log("reaced omnipost like route");
    const omnipostId = req.body.omnipostId;
    let userId = req.body.userId;
    console.log("data : ", omnipostId, userId);

    try {
      const updatedPost = await OmniPost.findOneAndUpdate(
        { _id: omnipostId },
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
    console.log("reached omnipost dislike route");
    const omnipostId = req.body.omnipostId;
    const userId = req.body.userId;
    console.log("data : ", omnipostId, userId);
    try {
      const updatedOmnipost = await OmniPost.findOneAndUpdate(
        { _id: omnipostId },
        {
          $pull: { likes: userId },
          $addToSet: { dislikes: userId },
        },
        { new: true }
      );

      console.log("fetched :", updatedOmnipost);
      res.status(204).json({ success: true });
    } catch (error) {
      console.log("error disliking : ", error);
      sendErrResp(res, { status: error.status, message: error.message });
    }
  });

export default router;
