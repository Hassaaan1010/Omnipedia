import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Subjects route reached.");
});

export default router;
