import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User", // This references the User model
    required: true,
  },
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
});

const User = model("User", userSchema);

export default User;
