import mongoose from "mongoose";
const { Schema, model } = mongoose;

const topicSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
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

const Topic = model("topic", topicSchema);
export default Topic;
