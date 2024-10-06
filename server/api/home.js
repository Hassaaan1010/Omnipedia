import express from "express";
import { apiLimiter } from "../middleware/rateLimiter.js";
import { authorizeToken } from "../middleware/jwtAuthorizer.js";
import { sendErrResp } from "../utils/errorHandling.js";

const router = express.Router();

router.get("/", apiLimiter, authorizeToken, async (req, res) => {
  try {
    console.log("reached home get");
    res.status(200).json({ authorized: true });
  } catch (error) {
    sendErrResp(res, { status: "500", message: "Token authorization failed." });
  }
});

export default router;
