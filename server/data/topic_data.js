import { isObjectIdOrHexString } from "mongoose";
import Subject from "../models/subject.js";
import Topic from "../models/topic.js";
import { badRequestErr, internalServerErr } from "../utils/errorHandling.js";

const nameRegex = /^[a-zA-Z_][a-zA-Z0-9_]*(\s+[a-zA-Z_][a-zA-Z0-9_]*)*$/;

const createTopic = async (topicName, subjectId) => {
  topicName = topicName.trim();

  if (!topicName || !subjectId || topicName == "") {
    throw badRequestErr("Fields can not be left empty");
  }

  if (!nameRegex.test(topicName) || !isObjectIdOrHexString(subjectId)) {
    throw badRequestErr(" Invalid data entered");
  }

  // check if name already exists in subject topics,
  const fetchedSubject = await Subject.findOne({ _id: subjectId }).populate({
    path: "topics",
    select: "name", //selects name form each topic
  });

  const topicsArray = fetchedSubject.topics || [];

  console.log("topics arr", topicsArray);
  const sameNameTopics = topicsArray.filter((topicObject) => {
    return topicObject.name.toLowerCase() === topicName.toLowerCase();
  });

  if (sameNameTopics.length !== 0) {
    throw badRequestErr("topic already exists");
  }

  try {
    const newTopic = new Topic({
      name: topicName,
      subjectId: subjectId,
    });

    await newTopic.save();

    await Subject.findByIdAndUpdate(subjectId, {
      $push: { topics: newTopic._id },
    });

    return newTopic;
  } catch (error) {
    throw internalServerErr("Failed to create topic");
  }

  //create new topic
};

export { createTopic };
