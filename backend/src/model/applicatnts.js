import mongoose from "mongoose";

const ApplicantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    experience: {
      type: String,
      enum: ["0-2", "2-5", "5+"],
      required: true
    },
    expectedCtc: {
      type: String,
      trim: true
    },
    notice: {
      type: String, // e.g., "30 days"
      trim: true
    },
    coverLetter: {
      type: String,
      trim: true
    },
    resume: {
      type: String, // Path to the uploaded file
      required: true
    },
    jobTitle: {
      type: String, // Optional: to track which job they applied for
      default: "General Application"
    },
    status: {
      type: String,
      enum: ["New", "Shortlisted", "Rejected", "Hired"],
      default: "New"
    }
  },
  { timestamps: true }
);

const ApplicantModel = mongoose.model("Applicant", ApplicantSchema);
export default ApplicantModel;