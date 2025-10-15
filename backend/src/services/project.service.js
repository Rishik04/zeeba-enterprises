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

export const updateProjectStatusById = async (id, status) => {
  const project = await ProjectModel.findById(id);
  project.status = status;
  await project.save();
  return project;
};

// /**
//  * Get project by ID
//  */
// export const getProjectById = async (id) => {
//   return await Project.findById(id);
// };
