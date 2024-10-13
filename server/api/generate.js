import { apiLimiter } from "../middleware/rateLimiter.js";
import { authorizeToken } from "../middleware/jwtAuthorizer.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import {
  badRequestErr,
  notFoundErr,
  sendErrResp,
} from "../utils/errorHandling.js";
import Topic from "../models/topic.js";
import express from "express";

const router = express.Router();

router.get("/desc", async (req, res) => {
  try {
    const prompt =
      "Write a short easy to understand description of Discrete maths";
    const apiKey = `${process.env.GEMINI_API_KEY}`; // Replace with your actual API key
    const maxTokens = 150; // Set the maximum number of tokens for the response

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          maxOutputTokens: maxTokens, // Optional: set the max tokens
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("resposne", response);

    // Extract and send the generated text back in the response
    const generatedText = response.data.candidates[0].content.parts[0].text;
    res.json({ description: generatedText });
  } catch (error) {
    console.log(error);
  }
});

export default router;

// const axios = require('axios');

// router.get("/description", async (req, res) => {
//     try {

//     } catch (error) {
//         console.error("Error generating content:", error);
//         res.status(500).send("Error generating content");
//     }
// });
