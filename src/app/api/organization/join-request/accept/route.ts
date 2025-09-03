// src/app/api/organization/join-request/accept/route.ts

import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import JoinRequest from '@/models/JoinRequest';
import Organization from '@/models/Organization';
import Volunteer from '@/models/Volunteer';

interface AcceptRequestBody {
    requestId: string;
    organizationId: string;
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

        const body: AcceptRequestBody = await request.json();
        const { requestId, organizationId } = body;

        // Validate required fields
        if (!requestId || !organizationId) {
            return NextResponse.json({
                success: false,
                message: 'Request ID and Organization ID are required'
            }, { status: 400 });
        }

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(requestId) || 
            !mongoose.Types.ObjectId.isValid(organizationId)) {
            return NextResponse.json({
                success: false,
                message: 'Invalid ID format'
            }, { status: 400 });
        }

        // Find the join request
        const joinRequest = await JoinRequest.findById(requestId)
            .populate('volunteerId', 'name email')
            .populate('organizationId', 'organizationName name email');

        if (!joinRequest) {
            return NextResponse.json({
                success: false,
                message: 'Join request not found'
            }, { status: 404 });
        }

        // Verify that the request belongs to the specified organization
        if (joinRequest.organizationId._id.toString() !== organizationId) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized: Request does not belong to this organization'
            }, { status: 403 });
        }

        // Check if request is already processed
        if (joinRequest.status !== 'pending') {
            return NextResponse.json({
                success: false,
                message: `Request has already been ${joinRequest.status}`
            }, { status: 400 });
        }

        // Start a MongoDB transaction for data consistency
        const session = await mongoose.startSession();
        
        try {
            await session.withTransaction(async () => {
                // Update the join request status to 'accepted'
                await JoinRequest.findByIdAndUpdate(
                    requestId,
                    { 
                        status: 'accepted',
                        updatedAt: new Date()
                    },
                    { session }
                );

                // Add volunteer to organization's volunteers array
                await Organization.findByIdAndUpdate(
                    organizationId,
                    {
                        $addToSet: {
                            volunteers: {
                                volunteerId: joinRequest.volunteerId._id.toString(),
                                role: joinRequest.role || 'volunteer',
                                joinedAt: new Date()
                            }
                        }
                    },
                    { session }
                );

                // Add organization to volunteer's organizations array
                await Volunteer.findByIdAndUpdate(
                    joinRequest.volunteerId._id,
                    {
                        $addToSet: {
                            organizations: {
                                organizationId: organizationId
                            }
                        }
                    },
                    { session }
                );
            });

            await session.commitTransaction();

            return NextResponse.json({
                success: true,
                message: 'Join request accepted successfully',
                data: {
                    requestId,
                    volunteerName: joinRequest.volunteerId.name,
                    organizationName: joinRequest.organizationId.organizationName,
                    role: joinRequest.role,
                    acceptedAt: new Date().toISOString()
                }
            });

        } catch (transactionError) {
            await session.abortTransaction();
            throw transactionError;
        } finally {
            await session.endSession();
        }

    } catch (error: unknown) {
        console.error('Error accepting join request:', error);
        
        // Handle validation errors
        if (error && typeof error === 'object' && 'name' in error) {
            const mongoError = error as any;
            if (mongoError.name === 'ValidationError') {
                const validationErrors = Object.values(mongoError.errors).map(
                    (err: any) => err.message
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
        message: 'Method not allowed. Use POST to accept join requests.'
    }, { status: 405 });
}

export async function PUT() {
    return NextResponse.json({
        success: false,
        message: 'Method not allowed. Use POST to accept join requests.'
    }, { status: 405 });
}

export async function DELETE() {
    return NextResponse.json({
        success: false,
        message: 'Method not allowed. Use POST to accept join requests.'
    }, { status: 405 });
}