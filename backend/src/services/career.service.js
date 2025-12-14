import ApplicantModel from "../model/applicatnts.js";
import CareerModel from "../model/career.js";

export const createJob = async (jobData) => {
  const job = await new CareerModel(jobData).save();
  return job;
};

export const getAllJob = async () => {
  return await CareerModel.find().sort({ createdAt: -1 });
};

export const updateJobById = async (id, jobData) => {
  const job = await CareerModel.findByIdAndUpdate(
    id,
    {
      $set: jobData, // Updates only the fields provided in jobData
    },
    { new: true }
  );

  return job;
};

export const applyJobById = async (id, jobData, resumePath) => {
  const job = await CareerModel.findById(id);
  if (job) {
    let updatedJobData = {
      ...jobData,
      jobTitle: job.title,
      resume: resumePath,
    };
    const applicant = await new ApplicantModel(updatedJobData).save();
    return applicant;
  }
  return null;
};
