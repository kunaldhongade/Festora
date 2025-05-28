import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get('owner');

    console.log("API: Fetching events for owner:", owner);  // <-- Add this log

    const db = await connectToDatabase();

    // Make sure to convert owner to lowercase
    const query = owner ? { owner: owner.toLowerCase() } : {};

    const events = await db.collection('events').find(query).toArray();

    console.log("API: Events fetched:", events);  // <-- Add this log

    return NextResponse.json(events);
  } catch (error) {
    console.error('API: Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
