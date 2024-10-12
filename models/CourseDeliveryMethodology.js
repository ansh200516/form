// models/CourseDeliveryMethodology.js
import mongoose from 'mongoose';

const CourseDeliveryMethodologySchema = new mongoose.Schema(
  {
    method: { type: String, required: true }, // e.g., "Lecture"
    percentage: { type: Number, required: true }, // e.g., 50
  },
  { timestamps: true }
);

export default mongoose.models.CourseDeliveryMethodology || mongoose.model('CourseDeliveryMethodology', CourseDeliveryMethodologySchema);