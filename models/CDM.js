// models/CDM.js
import mongoose from 'mongoose';

const CDMSchema = new mongoose.Schema(
  {
    lecture: { type: String, required: true }, // e.g., "Interactive Lectures"
    completionStatus: { type: String, required: true }, // e.g., "Continuous Assessment"
    projectBasedLearning: { type: String, required: true }, // e.g., "Mini Projects"
    practicalLab: { type: String, required: true }, // e.g., "None"
    others: { type: String }, // Optional
  },
  { timestamps: true }
);

export default mongoose.models.CDM || mongoose.model('CDM', CDMSchema);