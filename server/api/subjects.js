import express from "express";
import { createSubject } from "../data/subject_data.js";
import { badRequestErr, sendErrResp } from "../utils/errorHandling.js";
import { apiLimiter } from "../middleware/rateLimiter.js";
import { authorizeToken } from "../middleware/jwtAuthorizer.js";
import Subject from "../models/subject.js";
import Topic from "../models/topic.js";

const router = express.Router();
const nameRegex = /^[a-zA-Z_][a-zA-Z0-9_]*(\s+[a-zA-Z_][a-zA-Z0-9_]*)*$/;

router
  .get("/create", apiLimiter, authorizeToken, (req, res) => {
    console.log("reached sub/create");
    res.status(200).json({ authorized: true });
  })
  .post("/create", async (req, res) => {
    try {
      // called by createSubject subjects/create on client
      console.log(req.body);
      let { userId, subjectName, topics } = req.body;
      // topics is in string format '[]'
      if (typeof topics === "string") {
        topics = JSON.parse(topics);
      }
      console.log(typeof subjectName);

      console.log(userId, subjectName, topics);
      // validate input
      switch (true) {
        case !userId || !subjectName || !topics:
          throw badRequestErr("Fields can not be left empty");
        case !nameRegex.test(subjectName):
          throw badRequestErr("Invalid subject name");

        default:
          break;
      }
      // create subject and topics
      const message = await createSubject(userId, subjectName, topics);

      return res.status(201).json({ message: message });
    } catch (error) {
      console.log(error);
      sendErrResp(res, { status: error.status, message: error.message });
    }
  })

  .get("/:id", apiLimiter, async (req, res) => {
    const subjectId = req.params.id;
    const requesterId = req.headers.userId;

    let owner = false;
    // the subject item is enough to render the subject/:id page
    // the topics id are links to the topics/:id components
    // the omniposts are list of omni_posts that are to be rendered
    try {
      // we have to get the subject of id subject_id and return two items, Owner flag and subject item.
      const fetchedSubject = await Subject.findOne({ _id: subjectId });

      const topicIds = fetchedSubject.topics;

      // fetch the list of topics that match the topic IDs
      const fetchedTopics = await Topic.find(
        { _id: { $in: topicIds } },
        "name"
      );

      // the userId can be compared to requesterId and flag Owner.
      owner = requesterId === fetchedSubject.userId.toString();

      res
        .status(200)
        .json({ subject: fetchedSubject, fetchedTopics, owner: owner });
    } catch {
      throw badRequestErr("Invalid subject");
    }
  });

export default router;
