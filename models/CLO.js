// models/CLO.js
import mongoose from 'mongoose';

const CloSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  plo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PLO' }],
  description: { type: String, required: true },
});

export default mongoose.models.CLO || mongoose.model('CLO', CloSchema);
