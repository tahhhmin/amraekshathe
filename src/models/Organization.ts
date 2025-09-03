import mongoose from 'mongoose';

const OrganizationSchema = new mongoose.Schema({
    // Info Given by Oauth
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
    
    // Account Type Definition
    accountType: {
        type: String,
        default: 'organization'
    },
    
    // Organization Details by user
    organizationName: {
        type: String,
        required: true
    },

    // Dynamic Project Informations
    projects: [{
        projectId: {
            type: String,
            required: true
        }
    }],
    
    // Dynamic Volunteer Informations
    volunteers: [{
        volunteerId: {
            type: String,
            required: true
        },
        role: {
            type: String,
            default: 'volunteer'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
}, {
    timestamps: true
});

export default mongoose.models.Organization || mongoose.model('Organization', OrganizationSchema);