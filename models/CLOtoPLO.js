// models/CLOtoPLO.js
import mongoose from 'mongoose';

const CLOtoPLOSchema = new mongoose.Schema(
  {
    clo: { type: String, required: true }, // e.g., "CLO1"
    plo: [{ type: String, required: true }], // e.g., ["PLO1", "PLO2"]
  },
  { timestamps: true }
);

export default mongoose.models.CLOtoPLO || mongoose.model('CLOtoPLO', CLOtoPLOSchema);