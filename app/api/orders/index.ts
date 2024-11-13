import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/database';
import Order from '@/lib/database/models/order.model';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();

    const { eventId, userId } = req.query;

    if (!eventId || !userId) {
      return res.status(400).json({ error: 'Event ID and User ID are required' });
    }

    const order = await Order.findOne({ event: eventId, buyer: userId }).populate('event').populate('buyer');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
