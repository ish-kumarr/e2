import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getAuth } from '@clerk/nextjs/server';
import dayjs from'dayjs'; 


export async function POST(request: Request) {
  const { razorpayPaymentId, razorpayOrderId, userEmail, eventTitle, amountPaid, Payment, firstname } = await request.json();

  try {

        // Get the current date and time of payment
        const paymentDate = dayjs().format('MMMM D, YYYY h:mm A'); // Format: August 16, 2024 5:30 PM// Configure your email transportconst transporter = nodemailer.createTransport({

    // Configure your email transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
        
      from: 'no-reply@eventia.com',
      to: userEmail,
      subject: 'Payment Confirmation',
      text: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Confirmation - Eventia</title>
</head>
<body style="background-color: #f4f4f4; font-family: Arial, sans-serif; margin: 0; padding: 0;">
  <div style="display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 16px;">
    <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); max-width: 600px; width: 100%;">
      <div style="background-color: #0033cc; color: #ffffff; text-align: center; padding: 24px; border-top-left-radius: 8px; border-top-right-radius: 8px;">
        <h1 style="font-size: 32px; font-weight: bold; margin: 0;">🎉 Payment Confirmed!</h1>
        <p style="font-size: 16px; margin-top: 8px;">Thank you for your purchase!</p>
      </div>
      <div style="padding: 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <svg xmlns="http://www.w3.org/2000/svg" style="height: 96px; width: 96px; color: #0033cc;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"/>
          </svg>
        </div>
        <h2 style="font-size: 24px; font-weight: 600; color: #333333; text-align: center; margin-bottom: 16px;">Your Payment Was Successful!</h2>
        <p style="color: #333333; margin-bottom: 16px; text-align: center;">Dear ${firstname},</p>
        <p style="color: #333333; margin-bottom: 16px; text-align: center;">We're thrilled to confirm that your payment for the event "<strong>${eventTitle}</strong>" has been processed successfully.</p>
        <div style="background-color: #e3f2fd; border: 1px solid #90caf9; border-radius: 6px; padding: 16px; margin: 16px 0; text-align: center;">
          <p style="font-size: 24px; font-weight: bold; color: #0033cc; margin: 0;"><strong>Amount Paid:</strong></p>
          <p style="font-size: 28px; font-weight: bold; color: #0033cc; margin: 0;">₹${(amountPaid / 100).toFixed(2)} INR</p>
        </div>
        <h3 style="font-size: 20px; font-weight: 600; color: #333333; margin-bottom: 8px; text-align: center;">Payment Details</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tbody>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 12px; font-weight: bold; color: #333333;">Payment ID:</td>
              <td style="padding: 12px; color: #333333;">${razorpayPaymentId}</td>
            </tr>
            <tr>
              <td style="padding: 12px; font-weight: bold; color: #333333;">Order ID:</td>
              <td style="padding: 12px; color: #333333;">${razorpayOrderId}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 12px; font-weight: bold; color: #333333;">Date & Time:</td>
              <td style="padding: 12px; color: #333333;">${paymentDate}</td>
            </tr>
          </tbody>
        </table>
        <p style="color: #333333; margin-bottom: 24px; text-align: center;">Thank you for your support. We can't wait to see you at the event and share an amazing experience together!</p>
        <div style="text-align: center; margin-bottom: 24px;">
          <a href="https://eventia.com" style="background-color: #0033cc; color: #ffffff; padding: 12px 24px; border-radius: 6px; font-size: 18px; font-weight: bold; text-decoration: none; display: inline-block;">Explore More on Eventia</a>
        </div>
        <div style="text-align: center; color: #666666;">
          <p>Have questions? Contact us at <a href="mailto:support@eventia.com" style="color: #0033cc; text-decoration: underline;">support@eventia.com</a>.</p>
        </div>
      </div>
      <div style="background-color: #e3f2fd; text-align: center; padding: 16px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
        <p style="color: #666666;">© 2024 Eventia. All rights reserved. <br> Follow us on <a href="https://twitter.com/eventia" style="color: #0033cc; text-decoration: underline;">Twitter</a> and <a href="https://facebook.com/eventia" style="color: #0033cc; text-decoration: underline;">Facebook</a>.</p>
      </div>
    </div>
  </div>
</body>
</html>

`,
headers: {
    'Content-Type': 'text/html; charset=utf-8'
  }  };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return NextResponse.json({ error: 'Failed to send confirmation email' }, { status: 500 });
  }
}
