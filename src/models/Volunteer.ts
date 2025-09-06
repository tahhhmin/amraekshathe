import mongoose from 'mongoose';

const VolunteerSchema = new mongoose.Schema({
    // OAuth Information    
    name: { type: String, required: true, trim: true },
    email: { 
        type: String, 
        unique: true, 
        required: true, 
        lowercase: true, 
        trim: true 
    },
    image: String,
    googleId: String,

    // Dynamic Data
    organizations: [{
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organization',
            required: true
        },
        role: { type: String, default: 'volunteer' },
        status: { 
            type: String, 
            enum: ['active', 'completed', 'paused', 'cancelled'], 
            default: 'active' 
        }
    }],
    projects: [{
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: true
        },
        role: { type: String, default: 'volunteer' },
        status: { 
            type: String, 
            enum: ['active', 'completed', 'paused', 'cancelled'], 
            default: 'active' 
        }
    }],

    // Personal Info
    username: { 
        type: String, 
        unique: true, 
        sparse: true, 
        trim: true, 
        minlength: 3, 
        maxlength: 30 
    },
    dateOfBirth: Date,
    phoneNumber: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                return !v || /^\+?[\d\s\-\(\)]+$/.test(v);
            },
            message: 'Invalid phone number format'
        }
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'prefer-not-to-say', 'other']
    },
    bio: { type: String, maxlength: 500 },
    languages: [{ 
        type: String,
        trim: true 
    }],

    // Location & Availability
    location: {
        type: [Number], // [longitude, latitude]
        required: true
    },
    address: { 
        type: String, 
        required: [true, "Please provide address"], 
        trim: true 
    },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    zipCode: { type: String, trim: true },

    // Availability
    availability: {
        timezone: String,
        daysAvailable: [{
            type: String,
            enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        }],
        timeSlots: [{
            day: {
                type: String,
                enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
            },
            startTime: String, // Format: "HH:MM"
            endTime: String    // Format: "HH:MM"
        }],
        hoursPerWeek: { type: Number, min: 0, max: 168 },
        canWorkRemotely: { type: Boolean, default: true },
        maxTravelDistance: { type: Number, default: 25 } // in miles/km
    },

    // Education Details
    educationLevel: {
        type: String,
        enum: ['high-school', 'some-college', 'bachelors', 'masters', 'phd', 'other']
    },
    institution: { type: String, trim: true },

    // Skills & Interests
    skills: [{
        name: { type: String, required: true, trim: true },
        level: { 
            type: String, 
            enum: ['beginner', 'intermediate', 'advanced', 'expert'],
            default: 'beginner'
        },
        verified: { type: Boolean, default: false }
    }],
    interests: [{ type: String, trim: true }],
    causes: [{ 
        type: String,
        enum: [
            'education', 'health', 'environment', 'poverty', 'human-rights', 
            'animal-welfare', 'disaster-relief', 'community-development', 
            'arts-culture', 'sports-recreation', 'technology', 'other'
        ]
    }],
    yearsOfExperience: { type: Number, min: 0 },

    // Achievements
    achievements: [{
        badgeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Badge' },
        earnedAt: { type: Date, default: Date.now },
        description: String
    }],

    // Social Media
    socialMedia: {
        linkedin: String,
        twitter: String,
        facebook: String,
        instagram: String,
        website: String
    },
    emergencyContact: {
        name: String,
        relationship: String,
        phoneNumber: String,
        email: String
    },

    // Statistics Data
    stats: {
        totalHoursVolunteered: { type: Number, default: 0, min: 0 },
        totalProjectsCompleted: { type: Number, default: 0, min: 0 },
        totalOrganizationsServed: { type: Number, default: 0, min: 0 },
        averageRating: { type: Number, min: 0, max: 5 },
        totalRatings: { type: Number, default: 0, min: 0 },
        joinedDate: { type: Date, default: Date.now },
        lastActiveDate: { type: Date, default: Date.now }
    },

    // Preferences
    preferences: {
        openToProjects: { type: Boolean, default: true },
        isProfilePublic: { type: Boolean, default: true },
        receiveEmailNotifications: { type: Boolean, default: true },
        receiveSMSNotifications: { type: Boolean, default: false },
        allowContactByOrganizations: { type: Boolean, default: true },
        preferredProjectTypes: [{
            type: String,
            enum: ['one-time', 'ongoing', 'seasonal', 'event-based']
        }],
        preferredCommitment: {
            type: String,
            enum: ['casual', 'regular', 'intensive']
        }
    },

    // Server Data
    isAdmin: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isAccountCompleted: { type: Boolean, default: false }

}, {
    timestamps: true
});

// Indexes for better performance (only non-duplicate ones)
VolunteerSchema.index({ location: '2dsphere' });
VolunteerSchema.index({ 'skills.name': 1 });
VolunteerSchema.index({ causes: 1 });
VolunteerSchema.index({ isVerified: 1 });
VolunteerSchema.index({ isAccountCompleted: 1 });

export default mongoose.models.Volunteer || mongoose.model('Volunteer', VolunteerSchema);