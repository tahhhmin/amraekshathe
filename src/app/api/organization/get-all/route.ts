
// First, create the API route: app/api/organizations/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDB';
import Organization from '@/models/Organization';

export async function GET() {
  try {
    await dbConnect();
    const organizations = await Organization.find({}).sort({ createdAt: -1 });
    return NextResponse.json(organizations);
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json({ error: 'Failed to fetch organizations' }, { status: 500 });
  }
}