import { getOrdersByEvent } from '@/lib/actions/order.actions'
import UpdatedEventDashboard from './UpdatedEventDashboard'

export default async function DashboardPage({ params }: { params: { eventId: string } }) {
  const eventId = params.eventId
  
  try {
    const initialOrders = await getOrdersByEvent({ eventId, searchString: '' })
    
    return <UpdatedEventDashboard initialOrders={initialOrders} eventId={eventId} />
  } catch (error) {
    console.error('Error loading dashboard:', error)
    return <div className="min-h-screen bg-gray-950 pt-[100px] lg:pt-[120px] text-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-center">Error loading dashboard</h1>
      <p className="text-center">Please try again later or contact support.</p>
    </div>
  }
}