import mongoose from "mongoose";
const { Schema, model } = mongoose;

const topicSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  subjectId: {
    type: Schema.Types.ObjectId,
    ref: "Subject", // Assuming you have a Subject model
    required: true,
  },
  posts: [
    {
      type: Schema.Types.ObjectId, // Array of post IDs
      ref: "Post",
      default: [],
    },
  ],
  llm_content: {
    type: Schema.Types.ObjectId, // Link to an LLM-generated post (assuming a post model)
    ref: "Post",
  },
});

const Topic = model("Topic", topicSchema);
export default Topic;
