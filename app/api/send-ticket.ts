import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import dayjs from 'dayjs'; 
import Order from '@/lib/database/models/order.model'; // Adjust the path to match your structure

export async function POST(request: Request) {
  try {
    const { ticketId } = await request.json();

    // Fetch the order details using the ticketId
    const order = await Order.findOne({ ticketId }).populate('event buyer');

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Prepare data for email
    const paymentDate = dayjs(order.createdAt).format('MMMM D, YYYY h:mm A'); // Format the payment date
    const userEmail = order.buyer.email;
    const firstname = order.buyer.firstName;
    const lastname = order.buyer.lastName;
    const eventTitle = order.event.title;
    const amountPaid = order.totalAmount;
    const razorpayPaymentId = order.razorpayPaymentId || '';
    const razorpayOrderId = order.razorpayOrderId || '';
    const date = dayjs().format('MMMM D, YYYY'); // current date (you can use order.createdAt)
    const time = dayjs().format('h:mm A'); // current time (you can use order.createdAt)
    const location = 'Event Location Here'; // Add event location if needed

    // Configure your email transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content with the ticket template
    const mailOptions = {
      from: 'no-reply@eventia.com',
      to: userEmail,
      subject: 'Your Eventia Fest Ticket',
      html: `
        <h3>Dear ${firstname} ${lastname},</h3>
        <p>Thank you for your payment for the event <strong>${eventTitle}</strong>.</p>
        <p>Payment Details:</p>
        <ul>
          <li><strong>Payment Date:</strong> ${paymentDate}</li>
          <li><strong>Amount Paid:</strong> ₹${amountPaid}</li>
          <li><strong>Razorpay Payment ID:</strong> ${razorpayPaymentId}</li>
          <li><strong>Razorpay Order ID:</strong> ${razorpayOrderId}</li>
          <li><strong>Ticket ID:</strong> ${order.ticketId}</li>
          <li><strong>Event Date:</strong> ${date}</li>
          <li><strong>Event Time:</strong> ${time}</li>
          <li><strong>Location:</strong> ${location}</li>
        </ul>
        <p>We look forward to seeing you at the event!</p>
      `,
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return NextResponse.json({ error: 'Failed to send confirmation email' }, { status: 500 });
  }
}
