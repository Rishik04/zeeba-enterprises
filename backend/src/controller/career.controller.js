import express from "express";
import { createJob, getAllJob } from "../services/career.service.js";
import { updateProjectStatusById } from "../services/project.service.js";

const careerRouter = express.Router();

careerRouter.post("/create-job", async (req, res) => {
  try {
    const job = await createJob(req.body);
    res.status(201).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

careerRouter.get("/all-job", async (req, res) => {
  try {
    const jobs = await getAllJob();
    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

careerRouter.post("/apply/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    const projects = await updateProjectStatusById(id, status);
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default careerRouter;
