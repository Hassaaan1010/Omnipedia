import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Folders route reached.");
});

export default router;
