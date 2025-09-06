import React, { useState, ChangeEvent, FormEvent } from 'react';

// Define interfaces for type safety
interface Skill {
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    verified: boolean;
}

interface Availability {
    timezone: string;
    daysAvailable: string[];
    timeSlots: Array<{
        day: string;
        startTime: string;
        endTime: string;
    }>;
    hoursPerWeek: string;
    canWorkRemotely: boolean;
    maxTravelDistance: number;
}

interface SocialMedia {
    linkedin: string;
    twitter: string;
    facebook: string;
    instagram: string;
    website: string;
}

interface EmergencyContact {
    name: string;
    relationship: string;
    phoneNumber: string;
    email: string;
}

interface Preferences {
    openToProjects: boolean;
    isProfilePublic: boolean;
    receiveEmailNotifications: boolean;
    receiveSMSNotifications: boolean;
    allowContactByOrganizations: boolean;
    preferredProjectTypes: string[];
    preferredCommitment: string;
}

interface VolunteerFormData {
    username: string;
    dateOfBirth: string;
    phoneNumber: string;
    gender: string;
    bio: string;
    languages: string[];
    location: [number, number];
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    availability: Availability;
    educationLevel: string;
    institution: string;
    skills: Skill[];
    interests: string[];
    causes: string[];
    yearsOfExperience: string;
    socialMedia: SocialMedia;
    emergencyContact: EmergencyContact;
    preferences: Preferences;
}

const VolunteerProfileForm: React.FC = () => {
    const [formData, setFormData] = useState<VolunteerFormData>({
        username: '',
        dateOfBirth: '',
        phoneNumber: '',
        gender: '',
        bio: '',
        languages: [],
        location: [0, 0],
        address: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
        availability: {
            timezone: '',
            daysAvailable: [],
            timeSlots: [],
            hoursPerWeek: '',
            canWorkRemotely: true,
            maxTravelDistance: 25
        },
        educationLevel: '',
        institution: '',
        skills: [],
        interests: [],
        causes: [],
        yearsOfExperience: '',
        socialMedia: {
            linkedin: '',
            twitter: '',
            facebook: '',
            instagram: '',
            website: ''
        },
        emergencyContact: {
            name: '',
            relationship: '',
            phoneNumber: '',
            email: ''
        },
        preferences: {
            openToProjects: true,
            isProfilePublic: true,
            receiveEmailNotifications: true,
            receiveSMSNotifications: false,
            allowContactByOrganizations: true,
            preferredProjectTypes: [],
            preferredCommitment: ''
        }
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [newSkill, setNewSkill] = useState<{ name: string; level: 'beginner' | 'intermediate' | 'advanced' | 'expert' }>({ 
        name: '', 
        level: 'beginner' 
    });
    const [newInterest, setNewInterest] = useState<string>('');
    const [newLanguage, setNewLanguage] = useState<string>('');

    // Mock volunteer ID - replace with actual user ID from auth context
    const volunteerId = "68b31a6b2d5365bd39d6afc1";

    const genderOptions = ['male', 'female', 'prefer-not-to-say', 'other'] as const;
    const educationOptions = ['high-school', 'some-college', 'bachelors', 'masters', 'phd', 'other'] as const;
    const skillLevels = ['beginner', 'intermediate', 'advanced', 'expert'] as const;
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
    const causesOptions = [
        'education', 'health', 'environment', 'poverty', 'human-rights',
        'animal-welfare', 'disaster-relief', 'community-development',
        'arts-culture', 'sports-recreation', 'technology', 'other'
    ] as const;
    const projectTypes = ['one-time', 'ongoing', 'seasonal', 'event-based'] as const;
    const commitmentLevels = ['casual', 'regular', 'intensive'] as const;

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        
        if (name.includes('.')) {
            const [parent, child] = name.split('.') as [keyof VolunteerFormData, string];
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...(prev[parent] as object),
                    [child]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleLocationChange = (index: 0 | 1, value: string) => {
        const newLocation: [number, number] = [...formData.location];
        newLocation[index] = parseFloat(value) || 0;
        setFormData(prev => ({ ...prev, location: newLocation }));
    };

    const handleArrayChange = (field: keyof Pick<VolunteerFormData, 'causes'>, value: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: checked 
                ? [...(prev[field] as string[]), value]
                : (prev[field] as string[]).filter((item: string) => item !== value)
        }));
    };

    const addSkill = () => {
        if (newSkill.name.trim()) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, { ...newSkill, verified: false }]
            }));
            setNewSkill({ name: '', level: 'beginner' });
        }
    };

    const removeSkill = (index: number) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index)
        }));
    };

    const addInterest = () => {
        if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
            setFormData(prev => ({
                ...prev,
                interests: [...prev.interests, newInterest.trim()]
            }));
            setNewInterest('');
        }
    };

    const removeInterest = (interest: string) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.filter(item => item !== interest)
        }));
    };

    const addLanguage = () => {
        if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
            setFormData(prev => ({
                ...prev,
                languages: [...prev.languages, newLanguage.trim()]
            }));
            setNewLanguage('');
        }
    };

    const removeLanguage = (language: string) => {
        setFormData(prev => ({
            ...prev,
            languages: prev.languages.filter(item => item !== language)
        }));
    };

    // Clean data before sending to API
    const cleanFormData = (data: VolunteerFormData) => {
        const cleaned: any = { ...data };
        
        // Remove empty string enum values to prevent validation errors
        if (cleaned.educationLevel === '') delete cleaned.educationLevel;
        if (cleaned.gender === '') delete cleaned.gender;
        if (cleaned.yearsOfExperience === '') delete cleaned.yearsOfExperience;
        
        // Clean nested preference values
        if (cleaned.preferences?.preferredCommitment === '') {
            delete cleaned.preferences.preferredCommitment;
        }
        
        // Clean availability
        if (cleaned.availability?.hoursPerWeek === '') {
            delete cleaned.availability.hoursPerWeek;
        }
        
        // Remove empty social media fields
        Object.keys(cleaned.socialMedia || {}).forEach(key => {
            if (cleaned.socialMedia[key] === '') {
                delete cleaned.socialMedia[key];
            }
        });
        
        // Remove empty emergency contact fields
        Object.keys(cleaned.emergencyContact || {}).forEach(key => {
            if (cleaned.emergencyContact[key] === '') {
                delete cleaned.emergencyContact[key];
            }
        });
        
        return cleaned;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            // Clean the data before sending
            const cleanedData = cleanFormData(formData);
            
            const response = await fetch(`/api/volunteer/update-volunteer-profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    volunteerId,
                    ...cleanedData
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`Profile updated successfully! ${data.isAccountCompleted ? 'Account is now complete!' : 'Please fill remaining required fields to complete your profile.'}`);
            } else {
                if (data.errors) {
                    const errorMessages = data.errors.map((err: any) => `${err.field}: ${err.message}`).join(', ');
                    setMessage(`Validation errors: ${errorMessages}`);
                } else {
                    setMessage(`Error: ${data.message}`);
                }
            }
        } catch (error) {
            console.error('Submit error:', error);
            setMessage('Error updating profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Update Your Volunteer Profile</h2>
            
            {message && (
                <div className={`p-4 rounded-md mb-6 ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <section className="border-b pb-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Basic Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">Select Gender</option>
                                {genderOptions.map(option => (
                                    <option key={option} value={option}>
                                        {option.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            maxLength={500}
                            rows={3}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Tell us about yourself..."
                        />
                    </div>
                </section>

                {/* Location Information */}
                <section className="border-b pb-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Location Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                            <input
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Longitude *</label>
                            <input
                                type="number"
                                step="any"
                                value={formData.location[0]}
                                onChange={(e) => handleLocationChange(0, e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Latitude *</label>
                            <input
                                type="number"
                                step="any"
                                value={formData.location[1]}
                                onChange={(e) => handleLocationChange(1, e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>
                </section>

                {/* Languages */}
                <section className="border-b pb-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Languages</h3>
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={newLanguage}
                            onChange={(e) => setNewLanguage(e.target.value)}
                            placeholder="Add a language"
                            className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                            type="button"
                            onClick={addLanguage}
                            className="px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Add
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {formData.languages.map((language, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                {language}
                                <button
                                    type="button"
                                    onClick={() => removeLanguage(language)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </section>

                {/* Education */}
                <section className="border-b pb-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Education & Experience</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
                            <select
                                name="educationLevel"
                                value={formData.educationLevel}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select Education Level</option>
                                {educationOptions.map(option => (
                                    <option key={option} value={option}>
                                        {option.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                            <input
                                type="text"
                                name="institution"
                                value={formData.institution}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                            <input
                                type="number"
                                name="yearsOfExperience"
                                value={formData.yearsOfExperience}
                                onChange={handleInputChange}
                                min="0"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </section>

                {/* Skills */}
                <section className="border-b pb-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Skills</h3>
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={newSkill.name}
                            onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Skill name"
                            className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <select
                            value={newSkill.level}
                            onChange={(e) => setNewSkill(prev => ({ ...prev, level: e.target.value as typeof newSkill.level }))}
                            className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {skillLevels.map(level => (
                                <option key={level} value={level}>
                                    {level.charAt(0).toUpperCase() + level.slice(1)}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={addSkill}
                            className="px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            Add
                        </button>
                    </div>
                    <div className="space-y-2">
                        {formData.skills.map((skill, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                                <span className="font-medium">{skill.name}</span>
                                <span className="text-sm text-gray-600 capitalize">{skill.level}</span>
                                <button
                                    type="button"
                                    onClick={() => removeSkill(index)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Interests */}
                <section className="border-b pb-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Interests</h3>
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={newInterest}
                            onChange={(e) => setNewInterest(e.target.value)}
                            placeholder="Add an interest"
                            className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                            type="button"
                            onClick={addInterest}
                            className="px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                        >
                            Add
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {formData.interests.map((interest, index) => (
                            <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                {interest}
                                <button
                                    type="button"
                                    onClick={() => removeInterest(interest)}
                                    className="text-purple-600 hover:text-purple-800"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </section>

                {/* Causes */}
                <section className="border-b pb-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Causes You Care About</h3>
                    <div className="grid md:grid-cols-3 gap-2">
                        {causesOptions.map(cause => (
                            <label key={cause} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={formData.causes.includes(cause)}
                                    onChange={(e) => handleArrayChange('causes', cause, e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm capitalize">{cause.replace('-', ' ')}</span>
                            </label>
                        ))}
                    </div>
                </section>

                {/* Availability */}
                <section className="border-b pb-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Availability</h3>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hours Per Week</label>
                            <input
                                type="number"
                                name="availability.hoursPerWeek"
                                value={formData.availability.hoursPerWeek}
                                onChange={handleInputChange}
                                min="0"
                                max="168"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Travel Distance (miles)</label>
                            <input
                                type="number"
                                name="availability.maxTravelDistance"
                                value={formData.availability.maxTravelDistance}
                                onChange={handleInputChange}
                                min="0"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="availability.canWorkRemotely"
                                checked={formData.availability.canWorkRemotely}
                                onChange={handleInputChange}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span>Can work remotely</span>
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Available Days</label>
                        <div className="grid grid-cols-4 gap-2">
                            {daysOfWeek.map(day => (
                                <label key={day} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.availability.daysAvailable.includes(day)}
                                        onChange={(e) => {
                                            const updatedDays = e.target.checked
                                                ? [...formData.availability.daysAvailable, day]
                                                : formData.availability.daysAvailable.filter(d => d !== day);
                                            setFormData(prev => ({
                                                ...prev,
                                                availability: {
                                                    ...prev.availability,
                                                    daysAvailable: updatedDays
                                                }
                                            }));
                                        }}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm capitalize">{day}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Preferences */}
                <section className="border-b pb-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Preferences</h3>
                    <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Commitment Level</label>
                                <select
                                    name="preferences.preferredCommitment"
                                    value={formData.preferences.preferredCommitment}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select Commitment Level</option>
                                    {commitmentLevels.map(level => (
                                        <option key={level} value={level}>
                                            {level.charAt(0).toUpperCase() + level.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Project Types</label>
                            <div className="grid md:grid-cols-2 gap-2">
                                {projectTypes.map(type => (
                                    <label key={type} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.preferences.preferredProjectTypes.includes(type)}
                                            onChange={(e) => {
                                                const updatedTypes = e.target.checked
                                                    ? [...formData.preferences.preferredProjectTypes, type]
                                                    : formData.preferences.preferredProjectTypes.filter(t => t !== type);
                                                setFormData(prev => ({
                                                    ...prev,
                                                    preferences: {
                                                        ...prev.preferences,
                                                        preferredProjectTypes: updatedTypes
                                                    }
                                                }));
                                            }}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm capitalize">{type.replace('-', ' ')}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="preferences.openToProjects"
                                    checked={formData.preferences.openToProjects}
                                    onChange={handleInputChange}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span>Open to new projects</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="preferences.isProfilePublic"
                                    checked={formData.preferences.isProfilePublic}
                                    onChange={handleInputChange}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span>Make profile public</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="preferences.receiveEmailNotifications"
                                    checked={formData.preferences.receiveEmailNotifications}
                                    onChange={handleInputChange}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span>Receive email notifications</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="preferences.receiveSMSNotifications"
                                    checked={formData.preferences.receiveSMSNotifications}
                                    onChange={handleInputChange}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span>Receive SMS notifications</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="preferences.allowContactByOrganizations"
                                    checked={formData.preferences.allowContactByOrganizations}
                                    onChange={handleInputChange}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span>Allow organizations to contact me</span>
                            </label>
                        </div>
                    </div>
                </section>

                {/* Social Media */}
                <section className="border-b pb-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Social Media (Optional)</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                            <input
                                type="url"
                                name="socialMedia.linkedin"
                                value={formData.socialMedia.linkedin}
                                onChange={handleInputChange}
                                placeholder="https://linkedin.com/in/yourprofile"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                            <input
                                type="url"
                                name="socialMedia.twitter"
                                value={formData.socialMedia.twitter}
                                onChange={handleInputChange}
                                placeholder="https://twitter.com/yourusername"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                            <input
                                type="url"
                                name="socialMedia.facebook"
                                value={formData.socialMedia.facebook}
                                onChange={handleInputChange}
                                placeholder="https://facebook.com/yourprofile"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                            <input
                                type="url"
                                name="socialMedia.website"
                                value={formData.socialMedia.website}
                                onChange={handleInputChange}
                                placeholder="https://yourwebsite.com"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </section>

                {/* Emergency Contact */}
                <section className="border-b pb-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Emergency Contact (Optional)</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                name="emergencyContact.name"
                                value={formData.emergencyContact.name}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                            <input
                                type="text"
                                name="emergencyContact.relationship"
                                value={formData.emergencyContact.relationship}
                                onChange={handleInputChange}
                                placeholder="e.g., Parent, Spouse, Friend"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                type="tel"
                                name="emergencyContact.phoneNumber"
                                value={formData.emergencyContact.phoneNumber}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                name="emergencyContact.email"
                                value={formData.emergencyContact.email}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </section>

                {/* Submit Button */}
                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 px-6 rounded-md text-white font-semibold text-lg transition-colors ${
                            loading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200'
                        }`}
                    >
                        {loading ? 'Updating Profile...' : 'Update Profile'}
                    </button>
                </div>

                {/* Required Fields Note */}
                <div className="text-sm text-gray-600 text-center">
                    <p>Fields marked with * are required to complete your profile.</p>
                    <p>Required fields: Username, Date of Birth, Phone Number, Gender, Address, City, State, Country, ZIP Code, and Location coordinates.</p>
                </div>
            </form>
        </div>
    );
};

export default VolunteerProfileForm;