// /server/models/OmniPost.js

import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Define the OmniPost schema
const omniPostSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Assuming there's a User model
      required: true,
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject", // Assuming you have a Subject model
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    grade: {
      type: String,
      enum: ["graduate", "undergraduate", "high school", "middle school"],
      required: true,
    },
    textContent: {
      type: String,
      required: true,
    },
    linkUrls: {
      type: [String], // Array of URLs
      default: [],
    },
    files: {
      type: [String], // Array of file paths or URLs
      default: [],
    },
    likes: {
      type: [Schema.Types.ObjectId], // Array of user IDs who liked the post
      ref: "User",
      default: [],
    },
    dislikes: {
      type: [Schema.Types.ObjectId], // Array of user IDs who disliked the post
      ref: "User",
      default: [],
    },
    reported: {
      type: [Schema.Types.ObjectId], // Array of user IDs who reported the post
      ref: "User",
      default: [],
    },
  },
  { timestamps: true }
); // Automatically adds createdAt and updatedAt fields

const OmniPost = model("OmniPost", omniPostSchema);

export default OmniPost;
