// src/app/api/organization/join-request/get-all/route.ts

import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import JoinRequest from '@/models/JoinRequest';

// TypeScript interfaces
interface QueryParams {
    organizationId?: string;
    status?: 'pending' | 'accepted' | 'rejected';
    page?: string;
    limit?: string;
    sortBy?: 'createdAt' | 'status' | 'requestby';
    sortOrder?: 'asc' | 'desc';
}

export async function GET(request: NextRequest) {
    try {
        // Connect to MongoDB if not already connected
        if (mongoose.connection.readyState !== 1) {
            if (!process.env.MONGODB_URI) {
                throw new Error('MONGODB_URI is not defined');
            }
            await mongoose.connect(process.env.MONGODB_URI);
        }

        const { searchParams } = new URL(request.url);
        
        // Extract query parameters
        const organizationId = searchParams.get('organizationId');
        const status = searchParams.get('status') as 'pending' | 'accepted' | 'rejected' | null;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        // Validate required parameters
        if (!organizationId) {
            return NextResponse.json({
                success: false,
                message: 'Organization ID is required'
            }, { status: 400 });
        }

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(organizationId)) {
            return NextResponse.json({
                success: false,
                message: 'Invalid organization ID format'
            }, { status: 400 });
        }

        // Validate pagination parameters
        if (page < 1 || limit < 1 || limit > 100) {
            return NextResponse.json({
                success: false,
                message: 'Invalid pagination parameters. Page must be >= 1, limit must be between 1-100'
            }, { status: 400 });
        }

        // Build query filter
        const filter: any = { organizationId };
        
        // Add status filter if provided
        if (status && ['pending', 'accepted', 'rejected'].includes(status)) {
            filter.status = status;
        }

        // Build sort object
        const sortObj: any = {};
        if (['createdAt', 'updatedAt', 'status', 'requestby'].includes(sortBy)) {
            sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;
        } else {
            sortObj.createdAt = -1; // Default sort
        }

        // Calculate skip value for pagination
        const skip = (page - 1) * limit;

        // Get total count for pagination info
        const totalCount = await JoinRequest.countDocuments(filter);

        // Fetch join requests with pagination and population
        const joinRequests = await JoinRequest.find(filter)
            .populate('volunteerId', 'name email image dateOfBirth')
            .populate('organizationId', 'organizationName name email image')
            .sort(sortObj)
            .skip(skip)
            .limit(limit)
            .lean(); // Use lean() for better performance

        // Calculate pagination info
        const totalPages = Math.ceil(totalCount / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        // Group requests by status for summary
        const statusSummary = await JoinRequest.aggregate([
            { $match: { organizationId: new mongoose.Types.ObjectId(organizationId) } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const summary = {
            pending: 0,
            accepted: 0,
            rejected: 0,
            total: totalCount
        };

        statusSummary.forEach((item: { _id: string, count: number }) => {
            if (item._id in summary) {
                (summary as any)[item._id] = item.count;
            }
        });

        return NextResponse.json({
            success: true,
            data: {
                joinRequests,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalCount,
                    limit,
                    hasNextPage,
                    hasPrevPage
                },
                summary,
                filters: {
                    organizationId,
                    status: status || 'all',
                    sortBy,
                    sortOrder
                }
            }
        });

    } catch (error: unknown) {
        console.error('Error fetching join requests:', error);
        
        return NextResponse.json({
            success: false,
            message: 'Internal server error'
        }, { status: 500 });
    }
}

// Handle unsupported methods
export async function POST() {
    return NextResponse.json({
        success: false,
        message: 'Method not allowed. Use GET to fetch join requests.'
    }, { status: 405 });
}

export async function PUT() {
    return NextResponse.json({
        success: false,
        message: 'Method not allowed. Use GET to fetch join requests.'
    }, { status: 405 });
}

export async function DELETE() {
    return NextResponse.json({
        success: false,
        message: 'Method not allowed. Use GET to fetch join requests.'
    }, { status: 405 });
}