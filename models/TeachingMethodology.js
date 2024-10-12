// models/TeachingMethodology.js
import mongoose from 'mongoose';

const TeachingMethodologySchema = new mongoose.Schema(
  {
    clo: { type: String, required: true }, // e.g., "CLO1"
    methodology: { type: String, required: true }, // e.g., "Lecture-Based"
  },
  { timestamps: true }
);

export default mongoose.models.TeachingMethodology || mongoose.model('TeachingMethodology', TeachingMethodologySchema);