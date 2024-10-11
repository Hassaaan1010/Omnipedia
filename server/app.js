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

app.use(cors(cors_options));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
routerNode(app);

morgan.token("customDate", () => {
  const currentDate = new Date().toISOString();
  return currentDate;
});
app.use(
  morgan(
    ":method :url :status :response-time ms - :res[content-length] :customDate"
  )
);

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
