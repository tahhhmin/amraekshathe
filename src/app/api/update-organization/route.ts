import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/connectDB';
import Organization from '@/models/Organization';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { organizationName, description, website, phone, address } = await request.json();

    if (!organizationName) {
      return NextResponse.json({ error: 'Organization name is required' }, { status: 400 });
    }

    await dbConnect();

    const updatedOrganization = await Organization.findOneAndUpdate(
      { email: session.user.email },
      {
        organizationName,
        description,
        website,
        phone,
        address,
      },
      { new: true }
    );

    if (!updatedOrganization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, organization: updatedOrganization });
  } catch (error) {
    console.error('Error updating organization:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}