// app/api/projects/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/connectDB';
import Project from '@/models/Project';
import Organization from '@/models/Organization';
import GoogleProvider from 'next-auth/providers/google';
import dbConnect from '@/lib/connectDB';
import Volunteer from '@/models/Volunteer';

// Auth options (same as your NextAuth config)
const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }: any) {
      if (account?.provider === 'google') {
        try {
          await dbConnect();
          
          const existingVolunteer = await Volunteer.findOne({ email: user.email });
          const existingOrganization = await Organization.findOne({ email: user.email });
          
          if (existingVolunteer || existingOrganization) {
            return true;
          }
          
          return true;
        } catch (error) {
          console.error('Error during sign in:', error);
          return false;
        }
      }
      return true;
    },
    
    async session({ session }: any) {
      if (session.user?.email) {
        await dbConnect();
        
        let dbUser = await Volunteer.findOne({ email: session.user.email });
        let accountType = 'volunteer';
        
        if (!dbUser) {
          dbUser = await Organization.findOne({ email: session.user.email });
          accountType = 'organization';
        }
        
        if (!dbUser) {
          return session;
        }
        
        return {
          ...session,
          user: {
            ...session.user,
            id: dbUser._id.toString(),
            accountType,
            isAdmin: dbUser.isAdmin || false,
            isVerified: dbUser.isVerified || false,
          },
        };
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    if (session.user.accountType !== 'organization') {
      return NextResponse.json({ message: 'Only organizations can create projects' }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, address, coordinates } = body;
    
    if (!title || !description || !address || !coordinates) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    // Verify organization exists
    const organization = await Organization.findOne({ email: session.user.email });
    if (!organization) {
      return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
    }

    // Create new project
    const project = new Project({
      ownerOrganisation: organization._id.toString(),
      title,
      description,
      address,
      coordinates,
      volunteers: [],
      status: 'draft'
    });

    await project.save();

    return NextResponse.json({ 
      message: 'Project created successfully',
      project: {
        id: project._id,
        title: project.title,
        description: project.description,
        address: project.address,
        status: project.status
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}