import lunr from "lunr";
import Subject from "../models/subject.js";

// for searching by desc and returning name, change field to desc and ref to id, name (??)
// current searches by name and returns id list

let idx;

const initializeSubjectsIndexes = async () => {
  let subjects = await Subject.find();
  idx = lunr(function () {
    this.ref("_id");
    this.field("name");
    subjects.forEach((subject) => {
      this.add(subject);
    });
  });
};

const addToSubjectIdx = (newSubject) => {
  idx.add(newSubject);
};

const searchSubjectIndex = (query) => {
  if (idx) {
    return idx.search(query);
  }
  return [];
};

export { initializeSubjectsIndexes, addToSubjectIdx, searchSubjectIndex };
