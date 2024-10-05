// /server/models/Folder.js

import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Define the Folder schema
const folderSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    posts: [
      {
        type: Schema.Types.ObjectId, // Array of post IDs
        ref: "Post", // Reference to the Post model
        default: [],
      },
    ],
  },
  { timestamps: true }
);

const Folder = model("Folder", folderSchema);

export default Folder;
