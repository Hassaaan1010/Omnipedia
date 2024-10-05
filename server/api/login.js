import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  console.log(req.body);
  res.send("Login route reached.");
});

export default router;
