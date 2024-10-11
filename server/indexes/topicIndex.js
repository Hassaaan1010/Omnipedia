import lunr from "lunr";
import Topic from "../models/topic.js";

let idx;

const initializeTopicsIndexes = async () => {
  const topics = await Topic.find();
  idx = lunr(function () {
    this.ref("_id");
    this.field("name");
    topics.forEach((topic) => {
      this.add(topic);
    }, this);
  });
};

const addToTopicIdx = (newTopic) => {
  if (idx) {
    idx.add(newTopic);
  }
};

const searchTopicIndex = (query) => {
  if (idx) {
    return idx.search(query);
  }
  return [];
};

export { initializeTopicsIndexes, addToTopicIdx, searchTopicIndex };
