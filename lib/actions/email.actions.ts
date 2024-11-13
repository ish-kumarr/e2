'use server'

import { revalidatePath } from 'next/cache'
import { connectToDatabase } from '@/lib/database'
import Order from '@/lib/database/models/order.model'
import { handleError } from '@/lib/utils'

export const resendTicket = async (orderId: string) => {
  try {
    await connectToDatabase()

    const order = await Order.findById(orderId).populate('event').populate('buyer')

    if (!order) {
      throw new Error('Order not found')
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/send-ticket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userEmail: order.buyer.email,
        eventTitle: order.event.title,
        firstname: order.buyer.firstName,
        lastname: order.buyer.lastName,
        date: new Date(order.event.startDateTime).toLocaleDateString(),
        time: new Date(order.event.startDateTime).toLocaleTimeString(),
        location: order.event.location,
        ticketid: order.ticketId,
      }),
    })

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error)
    }

    revalidatePath('/profile')

    return { success: true }
  } catch (error) {
    handleError(error)
  }
}