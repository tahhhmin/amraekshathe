// /app/api/volunteer/get-joined-orgs/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/connectDB';
import Organization from '@/models/Organization';
import Volunteer from '@/models/Volunteer';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Import your authOptions

interface VolunteerInOrg {
  volunteerId: string;
  role: string;
  joinedAt: Date;
}

interface OrganizationDocument {
  _id: string;
  name: string;
  organizationName: string;
  image?: string;
  email: string;
  volunteers: VolunteerInOrg[];
  projects: { projectId: string }[];
  createdAt: Date;
}

interface OrganizationResponse {
  _id: string;
  name: string;
  organizationName: string;
  image?: string;
  email: string;
  projectCount: number;
  volunteerCount: number;
  role: string;
  joinedAt: Date;
  createdAt: Date;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const volunteerId = session.user.id;

    // Get organizations where this volunteer is in the volunteers array
    const organizations: OrganizationDocument[] = await Organization.find({
      'volunteers.volunteerId': volunteerId
    }).select('name organizationName image email volunteers projects createdAt');

    // Get the volunteer's role in each organization
    const organizationsWithRole: OrganizationResponse[] = organizations.map((org: OrganizationDocument) => {
      const volunteerData = org.volunteers.find((vol: VolunteerInOrg) => vol.volunteerId === volunteerId);
      
      return {
        _id: org._id,
        name: org.name,
        organizationName: org.organizationName,
        image: org.image,
        email: org.email,
        projectCount: org.projects.length,
        volunteerCount: org.volunteers.length,
        role: volunteerData?.role || 'volunteer',
        joinedAt: volunteerData?.joinedAt || new Date(),
        createdAt: org.createdAt
      };
    });

    return NextResponse.json(organizationsWithRole);

  } catch (error) {
    console.error('Error fetching volunteer organizations:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}