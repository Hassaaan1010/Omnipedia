import express from "express";
import { createSubject } from "../data/subject_data.js";
import { sendErrResp } from "../utils/errorHandling.js";
import { apiLimiter } from "../middleware/rateLimiter.js";
import { authorizeToken } from "../middleware/jwtAuthorizer.js";

const router = express.Router();
const nameRegex = /^[a-zA-Z_][a-zA-Z0-9_]*(\s+[a-zA-Z_][a-zA-Z0-9_]*)*$/;

router
  .get("/", apiLimiter, authorizeToken, (req, res) => {
    res.status(200).json({ authorized: true });
  })
  .post("/create", async (req, res) => {
    try {
      // called by createSubject subjects/create on client
      console.log(req.body);
      const { userId, subjectName, topics } = req.body;

      // validate input
      switch (true) {
        case !userId | !subjectName | !topics:
          throw badRequestErr("Fields can not be left empty");
        case !nameRegex.test(subjectName):
          throw badRequestErr("Invalid subject name");
        default:
          break;
      }

      // create subject and topics
      const subejctObject = await createSubject(userId, subjectName, topics);

      res.status(201).json(subejctObject);
    } catch (error) {
      sendErrResp(res);
    }
  });

export default router;
