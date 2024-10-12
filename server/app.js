import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import connect_database from "./config/mongoose.js";
import routerNode from "./api/index.js";
dotenv.config();

import { initializeSubjectsIndexes } from "./indexes/subjectIndex.js";
import { initializeTopicsIndexes } from "./indexes/topicIndex.js";

const port = process.env.PORT;
const app = express();
const cors_options = {
  origin: `http://localhost:${process.env.CLIENT_PORT}`,
  optionsSuccessStatus: 200,
};

morgan.token("customDate", () => {
  const currentDate = new Date().toISOString();
  return currentDate;
});
app.use(
  morgan(
    ":method :url :status :response-time ms - :res[content-length] :customDate"
  )
);

const logRequestDetails = (req, res, next) => {
  const currentDateTime = new Date().toLocaleString(); // Get current date and time
  console.log("---- Incoming Request ----");
  console.log(`Date and Time: ${currentDateTime}`);
  console.log(`Route: ${req.method} ${req.originalUrl}`);
  console.log("Headers:", req.headers);
  if (req.body) {
    console.log("Body:", req.body);
  } else {
    console.log("Body: No body provided");
  }
  console.log("--------------------------");
  next(); // Move to the next middleware or route handler
};
app.use(logRequestDetails);

app.use(cors(cors_options));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
routerNode(app);

(async () => {
  try {
    await connect_database();
    await initializeSubjectsIndexes();
    await initializeTopicsIndexes();
    app.listen(port, () => {
      console.log(`Started running port at`, port);
    });
  } catch (error) {
    console.log("Issue connecting to server/mongodb.", error);
  }
})();
