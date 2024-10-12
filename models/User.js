// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  kerberosId: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Ensure this line exists
  // Add additional user fields as needed
});

export default mongoose.models.User || mongoose.model('User', UserSchema);