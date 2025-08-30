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
        isAdmin: Boolean,
    }, {
        timestamps: true
});

export default mongoose.models.Volunteer || mongoose.model('Volunteer', VolunteerSchema);