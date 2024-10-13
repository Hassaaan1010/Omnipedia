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
    type: String, // Link to an LLM-generated description
    default: undefined,
  },
});

const Topic = model("Topic", topicSchema);
export default Topic;
