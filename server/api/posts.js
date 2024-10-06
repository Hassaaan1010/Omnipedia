import express from "express";

const router = express.Router();

router
  .get("/", (req, res) => {
    res.send("Posts route reached.");
  })
  .post("/", (req, res) => {
    const express = require("express");
    const router = express.Router();
    const Post = require("./models/Post"); // Adjust the path according to your structure

    // GET route for posts
    router.get("/", (req, res) => {
      res.send("Posts route reached.");
    });

    // POST route for seeding posts
    router.post("/", async (req, res) => {
      try {
        // Define seed variables (example data)
        const seedPosts = [
          {
            userId: "60c72b2f9b1d5c0015f645f7", // Replace with actual user ID
            subjectId: "60c72b2f9b1d5c0015f645f8", // Replace with actual subject ID
            topicId: "60c72b2f9b1d5c0015f645f9", // Replace with actual topic ID
            title: "Understanding Quantum Mechanics",
            grade: "undergrad",
            textContent:
              "This post discusses the principles of quantum mechanics...",
            linkUrls: [
              "http://example.com/quantum",
              "http://example.com/physics",
            ],
            files: [],
          },
          {
            userId: "60c72b2f9b1d5c0015f645f7", // Replace with actual user ID
            subjectId: "60c72b2f9b1d5c0015f645f8", // Replace with actual subject ID
            topicId: "60c72b2f9b1d5c0015f645f9", // Replace with actual topic ID
            title: "Introduction to Linear Algebra",
            grade: "senior_high",
            textContent: "This post covers the basics of linear algebra...",
            linkUrls: ["http://example.com/algebra"],
            files: [],
          },
        ];

        // Create and save each post
        const createdPosts = await Post.insertMany(seedPosts);
        res
          .status(201)
          .json({ message: "Posts created successfully", posts: createdPosts });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating posts", error });
      }
    });
  });

export default router;
