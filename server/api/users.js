import express from "express";
import { getUserById } from "../data/user_data.js";
import { sendErrResp } from "../utils/errorHandling.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    console.log("reached users/get");
    const userId = req.params.id; // '670103c5e4db1bfda5913309'
    const requesterId = req.query.requesterId; // '670103c5e4db1bfda5913309'
    const authorized = req.query.authorized === "true"; // Convert to boolean

    // get user of interest
    let [fetchedUser, owner, mySubjectsNames] = await getUserById(
      userId,
      requesterId,
      authorized
    );

    owner = authorized && owner;
    console.log("owner :", authorized, authorized && owner);
    res.status(200).json({
      user: fetchedUser,
      owner: owner,
      mySubjectsNames: mySubjectsNames,
    });
  } catch (error) {
    sendErrResp(res, { status: error.status, message: error.message });
  }
});

export default router;

//
