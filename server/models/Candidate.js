const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  jobTitle: { type: String, required: true },
  skills: { type: [String], default: [] },
  location: { type: String },
  profileSource: { type: String },
  profileUrl: { type: String },
  imageUrl: { type: String },
  totalYearsExperience: { type: Number, default: 0 },
  experienceLevel: { type: String, enum: ['Entry', 'Mid', 'Senior'], default: 'Mid' }
}, { timestamps: true });

module.exports = mongoose.model('Candidate', candidateSchema);
