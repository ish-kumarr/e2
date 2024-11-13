import { NextResponse } from 'next/server';
import Order from '@/lib/database/models/order.model';
import { connectToDatabase } from '@/lib/database';
import { CreateOrderParams } from '@/types';
import { generateTicketId } from '@/utils/generateTicketId'; // Import the ticket ID generator

export async function POST(request: Request) {
  try {
    const { eventId, userId, amount, razorpayPaymentId, razorpayOrderId, razorpaySignature } = await request.json();
    
    await connectToDatabase();

    // Generate a unique 6-digit alphanumeric ticket ID
    const ticketId = generateTicketId(); // Generate ticket ID

    const newOrder = await Order.create({
      createdAt: new Date(),
      ticketId, // Include the ticket ID in the order
      razorpayPaymentId: amount === 0 ? null : razorpayPaymentId,
      razorpayOrderId: amount === 0 ? null : razorpayOrderId,
      razorpaySignature: amount === 0 ? null : razorpaySignature,
      totalAmount: amount,
      event: eventId,
      buyer: userId,
    });

    return NextResponse.json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
