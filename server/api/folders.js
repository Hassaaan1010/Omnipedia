import express from "express";
import User from "../models/user.js";
import Folder from "../models/folder.js";
import {
  createFolder,
  addPostToFolder,
  removePostFromFolder,
  checkBookmarked,
} from "../data/folder_data.js";
import { badRequestErr, sendErrResp } from "../utils/errorHandling.js";
import { authorizeToken } from "../middleware/jwtAuthorizer.js";
import { apiLimiter } from "../middleware/rateLimiter.js";
import { isObjectIdOrHexString } from "mongoose";
const router = express.Router();

// asdf = 123;
router
  .get("/all/:userId", apiLimiter, async (req, res) => {
    console.log("Folders get allroute reached.");
    const userId = req.params.userId;
    console.log(userId);

    // get all folder Ids of user
    try {
      const fetchedUser = await User.findOne({ _id: userId }, "folders");

      const fetchedFolderIds = fetchedUser?.folders || [];
      console.log("folder ids fetched", fetchedFolderIds);

      const fetchedFolders = await Folder.find({
        _id: { $in: fetchedFolderIds },
      });
      // can be combined into one trip to db.

      console.log("folders fetched", fetchedFolders);

      res.status(200).json({ folders: fetchedFolders });
    } catch (error) {
      sendErrResp(res, { status: error.status, message: error.message });
    }
  })
  .post("/create", apiLimiter, authorizeToken, async (req, res) => {
    console.log("post create new folder reached");
    // get userId, folder name
    const userId = req.body.userId;
    const folderName = req.body.folderName;
    console.log(userId, folderName);
    try {
      const createdFolder = await createFolder(userId, folderName);
      res.status(201).json({ createdFolder });
    } catch (error) {
      sendErrResp(res, { status: error.status, message: error.message });
    }
  })
  .get(
    "/checkBookmarked",
    apiLimiter,
    // authorizeToken,
    async (req, res) => {
      console.log("check bookmarked get route reached");
      console.log("P A R A M S :", req.query);

      const { userId, folderId } = req.query; // Extract query params
      console.log("asdfsa", userId, folderId);
      try {
        const isBookmarked = await checkBookmarked(userId, folderId);
        res.status(200).json({ isBookmarked });
      } catch (error) {
        console.log(error);
        sendErrResp(res, { status: error.status, message: error.message });
      }
    }
  )
  .post("/addPost", apiLimiter, authorizeToken, async (req, res) => {
    console.log("post add post to existing folder reached");
    try {
      console.log("BODY :", req.body);
      const { postId, folderId } = req.body;
      console.log(postId, folderId);
      if (!isObjectIdOrHexString(postId) || !isObjectIdOrHexString(folderId)) {
        throw badRequestErr("invalid data sent");
      }
      const message = await addPostToFolder(postId, folderId);
      res.status(201).json({ message: message });
    } catch (error) {
      sendErrResp(res, { status: error.status, message: error.message });
    }
  })
  .post("/removePost/", apiLimiter, authorizeToken, async (req, res) => {
    console.log("post REMOVE post to existing folder reached");
    try {
      const { postId, userId } = req.body;
      if (!isObjectIdOrHexString(postId) || !isObjectIdOrHexString(userId)) {
        throw badRequestErr("invalid data sent");
      }

      const message = await removePostFromFolder(postId, userId);
      res.status(201).json({ message: message });
    } catch (error) {
      sendErrResp(res, { status: error.status, message: error.message });
    }
  })
  .post("/createAndAdd/", apiLimiter, authorizeToken, async (req, res) => {
    console.log("post create new folder add post reached");
    res.sendStatus(201);
  })
  .get("/:id", apiLimiter, async (req, res) => {
    console.log("get posts by folder id reached");
    res.sendStatus(200);
  });

export default router;
