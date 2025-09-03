// src/app/api/organization/volunteers/get-all/route.ts

import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import Organization from '@/models/Organization';
import Volunteer from '@/models/Volunteer';

interface QueryParams {
    organizationId?: string;
    page?: string;
    limit?: string;
    sortBy?: 'joinedAt' | 'name' | 'email' | 'role';
    sortOrder?: 'asc' | 'desc';
    role?: string;
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
        const organizationId = searchParams.get('organizationId');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const sortBy = searchParams.get('sortBy') || 'joinedAt';
        const sortOrder = searchParams.get('sortOrder') || 'desc';
        const role = searchParams.get('role');
        const search = searchParams.get('search');

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

        // Find the organization to get volunteer list
        const organization = await Organization.findById(organizationId);
        if (!organization) {
            return NextResponse.json({
                success: false,
                message: 'Organization not found'
            }, { status: 404 });
        }

        // Get volunteer IDs from organization
        let volunteerData = organization.volunteers || [];

        // Filter by role if specified
        if (role) {
            volunteerData = volunteerData.filter((vol: any) => vol.role === role);
        }

        // Get volunteer IDs for database query
        const volunteerIds = volunteerData.map((vol: any) => vol.volunteerId);

        if (volunteerIds.length === 0) {
            return NextResponse.json({
                success: true,
                data: {
                    volunteers: [],
                    pagination: {
                        currentPage: page,
                        totalPages: 0,
                        totalCount: 0,
                        limit,
                        hasNextPage: false,
                        hasPrevPage: false
                    },
                    summary: {
                        total: 0,
                        roles: {}
                    }
                }
            });
        }

        // Build volunteer query filter
        const volunteerFilter: any = { 
            _id: { $in: volunteerIds.map((id: string) => new mongoose.Types.ObjectId(id)) }
        };

        // Add search filter if provided
        if (search) {
            volunteerFilter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Get total count for pagination
        const totalCount = await Volunteer.countDocuments(volunteerFilter);

        // Build sort object
        const sortObj: any = {};
        if (['name', 'email'].includes(sortBy)) {
            sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;
        } else {
            // For joinedAt and role, we'll sort after merging data
            sortObj.name = 1; // Default sort by name for now
        }

        // Calculate skip value for pagination
        const skip = (page - 1) * limit;

        // Fetch volunteers
        const volunteers = await Volunteer.find(volunteerFilter)
            .select('name email image dateOfBirth createdAt')
            .sort(sortObj)
            .skip(skip)
            .limit(limit)
            .lean();

        // Merge volunteer data with organization volunteer info (role, joinedAt)
        const enrichedVolunteers = volunteers.map((volunteer: any) => {
            const orgVolunteerInfo = volunteerData.find((vol: any) => 
                vol.volunteerId.toString() === volunteer._id.toString()
            );

            return {
                ...volunteer,
                role: orgVolunteerInfo?.role || 'volunteer',
                joinedAt: orgVolunteerInfo?.joinedAt || volunteer.createdAt,
                organizationVolunteerId: orgVolunteerInfo?.volunteerId
            };
        });

        // Sort by joinedAt or role if specified (after merging)
        if (sortBy === 'joinedAt') {
            enrichedVolunteers.sort((a, b) => {
                const dateA = new Date(a.joinedAt).getTime();
                const dateB = new Date(b.joinedAt).getTime();
                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            });
        } else if (sortBy === 'role') {
            enrichedVolunteers.sort((a, b) => {
                const comparison = a.role.localeCompare(b.role);
                return sortOrder === 'asc' ? comparison : -comparison;
            });
        }

        // Calculate pagination info
        const totalPages = Math.ceil(totalCount / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        // Generate role summary
        const roleSummary: Record<string, number> = {};
        volunteerData.forEach((vol: any) => {
            const role = vol.role || 'volunteer';
            roleSummary[role] = (roleSummary[role] || 0) + 1;
        });

        return NextResponse.json({
            success: true,
            data: {
                volunteers: enrichedVolunteers,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalCount,
                    limit,
                    hasNextPage,
                    hasPrevPage
                },
                summary: {
                    total: volunteerData.length,
                    roles: roleSummary
                },
                filters: {
                    organizationId,
                    role: role || 'all',
                    search: search || null,
                    sortBy,
                    sortOrder
                }
            }
        });

    } catch (error: unknown) {
        console.error('Error fetching organization volunteers:', error);
        
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
        message: 'Method not allowed. Use GET to fetch volunteers.'
    }, { status: 405 });
}

export async function PUT() {
    return NextResponse.json({
        success: false,
        message: 'Method not allowed. Use GET to fetch volunteers.'
    }, { status: 405 });
}

export async function DELETE() {
    return NextResponse.json({
        success: false,
        message: 'Method not allowed. Use GET to fetch volunteers.'
    }, { status: 405 });
}