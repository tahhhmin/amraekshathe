import mongoose from 'mongoose';

const OrganizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: { 
    type: String, 
    unique: true,
    required: true 
  },
  image: String,
  googleId: String,
  organizationName: {
    type: String,
    required: true
  },
  description: String,
  website: String,
  phone: String,
  address: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  accountType: {
    type: String,
    default: 'organization'
  }
}, {
  timestamps: true
});

export default mongoose.models.Organization || mongoose.model('Organization', OrganizationSchema);