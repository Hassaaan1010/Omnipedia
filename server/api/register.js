import express from "express";
import {
  badRequestErr,
  unauthorizedErr,
  forbiddenErr,
  notFoundErr,
  internalServerErr,
  sendErrResp,
} from "../utils/errorHandling.js";
import { createUser } from "../data/user_data.js";

const router = express.Router();
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /.{6,}/;

router
  .get("/", (req, res) => {
    return res.send("Regester route reached.");
  })

  .post("/", async (req, res) => {
    let { username, password, email, grade } = req.body;
    try {
      console.log(username, password, email, grade);

      // Required inputs exist
      if (!username || !email || !password || !grade) {
        return badRequestErr("All fields are required");
      }

      // Input validation
      switch (true) {
        case !usernameRegex.test(username):
          return badRequestErr("Username must have at least 6 characters");
        case !emailRegex.test(email):
          return badRequestErr("Invalid email format");
        case !passwordRegex.test(password):
          return badRequestErr(
            "Password must contain at least one uppercase letter, one number, and be 6 characters or longer"
          );
        default:
          // All validations passed, proceed with further logic
          break;
      }

      // validate user and create User instance
      const newUser = await createUser(username, email, password, grade);
      console.log(3);
      // save user to database
      await newUser.save();
      console.log(4);
      // success
      return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      sendErrResp(res, error);
    }
  });

export default router;
