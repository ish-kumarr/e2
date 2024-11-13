import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import dayjs from 'dayjs'

export async function POST(request: Request) {
  const { userEmail, eventTitle, firstname, lastname, date, time, location, ticketid } = await request.json()

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const mailOptions = {
      from: 'no-reply@eventia.com',
      to: userEmail,
      subject: 'Your Eventia Fest Ticket',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your Eventia Fest Ticket</title>
            <style>
                @media only screen and (max-width: 600px) {
                    .container {
                        width: 100% !important;
                        padding: 10px !important;
                    }
                    .header {
                        padding: 20px 15px !important;
                        border-top-left-radius: 16px !important;
                        border-top-right-radius: 16px !important;
                    }
                    .content {
                        padding: 20px 15px !important;
                    }
                    .ticket-info td {
                        display: block !important;
                        width: 100% !important;
                        padding: 10px 15px !important;
                    }
                    .ticket-info td + td {
                        padding-top: 0 !important;
                    }
                    .footer {
                        padding: 20px 15px !important;
                    }
                }
            </style>
        </head>
        <body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; background-color: #f4f4f8; margin: 0; padding: 0;">
            <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td align="center" style="padding: 20px 0;">
                        <table class="container" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <tr>
                                <td class="header" style="padding: 40px 30px; background: linear-gradient(135deg, #6366f1, #8b5cf6); text-align: center; border-top-left-radius: 16px; border-top-right-radius: 16px;">
                                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px;">Eventia Events</h1>
                                    <p style="color: #e0e7ff; margin: 10px 0 0; font-size: 18px; font-weight: 300;">Your ticket to an unforgettable experience</p>
                                </td>
                            </tr>
                            <tr>
                                <td class="content" style="padding: 30px;">
                                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                                        <tr>
                                            <td style="padding: 30px;">
                                                <h2 style="margin: 0 0 20px; font-size: 24px; color: #1e293b; font-weight: 700;">Hey ${firstname} ${lastname},</h2>
                                                <p style="margin: 0 0 20px; font-size: 16px; color: #475569;">Get ready for the exciting event! Here's your golden ticket to the ${eventTitle}</p>
                                                <table width="100%" cellpadding="0" cellspacing="0">
                                                    <tr>
                                                        <td style="padding: 15px; background-color: #e0e7ff; border-radius: 8px;">
                                                            <p style="margin: 0; font-size: 14px; color: #4338ca; font-weight: 600;">EVENT</p>
                                                            <p style="margin: 5px 0 0; font-size: 18px; color: #1e293b; font-weight: 700;">${eventTitle}</p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding: 15px 0;">
                                                            <table class="ticket-info" width="100%" cellpadding="0" cellspacing="0">
                                                                <tr>
                                                                    <td style="padding: 10px 15px; background-color: #f1f5f9; border-radius: 8px;">
                                                                        <p style="margin: 0; font-size: 14px; color: #64748b;">DATE</p>
                                                                        <p style="margin: 5px 0 0; font-size: 16px; color: #1e293b; font-weight: 600;">${date}</p>
                                                                    </td>
                                                                    <td width="20"></td>
                                                                    <td style="padding: 10px 15px; background-color: #f1f5f9; border-radius: 8px;">
                                                                        <p style="margin: 0; font-size: 14px; color: #64748b;">TIME</p>
                                                                        <p style="margin: 5px 0 0; font-size: 16px; color: #1e293b; font-weight: 600;">${time}</p>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding: 15px; background-color: #f1f5f9; border-radius: 8px;">
                                                            <p style="margin: 0; font-size: 14px; color: #64748b;">VENUE</p>
                                                            <p style="margin: 5px 0 0; font-size: 16px; color: #1e293b; font-weight: 600;">${location}</p>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 0 30px 30px;">
                                                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1e293b; border-radius: 8px; overflow: hidden;">
                                                    <tr>
                                                        <td style="padding: 20px; text-align: center;">
                                                            <p style="margin: 0 0 10px; font-size: 14px; color: #94a3b8;">YOUR TICKET CODE</p>
                                                            <p style="margin: 0; font-family: monospace; font-size: 24px; color: #ffffff; letter-spacing: 2px; font-weight: 700;">${ticketid}</p>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td style="padding: 30px 0 0;">
                                                <a href="https://eventia.ishkumar.com" style="display: block; background-color: #6366f1; color: #ffffff; text-decoration: none; text-align: center; padding: 15px 20px; border-radius: 8px; font-weight: 600; font-size: 16px;">Explore More</a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td class="content" style="background-color: #f8fafc; padding: 30px;">
                                    <h3 style="margin: 0 0 15px; font-size: 18px; color: #1e293b; font-weight: 700;">Important Information:</h3>
                                    <ul style="margin: 0; padding: 0 0 0 20px; color: #475569; font-size: 14px;">
                                        <li style="margin-bottom: 10px;">This ticket is non-transferrable and tied to your purchase.</li>
                                        <li style="margin-bottom: 10px;">Please bring a valid ID matching the name on your ticket.</li>
                                        <li style="margin-bottom: 10px;">Refrain from sharing this e-mail to anyone.</li>
                                        <li style="margin-bottom: 10px;">For any queries, contact us at support@eventia.com.</li>
                                    </ul>
                                </td>
                            </tr>
                            <tr>
                                <td class="footer" style="background-color: #e2e8f0; padding: 20px; text-align: center;">
                                    <p style="margin: 0; font-size: 14px; color: #64748b;">&copy; ${dayjs().format('YYYY')} Eventia. All rights reserved.</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
      `,
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending confirmation email:', error)
    return NextResponse.json({ error: 'Failed to send confirmation email' }, { status: 500 })
  }
}