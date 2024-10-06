import mongoose from "mongoose";
const { Schema, model } = mongoose;

const subjectSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  topics: [
    {
      type: Schema.Types.ObjectId, // Array of topic IDs
      ref: "Topic",
      default: [],
    },
  ],
  omniposts: [
    {
      type: Schema.Types.ObjectId, // Array of omnipost IDs
      ref: "Omnipost",
      default: [],
    },
  ],
  llm_content: {
    type: Schema.Types.ObjectId, // Link to omnipost (assuming a post model)
    ref: "Omnipost",
  },
});

const Subject = model("Subject", subjectSchema);
export default Subject;
