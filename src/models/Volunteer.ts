import mongoose from 'mongoose';

const VolunteerSchema = new mongoose.Schema({
        name: String,
        email: { 
            type: String, 
            unique: true,
            required: true 
        },
        image: String,
        googleId: String,

        dateOfBirth: {
            type: Date,
        },

        isAdmin: Boolean,

        organizations: [{
            organizationId: {
                type: String,
                required: true
            },
        }],
    }, {
        timestamps: true
});

export default mongoose.models.Volunteer || mongoose.model('Volunteer', VolunteerSchema);