import CareerModel from "../model/career.js";
import ProjectModel from "../model/project.js";

export const createJob = async (jobData) => {
  const job = await new CareerModel(jobData).save();
  return job;
};

export const getAllJob = async () => {
  return await CareerModel.find().sort({ createdAt: -1 });
};

export const updateProjectStatusById = async (id, status) => {
  const project = await ProjectModel.findById(id);
  project.status = status;
  await project.save();
  return project;
};
