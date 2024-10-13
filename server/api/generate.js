import { apiLimiter } from "../middleware/rateLimiter.js";
import { authorizeToken } from "../middleware/jwtAuthorizer.js";
import { getDescription } from "../data/generate_data.js";
import dotenv from "dotenv";
dotenv.config();
import { sendErrResp } from "../utils/errorHandling.js";

import express from "express";

const router = express.Router();

router.get("/desc", apiLimiter, authorizeToken, async (req, res) => {
  try {
    const { topicId, topicName } = req.query;
    console.log("query", topicId, topicName);

    // if llm content not available in db for the topicId get description
    const response = await getDescription(topicId, topicName);

    res.json({ description: response });
  } catch (error) {
    console.log(error);
    sendErrResp(res, { status: error.response, message: error.message });
  }
});

export default router;
