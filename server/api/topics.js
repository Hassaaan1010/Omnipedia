import express from "express";

const router = express.Router();

router
  .get("/", (req, res) => {
    res.send("Topics route reached.");
  })
  .post("/", async (req, res) => {
    try {
      // Define seed variables (example data)
      const seedTopics = [
        {
          name: "Quantum Physics",
          subjectId: "670103c5e4db1bfda5913301",
          posts: [],
          llm_content: null, // Assuming there's no associated LLM content at seeding
        },
        {
          name: "Kinematics",
          subjectId: "670103c5e4db1bfda5913301",
          posts: [],
          llm_content: null, // Assuming there's no associated LLM content at seeding
        },
        {
          name: "Gravitation",
          subjectId: "670103c5e4db1bfda5913301",
          posts: [],
          llm_content: null, // Assuming there's no associated LLM content at seeding
        },
        {
          name: "Software Engineering",
          subjectId: "670103c5e4db1bfda5913302",
          posts: [],
          llm_content: null, // Assuming there's no associated LLM content at seeding
        },
        {
          name: "Web Development",
          subjectId: "670103c5e4db1bfda5913302",
          posts: [],
          llm_content: null, // Assuming there's no associated LLM content at seeding
        },
      ];

      // Create and save each topic
      const createdTopics = await Topic.insertMany(seedTopics);
      res.status(201).json({
        message: "Topics created successfully",
        topics: createdTopics,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating topics", error });
    }
  });

export default router;
