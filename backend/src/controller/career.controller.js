import express from "express";
import {
  applyJobById,
  createJob,
  getAllJob,
  updateJobById,
} from "../services/career.service.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/resumes/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/msword" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only .pdf, .doc, and .docx formats allowed!"));
    }
  },
});

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

// Update Job Route
careerRouter.put("/update-job/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const updatedJob = await updateJobById(id, updates);

    if (!updatedJob) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.status(200).json(updatedJob);
  } catch (error) {
    console.error("Update Job Error:", error);
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

careerRouter.post("/apply/:id", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Resume file is required" });
    }
    const id = req.params.id;
    const applicatnts = req.body;
    const apply = await applyJobById(id, applicatnts, req.file.path);
    res.status(200).json(apply);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// careerRouter.

export default careerRouter;
