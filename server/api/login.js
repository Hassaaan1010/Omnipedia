import express from "express";
import { authenticateUser, getUserByEmail } from "../data/user_data.js";
import { createJwtToken } from "../middleware/jwt.js";
import { apiLimiter } from "../middleware/rateLimiter.js";
import { authorizeToken } from "../middleware/jwtAuthorizer.js";
import {
  badRequestErr, //400
  unauthorizedErr, //401
  forbiddenErr, //403
  notFoundErr, //404
  internalServerErr, //500
  sendErrResp,
} from "../utils/errorHandling.js";
const router = express.Router();

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router
  .get("/", apiLimiter, authorizeToken, async (req, res) => {
    try {
      console.log("reached login get");
      res.status(200).json({ authorized: true });
    } catch (error) {
      sendErrResp(res, {
        status: "500",
        message: "Token authorization failed.",
      });
    }
  })

  .post("/", apiLimiter, async (req, res) => {
    let { email, password } = req.body;
    console.log(email, password);
    // normalise email
    email = email.trim().toLowerCase();

    try {
      //  validate input
      switch (true) {
        case !email || !password:
          throw badRequestErr("All fields are required");
        case !emailRegex.test(email):
          throw badRequestErr("Invalid email format");
        case !passwordRegex.test(password):
          throw badRequestErr("Invalid password format");
        default:
          break;
      }
      console.log("validation complete");

      // returns the user, if email and password match
      const authenticatedUser = await authenticateUser(email, password);
      console.log("user authenticated");

      // if user authenticated, return token
      if (authenticatedUser) {
        const token = await createJwtToken(authenticatedUser);
        console.log("token created");
        return res
          .status(200) // 200 successful login
          .json({
            token: token,
            username: authenticatedUser.username,
            userId: authenticatedUser._id,
          });
      } else {
        // throw { status: 401, message: "Could not authenticate user" };
        throw unauthorizedErr("Could not authenticate user");
      }

      // authentication error
    } catch (error) {
      sendErrResp(res, error);
    }
  });

export default router;
