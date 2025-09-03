import mongoose from 'mongoose';

const JoinRequestSchema = new mongoose.Schema({
    requestby: {
        type: String,
        enum: ['Organization', 'Volunter'],
        required: true,
    },
    volunteerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Volunteer',
        required: true,
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
    },
    projectId: {
        type: String,
        ref: 'Project'
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    role: {
        type: String,
        required: false,
        default: 'volunteer'
    },
    message: {
        type: String,
        maxlength: 500,
        trim: true
    },
}, {
    timestamps: true
});

export default mongoose.models.JoinRequest || mongoose.model('JoinRequest', JoinRequestSchema);