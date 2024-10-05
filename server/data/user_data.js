import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import {
  badRequestErr, //400
  unauthorizedErr, //401
  forbiddenErr, //403
  notFoundErr, //404
  internalServerErr, //500
} from "../utils/errorHandling.js";

dotenv.config();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;

export const createUser = async (username, email, password, grade) => {
  // try {
  // check if user already exists
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    throw badRequestErr("Username or email already exists");
  }

  // Bcrypt password before saving it to the database
  const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create a new user
  const newUser = new User({
    username: username.trim(), // Trim username for extra spaces
    email: email.toLowerCase().trim(), // Sanitize email
    password: hashedPassword, // Store hashed password
    grade: grade.trim(),
  });

  // save user to database
  await newUser.save();

  // success
  return newUser;

  // return res.status(201).json({ message: "User registered successfully" });
  // } catch (error) {
  //   console.log(`Error in creating user ${error}`);
  //   throw internalServerErr("Failed to create new user.");
  // }
};

export const getUserByEmail = async (email) => {
  try {
    // validate email
    email = email.trim();
    if (!emailRegex.test(email)) {
      throw badRequestErr("Invalid Email");
    }

    // find user in collection
    const user = await User.findOne({ email: email });

    return user;
  } catch (error) {
    console.log(`Error in finding user by email ${error}`);
    throw notFoundErr("User with matching email not found.");
  }
};

export const authenticateUser = async (email, password) => {
  // find User by email
  const user = await getUserByEmail(email);
  console.log(user);

  // validate password
  if (!passwordRegex.test(password)) {
    throw badRequestErr("Invalid password");
  }

  //   check if password correct
  if (await bcrypt.compare(password, user.password)) {
    console.log("password matches");
    return user;
  } else {
    throw unauthorizedErr("Incorrect password");
  }
};
