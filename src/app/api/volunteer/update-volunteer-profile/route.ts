import { NextRequest, NextResponse } from 'next/server';
import Volunteer from '@/models/Volunteer';
import dbConnect from '@/lib/connectDB';

// Define types for the response
interface UpdateVolunteerResponse {
    message: string;
    volunteer?: any;
    isAccountCompleted?: boolean;
    errors?: Array<{ field: string; message: string }>;
    field?: string;
    error?: string;
}

// Define types for validation error
interface ValidationError extends Error {
    name: 'ValidationError';
    errors: Record<string, { path: string; message: string }>;
}

// Define types for MongoDB duplicate key error
interface MongoError extends Error {
    code: number;
    keyPattern: Record<string, number>;
}

// Type guard functions
function isValidationError(error: unknown): error is ValidationError {
    return (error as ValidationError).name === 'ValidationError';
}

function isMongoError(error: unknown): error is MongoError {
    return typeof error === 'object' && error !== null && 'code' in error;
}

export async function PUT(request: NextRequest) {
    try {
        await dbConnect();

        // Get data from request body
        const { volunteerId, ...updateData } = await request.json();
        
        console.log('Received update request for:', volunteerId);
        console.log('Update data keys:', Object.keys(updateData));

        // Validate volunteerId
        if (!volunteerId || typeof volunteerId !== 'string') {
            return NextResponse.json(
                { message: 'Volunteer ID is required' },
                { status: 400 }
            );
        }

        // Find the volunteer
        const volunteer = await Volunteer.findById(volunteerId);
        if (!volunteer) {
            return NextResponse.json(
                { message: 'Volunteer not found' },
                { status: 404 }
            );
        }

        // Clean the update data to remove undefined/null values that might cause issues
        const cleanedUpdateData = Object.fromEntries(
            Object.entries(updateData).filter(([key, value]) => {
                // Keep the value if it's not undefined, null, or empty string for non-required fields
                if (value === undefined || value === null) return false;
                // For nested objects, ensure they're not empty
                if (typeof value === 'object' && !Array.isArray(value)) {
                    return Object.keys(value).length > 0;
                }
                return true;
            })
        );

        console.log('Cleaned update data:', cleanedUpdateData);

        // Define required fields for account completion
        const requiredFields = [
            'username',
            'dateOfBirth',
            'phoneNumber',
            'gender',
            'location',
            'address',
            'city',
            'state',
            'country',
            'zipCode'
        ];

        // Update the volunteer with provided data
        const updatedVolunteer = await Volunteer.findByIdAndUpdate(
            volunteerId,
            { 
                $set: cleanedUpdateData
            },
            { 
                new: true, 
                runValidators: true 
            }
        );

        if (!updatedVolunteer) {
            return NextResponse.json(
                { message: 'Volunteer not found after update' },
                { status: 404 }
            );
        }

        // Check if account should be marked as completed
        const isCompleted = requiredFields.every(field => {
            if (field === 'location') {
                return updatedVolunteer.location && 
                       Array.isArray(updatedVolunteer.location) && 
                       updatedVolunteer.location.length === 2 &&
                       updatedVolunteer.location[0] !== null && 
                       updatedVolunteer.location[1] !== null &&
                       updatedVolunteer.location[0] !== 0 &&
                       updatedVolunteer.location[1] !== 0;
            }
            return updatedVolunteer[field] && 
                   updatedVolunteer[field].toString().trim() !== '';
        });

        console.log('Account completion check:', {
            isCompleted,
            currentStatus: updatedVolunteer.isAccountCompleted
        });

        // Update isAccountCompleted if necessary
        if (isCompleted && !updatedVolunteer.isAccountCompleted) {
            await Volunteer.findByIdAndUpdate(
                volunteerId,
                { $set: { isAccountCompleted: true } }
            );
            updatedVolunteer.isAccountCompleted = true;
        }

        // Remove sensitive data before sending response
        const responseData = updatedVolunteer.toObject();
        delete responseData.googleId;

        return NextResponse.json({
            message: 'Profile updated successfully',
            volunteer: responseData,
            isAccountCompleted: updatedVolunteer.isAccountCompleted
        });

    } catch (error: unknown) {
        console.error('Error updating volunteer profile:', error);
        
        if (isValidationError(error)) {
            const validationErrors = Object.values(error.errors).map(err => ({
                field: err.path,
                message: err.message
            }));
            console.log('Validation errors:', validationErrors);
            return NextResponse.json(
                {
                    message: 'Validation error',
                    errors: validationErrors
                },
                { status: 400 }
            );
        }

        if (isMongoError(error) && error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return NextResponse.json(
                {
                    message: `${field} already exists`,
                    field
                },
                { status: 400 }
            );
        }

        // Handle other errors
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json(
            { 
                message: 'Internal server error',
                error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
            },
            { status: 500 }
        );
    }
}