import express from "express";
import {
  createProject,
  getAllProjects,
  updateProjectDetails,
  updateProjectStatusById,
} from "../services/project.service.js";
import multer from "multer";

const projectRouter = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

projectRouter.post(
  "/create-project",
  upload.array("images", 4),
  async (req, res) => {
    try {
      const imagePaths = req.files.map((file) => file.path);
      const project = await createProject(req.body, imagePaths);
      res.status(201).json(project);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

projectRouter.get("/all-project", async (req, res) => {
  try {
    const projects = await getAllProjects();
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

projectRouter.post("/:id/update-status", async (req, res) => {
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

projectRouter.put(
  "/update/:id",
  upload.array("images", 6), // Allow up to 6 new images
  async (req, res) => {
    try {
      const id = req.params.id;
      const updates = req.body;

      // Get paths of newly uploaded files
      const newImagePaths = req.files ? req.files.map((file) => file.path) : [];

      const updatedProject = await updateProjectDetails(
        id,
        updates,
        newImagePaths
      );

      res.status(200).json(updatedProject);
    } catch (error) {
      console.error("Update Error:", error);
      res.status(500).json({ error: "Server error while updating project" });
    }
  }
);

// export const getProjectByIdController = async (req, res) => {
//   try {
//     const project = await getProjectById(req.params.id);
//     if (!project) return res.status(404).json({ error: "Project not found" });
//     res.status(200).json(project);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

export default projectRouter;
