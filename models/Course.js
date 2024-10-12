// models/Course.js
import mongoose from 'mongoose';

// Define the Course Delivery Methodology Schema as an embedded subdocument
const CourseDeliveryMethodologySchema = new mongoose.Schema({
  method: { type: String, required: true },
  percentage: { type: Number, required: true, min: 0, max: 100 },
});

const CourseSchema = new mongoose.Schema(
  {
    courseCode: { type: String, required: true, unique: true },
    courseName: { type: String, required: true },
    courseType: { type: String, required: true }, // e.g., "Core", "Elective"
    department: { type: String, required: true },
    hoursTotal: { type: Number, required: true },
    creditStructure: {
      lecture: { type: Number, required: true },
      tutorial: { type: Number, required: true },
      lab: { type: Number, required: true },
    },
    preRequisites: [{ type: String }], // Array of course codes
    courseDescription: {
      courseContents: { type: String, required: true },
      targetAudience: { type: String, required: true },
      industryRelevance: { type: String, required: true },
    },
    courseResources: [{ type: String }], // Array of bullet points
    teachingAndLearningMethods: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TeachingMethodology' }], // References
    // Remove the reference to CourseDeliveryMethodology as it's now embedded
    courseDeliveryMethodologies: [CourseDeliveryMethodologySchema], // Embedded Subdocuments
    assessmentStrategy: { type: mongoose.Schema.Types.ObjectId, ref: 'AssessmentStrategy' }, // Reference
    ccdp: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CCDP' }], // Array of CCDP references
    assessments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' }], // Array of Assessment references
    clOs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CLO' }], // Array of CLO references
    clOsToPloMappings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CLOtoPLO' }], // Array of CLOtoPLO references
    // Add other nested fields as needed
  },
  { timestamps: true }
);

// Ensure that Mongoose uses the latest schema if it already exists
export default mongoose.models.Course || mongoose.model('Course', CourseSchema);