import { Schema, model, models, Document } from 'mongoose';

export interface IOrder extends Document {
  createdAt: Date;
  ticketId: string; // Unique identifier for the ticket
  razorpayPaymentId?: string; // Optional, if you don't always have this
  razorpayOrderId?: string; // Optional
  razorpaySignature?: string; // Optional
  totalAmount: string;
  event: {
    _id: string;
    title: string;
  };
  buyer: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}

export type IOrderItem = {
  ticketId: any;
  _id: string
  totalAmount: string
  createdAt: Date
  eventTitle: string
  eventId: string
  buyer: string
}

const OrderSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  ticketId: {
    type: String,
    required: true 
  },
  razorpayPaymentId: {
    type: String,
  },
  razorpaySignature: {
    type: String,
  },
  totalAmount: {
    type: String,
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
 
});

const Order = models.Order || model('Order', OrderSchema);

export default Order;
