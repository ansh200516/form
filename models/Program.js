// models/Program.js
import mongoose from 'mongoose';

const ProgramSchema = new mongoose.Schema({
  programCode: { type: String, required: true, unique: true },
  // Add additional program fields as needed
});

export default mongoose.models.Program || mongoose.model('Program', ProgramSchema);
