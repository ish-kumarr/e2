import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import Order from '@/lib/database/models/order.model';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const eventId = searchParams.get('eventId');

  if (!userId || !eventId) {
    return NextResponse.json({ message: 'Missing userId or eventId' }, { status: 400 });
  }

  try {
    await connectToDatabase();

    // Query the Order collection to check if the user has purchased a ticket for the event
    const order = await Order.findOne({
      buyer: userId,
      event: eventId,
    });

    const hasPurchased = !!order;

    return NextResponse.json({ hasPurchased }, { status: 200 });
  } catch (error) {
    console.error('Error checking ticket purchase:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
