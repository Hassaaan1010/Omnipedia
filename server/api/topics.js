import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Topics route reached.");
});

export default router;
