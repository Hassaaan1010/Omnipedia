import express from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";

const router = express.Router();
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /.{6,}/;

router.get("/", (req, res) => {
  return res.send("Regester route reached.");
});

router.post("/", async (req, res) => {
  let { username, password, email, grade } = req.body;
  try {
    console.log(username, password, email, grade);

    // Required inputs exist
    if (!username || !email || !password || !grade) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Input validation
    switch (true) {
      case !emailRegex.test(email):
        return res.status(400).json({ message: "Invalid email format" });
      case !passwordRegex.test(password):
        return res.status(400).json({
          message:
            "Password must contain at least one uppercase letter, one number, and be 6 characters or longer",
        });
      case !usernameRegex.test(username):
        return res
          .status(400)
          .json({ message: "Username must have at least 6 characters" });
      default:
        // All validations passed, proceed with further logic
        break;
    }
  } catch (error) {
    res
      .status(error.status)
      .json({ err: `Error validating input: ${error.message}` });
  }

  try {
    // check if user already exists
    console.log(1);
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    // Bcrypt password before saving it to the database
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      username: username.trim(), // Trim username for extra spaces
      email: email.toLowerCase().trim(), // Sanitize email
      password: hashedPassword, // Store hashed password
      grade: grade.trim(),
    });

    // save user to database
    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ err: `Error registering input: ${error.message}` });
  }
});

export default router;
