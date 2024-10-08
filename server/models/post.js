// /server/models/Post.js

import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Define the Post schema
const postSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    // subjectId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Subject", // Assuming you have a Subject model
    //   required: true,
    // },
    topicId: {
      type: Schema.Types.ObjectId,
      ref: "Topic", // Assuming you have a Topic model
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    grade: {
      type: String,
      enum: ["undergraduate", "senior_high", "high_school", "middle_school"],
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
  },
  { timestamps: true }
); // Automatically adds createdAt and updatedAt fields

const Post = model("Post", postSchema);

export default Post;
