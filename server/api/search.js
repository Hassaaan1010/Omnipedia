// search.jshow
import express from "express";
import { searchSubjectIndex } from "../indexes/subjectIndex.js";
import { searchTopicIndex } from "../indexes/topicIndex.js";
import { badRequestErr, sendErrResp } from "../utils/errorHandling.js";
import Subject from "../models/subject.js";
import Topic from "../models/topic.js";
const router = express.Router();

router.get("/", async (req, res) => {
  //   let tokens = req.body.searchTokens;
  try {
    let query = req.query.query;
    // query = query.trim();
    console.log(query, typeof query);
    if (query) {
      let subjectSearchResults = await searchSubjectIndex(query);
      let topicSearchResults = await searchTopicIndex(query);
      subjectSearchResults = subjectSearchResults.map((elem) => elem.ref);
      topicSearchResults = topicSearchResults.map((elem) => elem.ref);

      const fetchedSubjects = await Subject.find(
        {
          _id: { $in: subjectSearchResults },
        },
        "_id name"
      );

      const fetchedTopics = await Topic.find(
        {
          _id: { $in: topicSearchResults },
        },
        "_id name subjectId"
      );

      res.status(200).json({ fetchedSubjects, fetchedTopics });
    } else {
      throw badRequestErr("Empty query");
    }
  } catch (error) {
    console.log(error);
    sendErrResp(res, { status: error.status, message: error.message });
  }
});

export default router;
