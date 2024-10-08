import Post from "../models/post.js";
import User from "../models/user.js";
import { internalServerErr, badRequestErr } from "../utils/errorHandling.js";

const linkRegex = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?(\/[^\s]*)?$/i;
const nameRegex = /^[a-zA-Z_0-9][a-zA-Z0-9_]*(\s+[a-zA-Z_][a-zA-Z0-9_]*)*$/;

const createPost = async (
  topicId,
  title,
  grade,
  textContent,
  userId,
  links
) => {
  if (!title || !grade || !topicId || !textContent || !userId) {
    throw badRequestErr("Required fields unfilled");
  }

  //   trim title and links
  title = title.trim();
  links.forEach((element) => {
    return element.trim();
  });

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

  //
  const newPost = new Post({
    userId: userId,
    topicId: topicId,
    title: title,
    grade: grade,
    textContent: textContent,
    links: links,
  });
  console.log(newPost);

  // write post to db
  try {
    const savedPost = await newPost.save();
    console.log("saved post", savedPost);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { posts: savedPost._id } }, // Append the post ID to the user's posts array
      { new: true } // Return the updated document
    );

    console.log("upd user: ", updatedUser);
    return savedPost._id;
  } catch (error) {
    throw internalServerErr("Error: could not save post and update user.");
  }
};

export { createPost };
