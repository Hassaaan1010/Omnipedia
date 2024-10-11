import express from "express";
import User from "../models/user.js";
import Folder from "../models/folder.js";
import { createFolder } from "../data/folder_data.js";
import { sendErrResp } from "../utils/errorHandling.js";
import { authorizeToken } from "../middleware/jwtAuthorizer.js";
import { apiLimiter } from "../middleware/rateLimiter.js";
const router = express.Router();

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
  .get("/:id", apiLimiter, async (req, res) => {
    console.log("get folders by folder id reached");
    res.send(200);
  })
  .post("/addPost/", apiLimiter, authorizeToken, async (req, res) => {
    console.log("post add post to existing folder reached");
    res.send(200);
  })
  .post("/create", apiLimiter, authorizeToken, async (req, res) => {
    console.log("post create new folder reached");
    // get userId, folder name
    const userId = req.body.userId;
    const folderName = req.body.folderName;
    console.log(userId, folderName);
    try {
      const createdFolder = createFolder(userId, folderName);
      res.status(200).json({ createdFolder });
    } catch (error) {
      sendErrResp(res, { status: error.status, message: error.message });
    }
  })
  .post("/createAndadd/", apiLimiter, authorizeToken, async (req, res) => {
    console.log("post create new folder add post reached");
    res.send(200);
  });

export default router;
