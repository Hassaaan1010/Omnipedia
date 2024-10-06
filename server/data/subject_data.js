import Subject from "../models/subject.js";
import Topic from "../models/topic.js";

export const createSubject = async (userId, subjectName, topics) => {
  // check if subject already exists
  if (Subject.findOne({ name: subjectName })) {
    throw badRequestErr(`${subjectName} already exists.`);
  } else {
    // normalize input
    subjectName = subjectName.trim().toLowercase();
    topics.forEach((element) => {
      element.trim().toLowercase();
    });
    topics.filter((ele) => {
      return nameRegex.test(ele);
    });
    topics = [...new Set(topics)];

    // make new subject instance
    const newSubject = new Subject({
      userId: userId,
      name: subjectName,
      topics: topics,
    });

    const savedSubject = await newSubject.save();

    // transforms topics array into topic objects array
    const topicDocs = topics.map((topicName) => ({
      name: topicName,
      subjectId: savedSubject._id,
    }));

    // create topics in db
    const createdTopics = Topic.insertMany(topicDocs);

    // add topicIds to the
    const topicIds = createdTopics.map((topic) => topic._id);
    console.log("topics list", topicIds);
    savedSubject.topics = topicIds;

    // update subject with topics list
    await savedSubject.save();

    // success response
    const returnObject = {
      message: "Subject and topics created successfully",
      subject: savedSubject,
      topics: createdTopics,
    };
    console.log(returnObject);

    return returnObject;
  }
};
