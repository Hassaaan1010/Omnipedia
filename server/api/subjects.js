import express from "express";
import { createSubject } from "../data/subject_data.js";
import {
  badRequestErr,
  notFoundErr,
  sendErrResp,
} from "../utils/errorHandling.js";
import { apiLimiter } from "../middleware/rateLimiter.js";
import { authorizeToken } from "../middleware/jwtAuthorizer.js";
import Subject from "../models/subject.js";
import User from "../models/user.js";
import Topic from "../models/topic.js";
import OmniPost from "../models/omnipost.js";
import { isObjectIdOrHexString } from "mongoose";
import { ObjectId } from "mongodb";

const router = express.Router();
const nameRegex = /^[a-zA-Z_][a-zA-Z0-9_]*(\s+[a-zA-Z_][a-zA-Z0-9_]*)*$/;

router
  .get("/", apiLimiter, async (req, res) => {
    console.log("request recieved at subjects/ get");

    // fetch all subjects
    const allSubjects = await Subject.find({});
    console.log(allSubjects);

    res.status(200).json({ subjects: allSubjects });

    try {
    } catch (error) {
      sendErrResp(res, { status: error.status, message: error.message });
    }
  })
  .get("/getFollowing/:userId", apiLimiter, async (req, res) => {
    try {
      console.log("req at subjects/getFollowing/:userId");
      let { userId } = req.params;
      userId = userId.trim();

      // Validate the userId
      if (!isObjectIdOrHexString(userId)) {
        throw badRequestErr("Invalid userId");
      }

      // Fetch the user's followingSubjects
      const user = await User.findOne({ _id: userId }, "followingSubjects");

      if (!user) {
        throw badRequestErr("User not found");
      }

      // Extract followingSubjects array
      const followedIds = user.followingSubjects;

      // Find the subjects the user is following
      const followedSubjects = await Subject.find({
        _id: { $in: followedIds },
      });

      // console.log(followedSubjects);
      res.status(200).json({ followedSubjects });
    } catch (error) {
      sendErrResp(res, { status: error.status, message: error.message });
    }
  })

  .post(
    "/changeFollowing/:id",
    apiLimiter,
    authorizeToken,
    async (req, res) => {
      const { id } = req.params;

      const subjectId = req.body.subjectId;
      let following = req.body.following;
      console.log("change following reached :", id, subjectId, following);
      try {
        if (following) {
          const updateUser = await User.findByIdAndUpdate(id, {
            $pull: { followingSubjects: subjectId },
          });
        } else {
          const following = await User.findByIdAndUpdate(id, {
            $push: { followingSubjects: subjectId },
          });
        }
        following = !following;

        res.status(204).json({ following });
      } catch (error) {
        sendErrResp(res, { status: error.status, message: error.message });
      }
    }
  )
  .get("/create", apiLimiter, authorizeToken, (req, res) => {
    console.log("reached sub/create");
    res.status(200).json({ authorized: true });
  })
  .post("/create", apiLimiter, authorizeToken, async (req, res) => {
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
      const subjectId = await createSubject(userId, subjectName, topics);

      return res.status(201).json({
        message: "Subject created successfully",
        subjectId: subjectId,
      });
    } catch (error) {
      console.log(error);
      sendErrResp(res, { status: error.status, message: error.message });
    }
  })

  .get("/:id", apiLimiter, async (req, res) => {
    const subjectId = req.params.id;
    const requesterId = req.headers.userid;
    let follows = false;
    console.log("reached subejcts:id route");
    let owner = false;
    // the subject item is enough to render the subject/:id page
    // the topics id are links to the topics/:id components
    // the omniposts are list of omni_posts that are to be rendered
    try {
      // get following status of user for subject
      if (requesterId && isObjectIdOrHexString(requesterId)) {
        const userFollowingSubjects = await User.findOne(
          { _id: requesterId },
          "followingSubjects"
        );

        // Convert subjectId to ObjectId for comparison
        const subjectObjectId = new ObjectId(subjectId);

        if (
          userFollowingSubjects.followingSubjects.some((subject) =>
            subject.equals(subjectObjectId)
          )
        ) {
          console.log("User follows subject.");
          follows = true;
        } else {
          console.log("User doesnt follow subject");
          follows = false;
        }
      } else if (requesterId) {
        console.log("user id invalid.");
        throw badRequestErr("Invalid requester.");
      } else {
      }
      console.log("follows : : ", follows);
      // we have to get the subject of id subject_id and return two items, Owner flag and subject item.
      const fetchedSubject = await Subject.findOne({ _id: subjectId });
      const topicIds = fetchedSubject.topics;
      const omnipostIds = fetchedSubject.omniposts;

      if (!fetchedSubject) {
        throw notFoundErr("Subject Not Found");
      }

      // fetch the list of topics that match the topic IDs
      const fetchedTopics = await Topic.find(
        { _id: { $in: topicIds } },
        "name"
      );

      const fetchedOmniposts = await OmniPost.find(
        {
          _id: { $in: omnipostIds },
        },
        "title"
      );

      // the userId can be compared to requesterId and flag Owner.
      owner = requesterId === fetchedSubject.userId.toString();

      console.log("following ? ? ", follows);
      // llm_content will not show up in db req until it points to a valid post
      res.status(200).json({
        subject: fetchedSubject,
        fetchedTopics: fetchedTopics,
        fetchedOmniposts: fetchedOmniposts,
        owner: owner,
        following: follows,
      });
    } catch (error) {
      console.log(error);
      sendErrResp(res, { status: error.status, message: error.message });
    }
  });

export default router;
