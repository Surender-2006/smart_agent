import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  zone: { type: String },
  area: { type: String },
  houseNumber: { type: String },
  transformer: { type: String },
  lat: { type: Number },
  long: { type: Number },
  installationDate: { type: String },
  status: { type: String },
  battery: { type: String },
  signal: { type: String },
  location: { type: String }
}, { timestamps: true });

export default mongoose.model('Device', deviceSchema);
