// models/profile.js
import mongoose, { Schema, models } from 'mongoose';

const ProfileSchema = new Schema({
  user: {
    type: String,
    unique: true,
  },
  name: String,
  college: String,
  year: Number,
  branch: String,
  enroll: String,
  phone: String
});

export const Profile = models.Profile || mongoose.model('Profile', ProfileSchema);
