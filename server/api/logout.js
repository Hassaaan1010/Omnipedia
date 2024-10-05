import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  console.log("User logged out.");
  res.send("Logout route reached.");
});

export default router;
