// models/CCDP.js
import mongoose from 'mongoose';

const CCDPSchema = new mongoose.Schema(
  {
    clo: { type: String, required: true }, // Reference to CLO, e.g., "CLO1"
    lessonNo: { type: Number, required: true },
    topics: { type: String, required: true },
    hours: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.CCDP || mongoose.model('CCDP', CCDPSchema);