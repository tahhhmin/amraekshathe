// src/app/api/volunteer/join-request/send/route.ts

import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import JoinRequest from '@/models/JoinRequest';
import Organization from '@/models/Organization';  
import Volunteer from '@/models/Volunteer';

// TypeScript interfaces for better type safety
interface JoinRequestBody {
    volunteerId: string;
    organizationId: string;
    projectId?: string;
    message?: string;
}

interface MongoError extends Error {
    code?: number;
}

interface ValidationError extends Error {
    name: string;
    errors: Record<string, { message: string }>;
}

export async function POST(request: NextRequest) {
    try {
        // Connect to MongoDB if not already connected
        if (mongoose.connection.readyState !== 1) {
            if (!process.env.MONGODB_URI) {
                throw new Error('MONGODB_URI is not defined');
            }
            await mongoose.connect(process.env.MONGODB_URI);
        }

        const body: JoinRequestBody = await request.json();
        const { volunteerId, organizationId, projectId, message } = body;

        // Validate required fields
        if (!volunteerId || !organizationId) {
            return NextResponse.json({
                success: false,
                message: 'Volunteer ID and Organization ID are required'
            }, { status: 400 });
        }

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(volunteerId) || 
            !mongoose.Types.ObjectId.isValid(organizationId)) {
            return NextResponse.json({
                success: false,
                message: 'Invalid ID format'
            }, { status: 400 });
        }

        // Check if volunteer exists
        const volunteer = await Volunteer.findById(volunteerId);
        if (!volunteer) {
            return NextResponse.json({
                success: false,
                message: 'Volunteer not found'
            }, { status: 404 });
        }

        // Check if organization exists
        const organization = await Organization.findById(organizationId);
        if (!organization) {
            return NextResponse.json({
                success: false,
                message: 'Organization not found'
            }, { status: 404 });
        }

        // Check if volunteer is already part of this organization
        const isAlreadyMember = organization.volunteers.some(
            (vol: { volunteerId: string }) => vol.volunteerId.toString() === volunteerId
        );
        
        if (isAlreadyMember) {
            return NextResponse.json({
                success: false,
                message: 'You are already a member of this organization'
            }, { status: 400 });
        }

        // Check if there's already a pending join request
        const existingRequest = await JoinRequest.findOne({
            volunteerId: volunteerId,
            organizationId: organizationId,
            status: 'pending'
        });

        if (existingRequest) {
            return NextResponse.json({
                success: false,
                message: 'You already have a pending join request for this organization'
            }, { status: 400 });
        }

        // Validate message length if provided
        if (message && message.length > 500) {
            return NextResponse.json({
                success: false,
                message: 'Message cannot exceed 500 characters'
            }, { status: 400 });
        }

        // Create new join request
        const joinRequest = new JoinRequest({
            requestby: 'Volunter', // Note: keeping the typo from your schema
            volunteerId: volunteerId,
            organizationId: organizationId,
            projectId: projectId || null,
            status: 'pending',
            role: 'volunteer',
            message: message?.trim() || null
        });

        // Save the join request
        await joinRequest.save();

        // Populate the join request with volunteer and organization details for response
        const populatedRequest = await JoinRequest.findById(joinRequest._id)
            .populate('volunteerId', 'name email image')
            .populate('organizationId', 'organizationName email');

        return NextResponse.json({
            success: true,
            message: 'Join request sent successfully',
            data: {
                joinRequest: populatedRequest
            }
        }, { status: 201 });

    } catch (error: unknown) {
        console.error('Error creating join request:', error);
        
        // Handle duplicate key error
        if (error && typeof error === 'object' && 'code' in error) {
            const mongoError = error as MongoError;
            if (mongoError.code === 11000) {
                return NextResponse.json({
                    success: false,
                    message: 'A join request already exists'
                }, { status: 400 });
            }
        }

        // Handle validation errors
        if (error && typeof error === 'object' && 'name' in error) {
            const validationError = error as ValidationError;
            if (validationError.name === 'ValidationError') {
                const validationErrors = Object.values(validationError.errors).map(
                    (err: { message: string }) => err.message
                );
                return NextResponse.json({
                    success: false,
                    message: 'Validation error',
                    errors: validationErrors
                }, { status: 400 });
            }
        }

        return NextResponse.json({
            success: false,
            message: 'Internal server error'
        }, { status: 500 });
    }
}

// Handle unsupported methods
export async function GET() {
    return NextResponse.json({
        success: false,
        message: 'Method not allowed'
    }, { status: 405 });
}

export async function PUT() {
    return NextResponse.json({
        success: false,
        message: 'Method not allowed'
    }, { status: 405 });
}

export async function DELETE() {
    return NextResponse.json({
        success: false,
        message: 'Method not allowed'
    }, { status: 405 });
}