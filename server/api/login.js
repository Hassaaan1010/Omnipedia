import express from "express";
import { authenticateUser, getUserByEmail } from "../data/user_data.js";
import { createJwtToken } from "../middleware/jwt.js";
const router = express.Router();

router.get("/", (req, res) => {
  console.log(req.body);
  res.send("Login route reached.");
});

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/", async (req, res) => {
  let { email, password } = req.body;

  // normalise email
  email = email.trim().toLowerCase();
  try {
    //  validate input
    switch (true) {
      case !email || !password:
        return res.status(400).json({ message: "All fields are required" });

      case !emailRegex.test(email):
        return res.status(400).json({
          message: "Invalid email",
        });

      case !passwordRegex.test(password):
        return res.status(400).json({
          message: "Invalid Password",
        });
      default:
        break;
    }
    console.log("validation complete");
    // input validation error
  } catch (error) {
    return res
      .status(error.status)
      .json({ message: `Error in validation: ${error.message}` });
  }
  try {
    // returns the user, if email and password match
    const authenticatedUser = await authenticateUser(email, password);
    console.log("user authenticated");

    // if user authenticated, return token
    if (authenticatedUser) {
      const token = await createJwtToken(authenticatedUser);
      console.log("token recieved");
      return res
        .status(200) // 200 successful login
        .json({
          token: token,
          username: authenticatedUser.username,
          userId: authenticatedUser._id,
        });
    } else {
      throw { status: 401, message: "Could not authenticate user" };
    }

    // authentication error
  } catch (error) {
    return res
      .status(401)
      .json({ message: `Error in authentication: ${error.message}` });
  }
});

export default router;
