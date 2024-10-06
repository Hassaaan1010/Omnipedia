import express from "express";
import {
  badRequestErr, //400
  unauthorizedErr, //401
  forbiddenErr, //403
  notFoundErr, //404
  internalServerErr, //500
} from "../utils/errorHandling.js";
import { createUser } from "../data/user_data.js";
import { createJwtToken } from "../middleware/jwt.js";
import { apiLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /.{6,}/;

router
  .get("/", apiLimiter, (req, res) => {
    return res.send("Regester route reached.");
  })

  .post("/", apiLimiter, async (req, res) => {
    let { username, password, email, grade } = req.body;
    try {
      console.log(username, password, email, grade);

      // Required inputs exist
      if (!username || !email || !password || !grade) {
        throw badRequestErr("All fields are required");
      }

      // Input validation
      switch (true) {
        case !usernameRegex.test(username):
          throw badRequestErr("Username must have at least 6 characters");
        case !emailRegex.test(email):
          throw badRequestErr("Invalid email format");
        case !passwordRegex.test(password):
          throw badRequestErr(
            "Password must contain at least one uppercase letter, one number, and be 6 characters or longer"
          );
        default:
          // All validations passed, proceed with further logic
          break;
      }

      // validate user and create User instance. returns user object with hashed password
      const newUser = await createUser(username, email, password, grade);
      console.log(3);
      // save user to database
      await newUser.save();
      console.log(4);

      // create token and sent to client
      if (newUser) {
        const token = await createJwtToken(newUser);
        console.log("token created");
        // success
        return res.status(201).json({
          token: await createJwtToken(newUser),
          username: newUser.username,
          _id: newUser._id,
        });
      } else {
        throw internalServerErr("User creation failed");
      }
    } catch (error) {
      sendErrResp(res, error);
    }
  });

export default router;
