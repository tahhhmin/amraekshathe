// src/app/api/projects/get-all/route.ts

import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import Project from '@/models/Project';
import Organization from '@/models/Organization';

interface QueryParams {
    page?: string;
    limit?: string;
    status?: 'draft' | 'active' | 'completed' | 'cancelled';
    organizationId?: string;
    sortBy?: 'createdAt' | 'title' | 'status';
    sortOrder?: 'asc' | 'desc';
    search?: string;
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
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const status = searchParams.get('status') as 'draft' | 'active' | 'completed' | 'cancelled' | null;
        const organizationId = searchParams.get('organizationId');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') || 'desc';
        const search = searchParams.get('search');

        // Validate pagination parameters
        if (page < 1 || limit < 1 || limit > 50) {
            return NextResponse.json({
                success: false,
                message: 'Invalid pagination parameters. Page must be >= 1, limit must be between 1-50'
            }, { status: 400 });
        }

        // Validate organizationId if provided
        if (organizationId && !mongoose.Types.ObjectId.isValid(organizationId)) {
            return NextResponse.json({
                success: false,
                message: 'Invalid organization ID format'
            }, { status: 400 });
        }

        // Build query filter
        const filter: any = {};
        
        // Add status filter if provided
        if (status && ['draft', 'active', 'completed', 'cancelled'].includes(status)) {
            filter.status = status;
        }

        // Add organization filter if provided
        if (organizationId) {
            filter.ownerOrganisationId = { $in: [organizationId] };
        }

        // Add search filter if provided
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { address: { $regex: search, $options: 'i' } }
            ];
        }

        // Build sort object
        const sortObj: any = {};
        if (['createdAt', 'updatedAt', 'title', 'status'].includes(sortBy)) {
            sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;
        } else {
            sortObj.createdAt = -1; // Default sort
        }

        // Calculate skip value for pagination
        const skip = (page - 1) * limit;

        // Get total count for pagination info
        const totalCount = await Project.countDocuments(filter);

        // Fetch projects
        const projects = await Project.find(filter)
            .sort(sortObj)
            .skip(skip)
            .limit(limit)
            .lean();

        // Enrich projects with organization data
        const enrichedProjects = await Promise.all(
            projects.map(async (project: any) => {
                let organization = null;
                
                // Check if ownerOrganisationId exists and has at least one element
                if (project.ownerOrganisationId && project.ownerOrganisationId.length > 0) {
                    const orgId = project.ownerOrganisationId[0];
                    if (orgId) {
                        try {
                            organization = await Organization.findById(orgId)
                                .select('organizationName name image email')
                                .lean();
                        } catch (err) {
                            console.warn(`Failed to fetch organization ${orgId}:`, err);
                        }
                    }
                }

                return {
                    ...project,
                    organization,
                    volunteerCount: project.volunteers ? project.volunteers.length : 0
                };
            })
        );

        // Calculate pagination info
        const totalPages = Math.ceil(totalCount / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        // Generate status summary
        const statusSummary = await Project.aggregate([
            ...(organizationId ? [{ $match: { ownerOrganisationId: { $in: [organizationId] } } }] : []),
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const summary = {
            draft: 0,
            active: 0,
            completed: 0,
            cancelled: 0,
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
                projects: enrichedProjects,
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
                    status: status || 'all',
                    organizationId: organizationId || null,
                    search: search || null,
                    sortBy,
                    sortOrder
                }
            }
        });

    } catch (error: unknown) {
        console.error('Error fetching projects:', error);
        
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
        message: 'Method not allowed. Use GET to fetch projects.'
    }, { status: 405 });
}

export async function PUT() {
    return NextResponse.json({
        success: false,
        message: 'Method not allowed. Use GET to fetch projects.'
    }, { status: 405 });
}

export async function DELETE() {
    return NextResponse.json({
        success: false,
        message: 'Method not allowed. Use GET to fetch projects.'
    }, { status: 405 });
}