import { isObjectIdOrHexString } from "mongoose";
import Folder from "../models/folder.js";
import User from "../models/user.js";
import { badRequestErr } from "../utils/errorHandling.js";
import { ObjectId } from "mongodb";

const nameRegex = /^[a-zA-Z_0-9][a-zA-Z0-9_]*(\s+[a-zA-Z_][a-zA-Z0-9_]*)*$/;

const createFolder = async (userId, folderName) => {
  // validation

  if (!userId || !folderName) {
    throw badRequestErr("Fields cannot be left empty");
  }
  userId = userId.trim();
  folderName = folderName.trim();

  if (!isObjectIdOrHexString(userId) || !nameRegex.test(folderName)) {
    throw badRequestErr(" Invalid field values");
  }

  const userIdObject = new ObjectId(userId);

  // Check if folder name already exists for the user
  const existingFolder = await Folder.findOne({
    ownerId: userIdObject,
    name: folderName,
  });

  if (existingFolder) {
    throw badRequestErr(`${folderName} already exists`);
  }

  console.log("object", userIdObject);
  //   create new folder object
  const newFolder = new Folder({
    ownerId: userIdObject,
    name: folderName,
  });

  // create new folder
  const createdFolder = await newFolder.save();

  // update user folder list
  const updatedUser = await User.findByIdAndUpdate(userId, {
    $push: { folders: newFolder._id },
  });

  return createdFolder;
};

const addPostToFolder = async (postId, folderId, userId) => {
  try {
    //find folders with their posts
    const user = await User.findOne({ _id: userId }, "folders").populate({
      path: "folders",
      select: "posts",
    });

    //if the post already exists in any of users folders
    const postExists = user.folders.some((folder) =>
      folder.posts.includes(postId)
    );

    if (postExists) {
      throw new Error("Post already exists in another folder.");
    }

    await Folder.findByIdAndUpdate(
      folderId,
      { $push: { posts: postId } },
      { new: true }
    );

    return "Post saved to folder successfully";
  } catch (error) {
    throw new Error(error.message || "Failed to save post to folder");
  }
};

const removePostFromFolder = async (postId, userId, folderId) => {
  try {
    //  implement after saved state persisting
    const updatedFolder = await Folder.findByIdAndUpdate(
      folderId,
      {
        $pull: { posts: postId },
      },
      { new: true }
    );

    console.log(updatedFolder);

    return "Post removed from  folder successfully";
  } catch (error) {
    throw new Error("Failed to remove post from folder");
  }
};

const checkBookmarked = async (userId, postId) => {
  if (!userId || !postId) {
    throw badRequestErr("Fields cannot be left empty");
  }
  userId = userId.trim();
  postId = postId.trim();

  if (!isObjectIdOrHexString(userId) || !isObjectIdOrHexString(postId)) {
    throw badRequestErr(" Invalid field values");
  }

  try {
    // Fetch user's folders with their post arrays
    const fetchedUser = await User.findOne(
      { _id: userId },
      { folders: 1 }
    ).populate({
      path: "folders",
      select: "posts", // Fetch only the posts field from each folder
    });

    const fetchedFolders = fetchedUser?.folders || [];
    console.log("folders fetched", fetchedFolders);

    // Check if postId exists in any of the fetched folders
    const existingFolder = fetchedFolders.find((folder) =>
      folder.posts.includes(postId)
    );

    if (existingFolder) {
      return {
        isBookmarked: true,
        folderId: existingFolder._id,
      };
    } else {
      return {
        isBookmarked: false,
        folderId: null,
      };
    }
  } catch (error) {
    throw error;
  }
};

const createFolderAndSave = async (folderName, postId, userId) => {
  // validate name
  folderName = folderName.trim();
  postId = postId.trim();
  userId = userId.trim();

  if (
    !isObjectIdOrHexString(postId) ||
    !isObjectIdOrHexString(userId) ||
    !nameRegex.test(folderName)
  ) {
    throw badRequestErr("Invalid data sent. Check folder name");
  }

  // create a folder and update user. then add the postId to the folder

  const userIdObject = new ObjectId(userId);
  // Check if folder name already exists for the user
  const existingFolder = await Folder.findOne({
    ownerId: userIdObject,
    name: folderName,
  });

  if (existingFolder) {
    throw badRequestErr(`${folderName} already exists`);
  }

  //   create new folder object with posts having the  postId that is to be saved
  const newFolder = new Folder({
    ownerId: userIdObject,
    name: folderName,
    posts: [postId],
  });

  // create new folder
  const createdFolder = await newFolder.save();

  // update user folder list
  const updatedUser = await User.findByIdAndUpdate(userId, {
    $push: { folders: newFolder._id },
  });

  return createdFolder;
};

const getPosts = async (folderId) => {
  folderId = folderId.trim();
  if (!folderId || !isObjectIdOrHexString(folderId)) {
    console.log("bad folderId sent");
    throw badRequestErr("Invalid folder requested");
  }

  //   returns folder object that has .posts attribute which is array of posts, each post ke _id, likes, dislikes, title, grade
  const fetchedPosts = await Folder.findOne(
    { _id: folderId },
    "posts"
  ).populate({
    path: "posts",
    select: "_id likes dislikes title grade",
  });
  console.log(fetchedPosts);
  return fetchedPosts.posts;
};

export {
  createFolder,
  addPostToFolder,
  removePostFromFolder,
  checkBookmarked,
  createFolderAndSave,
  getPosts,
};
