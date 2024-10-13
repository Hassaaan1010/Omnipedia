import express from "express";
import User from "../models/user.js";
import Folder from "../models/folder.js";
import {
  createFolder,
  addPostToFolder,
  removePostFromFolder,
  checkBookmarked,
  createFolderAndSave,
  getPosts,
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

      const { userId, postId } = req.query; // Extract query params
      console.log("asdfsa", userId, postId);
      try {
        const { isBookmarked, folderId } = await checkBookmarked(
          userId,
          postId
        );
        res.status(200).json({ isBookmarked, folderId2: folderId }); //   POSSIBLE ISSUE WITH FOLDER2 CHECK CLIENT SIDE ATTRIBUTES CHECK
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
      const { postId, folderId, userId } = req.body;
      console.log(postId, folderId, userId);
      if (
        !isObjectIdOrHexString(postId) ||
        !isObjectIdOrHexString(folderId) ||
        !isObjectIdOrHexString(userId)
      ) {
        throw badRequestErr("invalid data sent");
      }
      const message = await addPostToFolder(postId, folderId, userId);
      res.status(201).json({ message: message });
    } catch (error) {
      console.log(error);
      sendErrResp(res, { status: error.status, message: error.message });
    }
  })
  .post("/removePost/", apiLimiter, authorizeToken, async (req, res) => {
    console.log("post REMOVE post to existing folder reached");
    try {
      const { postId, userId, folderId } = req.body;
      console.log(postId, userId, folderId);
      if (!isObjectIdOrHexString(postId) || !isObjectIdOrHexString(folderId)) {
        throw badRequestErr("invalid data sent");
      }
      console.log("cleared undef validation");

      const message = await removePostFromFolder(postId, userId, folderId);
      res.status(201).json({ message: message });
    } catch (error) {
      console.log(error);
      sendErrResp(res, { status: error.status, message: error.message });
    }
  })
  .post("/createAndAdd/", apiLimiter, authorizeToken, async (req, res) => {
    try {
      console.log("post create new folder add post reached");

      // i need folder name, user id, and post id.
      console.log("BODY RECIEVED", req.body);
      let { folderName, postId, userId } = req.body;

      const createdFolder = await createFolderAndSave(
        folderName,
        postId,
        userId
      );
      res.status(201).json({
        message: "Post saved to new folder successfully",
        newFolder: createdFolder,
      });
    } catch (error) {
      console.log(error);
      sendErrResp(res, { status: error.status, message: error.message });
    }
  })
  .get("/:folderId", apiLimiter, async (req, res) => {
    try {
      console.log("get posts by folder id reached");
      let folderId = req.params.folderId;
      console.log("folder Id", folderId);

      const fetchedPosts = await getPosts(folderId);

      res
        .status(200)
        .json({ message: "folder content found and returned", fetchedPosts });
    } catch (error) {
      console.log(error);
      sendErrResp(res, { status: error.status, message: error.message });
    }
  });

export default router;
