import express from "express";
import { apiLimiter } from "../middleware/rateLimiter.js";
import { authorizeToken } from "../middleware/jwtAuthorizer.js";
import { sendErrResp } from "../utils/errorHandling.js";
import { checkUserAdmin } from "../data/user_data.js";

const router = express.Router();

router
  .get("/", apiLimiter, authorizeToken, async (req, res) => {
    try {
      res.status(200).json({ authorized: true });
    } catch (error) {
      console.log(error);
      sendErrResp(res, {
        status: "500",
        message: "Token authorization failed.",
      });
    }
  })
  .get("/checkAdmin", apiLimiter, authorizeToken, async (req, res) => {
    try {
      const userId = req.query.userId;
      console.log("asdf:", userId);
      const isAdmin = await checkUserAdmin(userId);
      res.status("200").json({ authorized: true, admin: isAdmin });
    } catch (error) {
      sendErrResp(res, { status: error.status, message: error.message });
    }
  });

export default router;
