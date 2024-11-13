import { getOrdersByEvent } from '@/lib/actions/order.actions'
import OrdersClient from './OrdersClient'

export default async function Orders({ searchParams }: { searchParams: { eventId?: string, query?: string } }) {
  const eventId = searchParams.eventId || ''
  const searchTerm = searchParams.query || ""
  
  try {
    console.log('Fetching initial orders for eventId:', eventId)
    const initialOrders = await getOrdersByEvent({ eventId, searchString: searchTerm })
    console.log('Initial orders fetched:', initialOrders.length)

    if (initialOrders.length === 0) {
      console.log('No orders found for this event')
    }

    return <OrdersClient initialOrders={initialOrders} eventId={eventId} initialSearchTerm={searchTerm} />
  } catch (error) {
    console.error('Error fetching initial orders:', error)
    return <div className="min-h-screen bg-gray-950 pt-[100px] lg:pt-[120px] text-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-center">Error loading orders</h1>
      <p className="text-center">Please try again later or contact support if the problem persists.</p>
    </div>
  }
}