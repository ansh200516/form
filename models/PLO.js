// models/PLO.js
import mongoose from 'mongoose';

const PloSchema = new mongoose.Schema({
  programCode: { type: String, required: true },
  description: { type: String, required: true },
});

export default mongoose.models.PLO || mongoose.model('PLO', PloSchema);
