import Subject from "../models/subject.js";
import Topic from "../models/topic.js";
import { badRequestErr } from "../utils/errorHandling.js";

const nameRegex = /^[a-zA-Z_][a-zA-Z0-9_]*(\s+[a-zA-Z_][a-zA-Z0-9_]*)*$/;

export const createSubject = async (userId, subjectName, topics) => {
  // check if subject already exists
  const existing = await Subject.findOne({ name: subjectName });

  if (existing) {
    throw badRequestErr(`${subjectName} already exists.`);
  } else {
    // normalize input
    const normalizedSubjectName = subjectName.trim().toLowerCase();

    topics = topics.map((element) => element.trim().toLowerCase()); // Normalize each topic

    // remove duplicates
    topics = [...new Set(topics)];
    // filter topics based on regex
    topics = topics.filter((ele) => nameRegex.test(ele)); // Reassign filtered topics

    // make new subject instance
    const newSubject = new Subject({
      userId: userId,
      name: subjectName,
      topics: [],
    });

    const savedSubject = await newSubject.save();
    console.log("saved subject instance : ", savedSubject);

    // transforms topics array into topic objects array
    const topicDocs = topics.map((topicName) => ({
      name: topicName,
      subjectId: savedSubject._id,
    }));

    // create topics in db
    const createdTopics = await Topic.insertMany(topicDocs);

    console.log(createdTopics, typeof createdTopics);
    // add topicIds to the
    const topicIds = createdTopics.map((topic) => topic._id);
    console.log("topics list", topicIds);
    savedSubject.topics = topicIds;

    // update subject with topics list
    await savedSubject.save();

    console.log("saved subject", savedSubject);
    // success response
    return "Subject created successfully";
  }
};
