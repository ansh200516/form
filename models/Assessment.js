// models/Assessment.js
import mongoose from 'mongoose';

const AssessmentSchema = new mongoose.Schema(
  {
    clo: { type: String, required: true }, // Reference to CLO, e.g., "CLO1"
    assessmentType: { type: String, required: true }, // e.g., "Midterm Exam"
    assessmentMethod: { type: String, required: true }, // e.g., "Written Exam"
    assessmentDescription: { type: String, required: true },
    weight: { type: Number, required: true }, // Percentage weight towards final grade
  },
  { timestamps: true }
);

export default mongoose.models.Assessment || mongoose.model('Assessment', AssessmentSchema);