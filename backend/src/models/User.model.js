import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  jobRole: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  yearsOfExperience: {
    type: Number,
    required: true,
  },
  collegeStudent: {
    type: Boolean,
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
})

module.exports = mongoose.model('User', userSchema);