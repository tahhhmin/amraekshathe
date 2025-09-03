import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/connectDB';
import Volunteer from '@/models/Volunteer';
import Organization from '@/models/Organization';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    let { accountType } = body;

    // If no accountType in body, check if it was stored in the request
    if (!accountType) {
      // This could be called from the signin callback
      // We'll need to get the accountType from somewhere
      return NextResponse.json({ error: 'Account type is required' }, { status: 400 });
    }

    if (!['volunteer', 'organization'].includes(accountType)) {
      return NextResponse.json({ error: 'Invalid account type' }, { status: 400 });
    }

    await dbConnect();

    // Check if user already exists
    const existingVolunteer = await Volunteer.findOne({ email: session.user.email });
    const existingOrganization = await Organization.findOne({ email: session.user.email });

    if (existingVolunteer || existingOrganization) {
      return NextResponse.json({ error: 'Account already exists' }, { status: 400 });
    }

    // Create new account based on type
    if (accountType === 'volunteer') {
      await Volunteer.create({
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        googleId: session.user.id,
        isAdmin: false,
      });
    } else {
      await Organization.create({
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        googleId: session.user.id,
        organizationName: session.user.name || 'Organization',
        isVerified: false,
        accountType: 'organization',
      });
    }

    return NextResponse.json({ success: true, accountType });
  } catch (error) {
    console.error('Error creating account:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}