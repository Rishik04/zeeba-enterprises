import ProjectModel from "../model/project.js";
import fs from "fs"; // Required for file deletion
import path from "path"; // Required for file deletion

export const createProject = async (projectData, imagePaths) => {
  const featuresArray = projectData.features.split(",");

  const project = await ProjectModel.create({
    ...projectData,
    image: imagePaths,
    features: featuresArray,
  });
  return project;
};

export const getAllProjects = async () => {
  return await ProjectModel.find().sort({ createdAt: -1 });
};

export const updateProjectStatusById = async (id, status) => {
  const project = await ProjectModel.findById(id);
  project.status = status;
  await project.save();
  return project;
};

export const updateProjectDetails = async (id, data, newImagePaths) => {
  const project = await ProjectModel.findById(id);
  if (!project) {
    throw new Error("Project not found");
  }

  // 1. Handle Basic Fields
  project.title = data.title || project.title;
  project.type = data.type || project.type;
  project.description = data.description || project.description;
  project.location = data.location || project.location;
  project.value = data.value || project.value;
  project.startDate = data.startDate || project.startDate;
  project.completionDate = data.completionDate || project.completionDate;

  // 2. Handle Features (Sent as JSON string from frontend)
  if (data.features) {
    try {
      // Frontend sends: '["Feature 1", "Feature 2"]'
      project.features = JSON.parse(data.features);
    } catch (e) {
      // Fallback if sent as comma-separated string
      project.features = data.features.split(",");
    }
  }

  // 3. Handle Image Logic
  let currentImages = project.image || [];

  // A. Handle Removed Images
  if (data.removedImages) {
    const removedImages = JSON.parse(data.removedImages); // Parse JSON string array

    // Filter out removed images from the database array
    currentImages = currentImages.filter((img) => !removedImages.includes(img));

    // Optional: Delete the actual files from the 'uploads' folder
    removedImages.forEach((imagePath) => {
      // Construct absolute path to file
      // Note: adjust 'process.cwd()' logic depending on your folder structure
      const fullPath = path.join(process.cwd(), imagePath);

      fs.unlink(fullPath, (err) => {
        if (err) console.error(`Failed to delete file: ${fullPath}`, err);
        else console.log(`Deleted file: ${fullPath}`);
      });
    });
  }

  // B. Add New Images
  // Combine remaining existing images with new uploaded images
  project.image = [...currentImages, ...newImagePaths];

  // 4. Save
  await project.save();
  return project;
};
