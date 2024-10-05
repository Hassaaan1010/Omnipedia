import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Home route reached.");
});

export default router;
