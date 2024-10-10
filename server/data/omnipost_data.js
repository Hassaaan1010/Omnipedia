import OmniPost from "../models/omnipost.js";
import Subject from "../models/subject.js";
import User from "../models/user.js";
import { internalServerErr, badRequestErr } from "../utils/errorHandling.js";

const linkRegex = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?(\/[^\s]*)?$/i;
const nameRegex = /^[a-zA-Z_0-9][a-zA-Z0-9_]*(\s+[a-zA-Z_][a-zA-Z0-9_]*)*$/;

const createOmnipost = async (
  subjectId,
  title,
  grade,
  textContent,
  userId,
  links
) => {
  if (!title || !grade || !subjectId || !textContent || !userId) {
    throw badRequestErr("Required fields unfilled");
  }

  //   trim title and links
  title = title.trim();
  links = links.map((element) => element.trim());

  if (!nameRegex.test(title)) {
    throw badRequestErr("Improper title");
  }

  //   validate links
  for (let i = 0; i < links.length; i++) {
    if (!linkRegex.test(links[i])) {
      throw badRequestErr("Invalid link");
    }
  }
  console.log("validation done");

  console.log("links :", links);
  const newOmnipost = new OmniPost({
    userId: userId,
    subjectId: subjectId,
    title: title,
    grade: grade,
    textContent: textContent,
    linkUrls: links,
  });
  console.log(newOmnipost);

  //   // write post to db
  try {
    const savedOmnipost = await newOmnipost.save();
    console.log("saved post", savedOmnipost);
    // update user posts
    const updatedUser = await User.findByIdAndUpdate(
      newOmnipost.userId,
      { $push: { omniposts: savedOmnipost._id } }, // Append the post ID to the user's posts array
      { new: true } // Return the updated document
    );

    // update subject omniposts
    const updatedSubject = await Subject.findByIdAndUpdate(
      newOmnipost.subjectId,
      { $push: { omniposts: savedOmnipost._id } },
      { new: true }
    );

    console.log("upd user: ", updatedUser);
    return [savedOmnipost._id, updatedSubject.subjectId];
  } catch (error) {
    console.log(error);
    throw internalServerErr("Error: could not save post and update user.");
  }
};

export { createOmnipost };
