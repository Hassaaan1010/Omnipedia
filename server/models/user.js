import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema({
  role: {
    type: String,
    enum: ["user", "admin", "moderator"], // Enum for user roles
    required: true,
    default: "user",
  },
  //   userId: {
  //     type: String,
  //     required: true,
  //     unique: true,
  //   },
  username: {
    type: String,
    required: True,
    unique: True,
  },
  email: {
    type: String,
    required: True,
    unique: True,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please fill a valid email address"],
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Password must be at least 6 characters long"],
    match: [
      /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/,
      "Password must contain at least one uppercase letter, one number, and be 6 characters or longer",
    ],
  },
  posts: [
    {
      type: Schema.Types.ObjectId, // Array of post IDs
      ref: "Post", // Reference to the Post model
      default: [],
    },
  ],
  folders: [
    {
      type: Schema.Types.ObjectId, // Array of folder IDs
      ref: "Folder", // Reference to the Folder model
      default: [],
    },
  ],
  mySubjects: [
    {
      type: Schema.Types.ObjectId, // Array of subject IDs
      ref: "Subject", // Assuming you have a Subject model
      default: [],
    },
  ],
  followingSubjects: [
    {
      type: Schema.Types.ObjectId, // Array of subject IDs
      ref: "Subject", // Assuming you have a Subject model
      default: [],
    },
  ],
});

// userSchema.pre("save", function (next) {
//   if (!this.userId) {
//     this.userId = this._id.toString(); // Generates the userId from MongoDB's _id
//   }
//   next();
// });

const User = model("User", userSchema);

export default User;
