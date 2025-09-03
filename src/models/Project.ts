import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
    ownerOrganisationId: [{
        type: String,
        required: true
    }],
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    coordinates: [Number],
    volunteers: [{
        volunteerId: String,
        role: String,
        score: { type: Number, default: 0 }
    }],
    status: {
        type: String,
        default: 'draft'
    }
}, {
    timestamps: true
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);