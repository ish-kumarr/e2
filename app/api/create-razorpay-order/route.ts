import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!
});

export async function POST(request: Request) {
  const { eventId, userId, amount } = await request.json();

  try {
    const options = {
      amount: amount, // amount in the smallest currency unit
      currency: 'INR',
      receipt: `receipt_order_${eventId}`,
      payment_capture: 1,
      notes: {
        eventId,
        userId
      }
    };

    const order = await razorpayInstance.orders.create(options);
    return NextResponse.json({ orderId: order.id, amount: order.amount });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
