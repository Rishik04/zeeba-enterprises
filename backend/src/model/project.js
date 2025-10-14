import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    value: {
      type: String,
      required: false,
      trim: true,
    },

    startDate: {
      type: String,
      required: true,
    },

    completionDate: {
      type: String,
      required: true,
    },

    image: {
      type: [String],
      default: [],
    },

    features: {
      type: [String],
      default: [],
    },
    teams: {
      type: Number,
      required: false,
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "ongoing",
    },
  },
  { timestamps: true }
);

const ProjectModel = mongoose.model("Project", projectSchema);
export default ProjectModel;
