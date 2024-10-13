import axios from "axios";
import dotenv from "dotenv";
import { marked } from "marked";
import Topic from "../models/topic.js";
import { isObjectIdOrHexString } from "mongoose";
import { badRequestErr, internalServerErr } from "../utils/errorHandling.js";

dotenv.config();

const nameRegex = /^[a-zA-Z][a-zA-Z0-9_ ]*$/; // Allows spaces

const getDescription = async (topicId, topicName) => {
  const prompt = `Write a short formal but understandable description of ${topicName}`;
  const apiKey = `${process.env.GEMINI_API_KEY}`; // Replace with your actual API key
  const maxTokens = 400; // Set the maximum number of tokens for the response

  //   validation
  topicId = topicId.trim();
  topicName = topicName.trim();
  if (
    !topicId ||
    !topicName ||
    !isObjectIdOrHexString(topicId) ||
    topicId == "" ||
    topicName == "" ||
    !nameRegex.test(topicName)
  ) {
    throw badRequestErr("Invalid topicName/topicId");
  }

  //   fetch existing llm_content
  const fetchedDescription = await Topic.findById(topicId, "llm_content");

  console.log("fetched :", fetchedDescription);

  if (!fetchedDescription.llm_content) {
    let description;
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

      const response = await axios.post(
        url,
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
      console.log("description had to be generated.");

      //   description = response?.data?.candidates[0]?.content?.parts[0]?.text;

      if (response.data.candidates && response.data.candidates.length > 0) {
        description =
          response.data.candidates[0].content.parts[0].text ||
          "No description yet"; // Fallback if empty

        description = marked(description); // Convert Markdown to HTML
      } else {
        throw internalServerErr("No candidates returned from the API.");
      }
    } catch (error) {
      console.log(error);
      console.log("there was an error generating description");
      throw internalServerErr(error.message);
    }

    try {
      await Topic.findByIdAndUpdate(topicId, {
        $set: { llm_content: description },
      });

      return description;
    } catch (error) {
      throw internalServerErr(error.message);
    }
  } else {
    // desc already in db
    console.log("description was fetched from db.");
    return fetchedDescription.llm_content;
  }
};

export { getDescription };
