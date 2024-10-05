import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  console.log(req.body);
  return res.send("Regester route reached.");
});

router.post("/", (req, res) => {
  console.log(req.body);
  return res.send("req.body recieved");
});

export default router;
