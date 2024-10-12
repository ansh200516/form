// models/AssessmentStrategy.js
import mongoose from 'mongoose';

const AssessmentStrategySchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.AssessmentStrategy || mongoose.model('AssessmentStrategy', AssessmentStrategySchema);