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

  console.log("object", userIdObject);
  //   create new folder object
  const newFolder = new Folder({
    ownerId: userIdObject,
    name: folderName,
  });

  // update user folder list
  const updatedUser = await User.findOneAndUpdate(
    { _id: userId },
    {
      $push: { folders: newFolder._id },
    }
  );

  const createdFolder = await newFolder.save();
  return createdFolder;
};

export { createFolder };
