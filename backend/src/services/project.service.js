import ProjectModel from "../model/project.js";

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

// /**
//  * Get project by ID
//  */
// export const getProjectById = async (id) => {
//   return await Project.findById(id);
// };
