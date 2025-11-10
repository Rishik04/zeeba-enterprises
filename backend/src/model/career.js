import mongoose from "mongoose";

const CareerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      enum: [
        "Construction",
        "Railways",
        "Logistics",
        "Engineering",
        "Administration",
        "Safety",
      ],
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["Full-time", "Contract", "Internship"],
      default: "Full-time",
    },

    experience: {
      type: String,
      enum: ["0-2", "2-5", "5+"],
      default: "0-2",
    },

    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },

    postedOn: {
      type: Date,
      default: Date.now,
    },

    highlights: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

const CareerModel = mongoose.model("Career", CareerSchema);
export default CareerModel;
