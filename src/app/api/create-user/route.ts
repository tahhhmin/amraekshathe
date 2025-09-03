import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDB';
import Volunteer from '@/models/Volunteer';
import Organization from '@/models/Organization';

export async function POST(request: NextRequest) {
  try {
    const { accountType, name, email, image } = await request.json();

    if (!accountType || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();

    // Check if user already exists
    const existingVolunteer = await Volunteer.findOne({ email });
    const existingOrganization = await Organization.findOne({ email });

    if (existingVolunteer || existingOrganization) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Create user in appropriate collection
    if (accountType === 'volunteer') {
      await Volunteer.create({
        name,
        email,
        image,
        isAdmin: false,
      });
    } else {
      await Organization.create({
        name,
        email,
        image,
        organizationName: name,
        isVerified: false,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}